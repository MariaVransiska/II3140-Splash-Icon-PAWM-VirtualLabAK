/**
 * Quiz Service (Simplified)
 * Handles quiz score storage using quiz_scores JSONB column
 */

import { supabase } from '../client';

export type QuizScore = {
  quizId: string;
  title: string;
  score: number;
  completedAt: string;
};

// ============================================
// SAVE QUIZ SCORE
// ============================================

export async function saveQuizScore(
  userId: string,
  quizId: string,
  title: string,
  score: number
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📊 Saving quiz score to database...');
    
    // Get current scores
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('quiz_scores')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return {
        success: false,
        message: fetchError.message,
      };
    }

    const currentScores = (userData?.quiz_scores as QuizScore[]) || [];
    
    // Check if quiz already has a score
    const existingIndex = currentScores.findIndex(
      (s: QuizScore) => s.quizId === quizId
    );

    const newScore: QuizScore = {
      quizId,
      title,
      score,
      completedAt: new Date().toISOString(),
    };

    let updatedScores: QuizScore[];
    if (existingIndex >= 0) {
      // Update only if new score is higher
      const existingScore = currentScores[existingIndex];
      if (score > existingScore.score) {
        updatedScores = [...currentScores];
        updatedScores[existingIndex] = newScore;
        console.log(`✅ New high score! ${existingScore.score} → ${score}`);
      } else {
        console.log(`⚠️ Score ${score} not higher than existing ${existingScore.score}`);
        return {
          success: true,
          message: 'Score saved (not a new high score)',
        };
      }
    } else {
      // Add new score
      updatedScores = [...currentScores, newScore];
      console.log('✅ First score for this quiz');
    }

    // Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({ quiz_scores: updatedScores })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return {
        success: false,
        message: updateError.message,
      };
    }

    console.log('✅ Quiz score saved successfully');
    return {
      success: true,
      message: 'Quiz score saved successfully',
    };
  } catch (error: any) {
    console.error('❌ Save quiz score exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to save quiz score',
    };
  }
}

// ============================================
// GET ALL QUIZ SCORES
// ============================================

export async function getQuizScores(
  userId: string
): Promise<{ success: boolean; message: string; scores?: QuizScore[] }> {
  try {
    console.log('📋 Loading quiz scores from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select('quiz_scores')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Get quiz scores error:', error);
      return {
        success: false,
        message: error.message,
        scores: [],
      };
    }

    console.log('✅ Quiz scores loaded successfully');
    return {
      success: true,
      message: 'Quiz scores loaded successfully',
      scores: (data.quiz_scores as QuizScore[]) || [],
    };
  } catch (error: any) {
    console.error('❌ Get quiz scores exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to load quiz scores',
      scores: [],
    };
  }
}

// ============================================
// GET HIGHEST SCORE FOR A QUIZ
// ============================================

export async function getQuizHighScore(
  userId: string,
  quizId: string
): Promise<number | null> {
  try {
    const result = await getQuizScores(userId);
    if (!result.success || !result.scores) {
      return null;
    }

    const quizScore = result.scores.find(
      (s: QuizScore) => s.quizId === quizId
    );

    return quizScore ? quizScore.score : null;
  } catch (error) {
    console.error('❌ Get quiz high score exception:', error);
    return null;
  }
}
