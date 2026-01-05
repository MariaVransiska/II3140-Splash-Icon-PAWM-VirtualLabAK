/**
 * Progress Service
 * Handles material and video progress tracking
 */

import { supabase } from '../client';
import { MaterialViewed, VideoWatched } from '../../types/database.types';

// ============================================
// MARK MATERIAL AS VIEWED
// ============================================

export async function markMaterialViewed(
  userId: string,
  materialId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (fetchError || !userData) {
      return {
        success: false,
        message: fetchError?.message || 'User not found',
      };
    }

    const progress = userData.progress as any;
    const materialsViewed = progress.materialsViewed || [];

    // Check if already viewed
    const alreadyViewed = materialsViewed.some(
      (m: MaterialViewed) => m.materialId === materialId
    );

    if (alreadyViewed) {
      return {
        success: true,
        message: 'Material already marked as viewed',
      };
    }

    // Add new material view
    const newMaterial: MaterialViewed = {
      materialId,
      viewedAt: new Date().toISOString(),
    };

    const updatedMaterials = [...materialsViewed, newMaterial];

    const { error: updateError } = await supabase
      .from('users')
      .update({
        progress: {
          ...progress,
          materialsViewed: updatedMaterials,
        },
      })
      .eq('id', userId);

    if (updateError) {
      return {
        success: false,
        message: updateError.message,
      };
    }

    return {
      success: true,
      message: 'Material marked as viewed',
    };
  } catch (error: any) {
    console.error('Mark material viewed exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to mark material as viewed',
    };
  }
}

// ============================================
// MARK VIDEO AS WATCHED
// ============================================

export async function markVideoWatched(
  userId: string,
  videoId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (fetchError || !userData) {
      return {
        success: false,
        message: fetchError?.message || 'User not found',
      };
    }

    const progress = userData.progress as any;
    const videosWatched = progress.videosWatched || [];

    // Check if already watched
    const alreadyWatched = videosWatched.some(
      (v: VideoWatched) => v.videoId === videoId
    );

    if (alreadyWatched) {
      return {
        success: true,
        message: 'Video already marked as watched',
      };
    }

    // Add new video watch
    const newVideo: VideoWatched = {
      videoId,
      watchedAt: new Date().toISOString(),
    };

    const updatedVideos = [...videosWatched, newVideo];

    const { error: updateError } = await supabase
      .from('users')
      .update({
        progress: {
          ...progress,
          videosWatched: updatedVideos,
        },
      })
      .eq('id', userId);

    if (updateError) {
      return {
        success: false,
        message: updateError.message,
      };
    }

    return {
      success: true,
      message: 'Video marked as watched',
    };
  } catch (error: any) {
    console.error('Mark video watched exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to mark video as watched',
    };
  }
}

// ============================================
// GET VIEWED MATERIALS
// ============================================

export async function getViewedMaterials(userId: string): Promise<MaterialViewed[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get viewed materials error:', error);
      return [];
    }

    return (data.progress as any).materialsViewed || [];
  } catch (error) {
    console.error('Get viewed materials exception:', error);
    return [];
  }
}

// ============================================
// GET WATCHED VIDEOS
// ============================================

export async function getWatchedVideos(userId: string): Promise<VideoWatched[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get watched videos error:', error);
      return [];
    }

    return (data.progress as any).videosWatched || [];
  } catch (error) {
    console.error('Get watched videos exception:', error);
    return [];
  }
}

// ============================================
// GET USER PROGRESS SUMMARY
// ============================================

export async function getProgressSummary(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress, statistics')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get progress summary error:', error);
      return null;
    }

    const progress = data.progress as any;
    const statistics = data.statistics as any;

    return {
      totalQuizzes: progress.quizScores?.length || 0,
      totalAssignments: progress.assignments?.length || 0,
      totalJournalEntries: progress.journalEntries?.length || 0,
      totalMaterialsViewed: progress.materialsViewed?.length || 0,
      totalVideosWatched: progress.videosWatched?.length || 0,
      averageQuizScore: statistics.averageQuizScore || 0,
      totalStudyTime: statistics.totalStudyTime || 0,
      streakDays: statistics.streakDays || 0,
    };
  } catch (error) {
    console.error('Get progress summary exception:', error);
    return null;
  }
}
