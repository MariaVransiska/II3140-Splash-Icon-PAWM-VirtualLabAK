/**
 * Profile Service
 * Handles user profile management
 */

import { supabase } from '../client';
import { UserProfile } from '../../types/database.types';

// ============================================
// GET USER PROFILE
// ============================================

export async function getProfile(userId: string): Promise<{
  success: boolean;
  message: string;
  profile?: UserProfile;
}> {
  try {
    console.log('📋 Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, nim, kelas, gender, progress, statistics, created_at, updated_at, last_login')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Get profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch profile',
      };
    }

    if (!data) {
      console.error('❌ No profile data found');
      return {
        success: false,
        message: 'Profile not found',
      };
    }

    console.log('✅ Profile fetched successfully');
    return {
      success: true,
      message: 'Profile fetched successfully',
      profile: data as UserProfile,
    };
  } catch (error: any) {
    console.error('❌ Get profile exception:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching profile',
    };
  }
}

// ============================================
// UPDATE PROFILE
// ============================================

export async function updateProfile(
  userId: string,
  updates: Partial<{
    name: string;
    nim: string;
    kelas: string;
    gender: string;
  }>
): Promise<{ success: boolean; message: string; data?: UserProfile }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, name, nim, kelas, gender, progress, statistics, created_at, updated_at, last_login')
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: data as UserProfile,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update profile',
    };
  }
}

// ============================================
// GET USER STATISTICS
// ============================================

export async function getUserStatistics(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('statistics')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get statistics error:', error);
      return null;
    }

    return data.statistics;
  } catch (error) {
    console.error('Get statistics exception:', error);
    return null;
  }
}

// ============================================
// UPDATE STUDY TIME
// ============================================

export async function updateStudyTime(
  userId: string,
  additionalMinutes: number
): Promise<boolean> {
  try {
    const profile = await getProfile(userId);
    if (!profile) return false;

    const currentTime = profile.statistics.totalStudyTime || 0;
    const newTime = currentTime + additionalMinutes;

    const { error } = await supabase
      .from('users')
      .update({
        statistics: {
          ...profile.statistics,
          totalStudyTime: newTime,
        },
      })
      .eq('id', userId);

    return !error;
  } catch (error) {
    console.error('Update study time exception:', error);
    return false;
  }
}
