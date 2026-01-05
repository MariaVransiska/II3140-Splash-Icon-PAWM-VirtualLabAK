/**
 * Assignment Service
 * Handles assignment submissions
 */

import { supabase } from '../client';
import { Assignment } from '../../types/database.types';

// ============================================
// SUBMIT ASSIGNMENT
// ============================================

export async function submitAssignment(
  userId: string,
  title: string,
  fileName: string,
  fileData: string
): Promise<{ success: boolean; message: string; data?: Assignment }> {
  try {
    // Menggunakan database function yang sudah dibuat
    const { data, error } = await supabase.rpc('add_assignment', {
      user_id: userId,
      title: title,
      file_name: fileName,
      file_data: fileData,
    });

    if (error) {
      console.error('Submit assignment error:', error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Assignment submitted successfully',
      data: data as Assignment,
    };
  } catch (error: any) {
    console.error('Submit assignment exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit assignment',
    };
  }
}

// ============================================
// GET ALL ASSIGNMENTS
// ============================================

export async function getAssignments(userId: string): Promise<Assignment[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get assignments error:', error);
      return [];
    }

    return (data.progress as any).assignments || [];
  } catch (error) {
    console.error('Get assignments exception:', error);
    return [];
  }
}

// ============================================
// GET ASSIGNMENT BY ID
// ============================================

export async function getAssignmentById(
  userId: string,
  assignmentId: string
): Promise<Assignment | null> {
  try {
    const assignments = await getAssignments(userId);
    return assignments.find((a) => a.assignmentId === assignmentId) || null;
  } catch (error) {
    console.error('Get assignment by id exception:', error);
    return null;
  }
}

// ============================================
// DELETE ASSIGNMENT
// ============================================

export async function deleteAssignment(
  userId: string,
  assignmentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Get current assignments
    const assignments = await getAssignments(userId);
    
    // Filter out the deleted assignment
    const updatedAssignments = assignments.filter(
      (a) => a.assignmentId !== assignmentId
    );

    // Update progress
    const { data, error } = await supabase
      .from('users')
      .update({
        progress: {
          assignments: updatedAssignments,
        } as any,
      })
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Assignment deleted successfully',
    };
  } catch (error: any) {
    console.error('Delete assignment exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete assignment',
    };
  }
}
