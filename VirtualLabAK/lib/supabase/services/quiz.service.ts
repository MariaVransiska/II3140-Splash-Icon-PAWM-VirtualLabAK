/**
 * Quiz Service
 * Handles quiz scores and statistics
 */

import { supabase } from '../client';
import { QuizScore } from '../../types/database.types';

// ============================================
// ADD QUIZ SCORE
// ============================================

export async function addQuizScore(
  userId: string,
  score: number,
  maxScore: number,
  quizId?: string
): Promise<{ success: boolean; message: string; data?: QuizScore }> {
  try {
    // Menggunakan database function yang sudah dibuat
    const { data, error } = await supabase.rpc('add_quiz_score', {
      user_id: userId,
      score: score,
      max_score: maxScore,
      quiz_id: quizId || undefined,
    });

    if (error) {
      console.error('Add quiz score error:', error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Quiz score added successfully',
      data: data as QuizScore,
    };
  } catch (error: any) {
    console.error('Add quiz score exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to add quiz score',
    };
  }
}

// ============================================
// GET ALL QUIZ SCORES
// ============================================

export async function getQuizScores(userId: string): Promise<QuizScore[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get quiz scores error:', error);
      return [];
    }

    return (data.progress as any).quizScores || [];
  } catch (error) {
    console.error('Get quiz scores exception:', error);
    return [];
  }
}

// ============================================
// GET QUIZ SCORE BY ID
// ============================================

export async function getQuizScoreById(
  userId: string,
  quizId: string
): Promise<QuizScore | null> {
  try {
    const scores = await getQuizScores(userId);
    return scores.find((s) => s.quizId === quizId) || null;
  } catch (error) {
    console.error('Get quiz score by id exception:', error);
    return null;
  }
}

// ============================================
// GET QUIZ STATISTICS
// ============================================

export async function getQuizStatistics(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('statistics')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get quiz statistics error:', error);
      return {
        totalQuizAttempts: 0,
        averageQuizScore: 0,
      };
    }

    return {
      totalQuizAttempts: (data.statistics as any).totalQuizAttempts || 0,
      averageQuizScore: (data.statistics as any).averageQuizScore || 0,
    };
  } catch (error) {
    console.error('Get quiz statistics exception:', error);
    return {
      totalQuizAttempts: 0,
      averageQuizScore: 0,
    };
  }
}
