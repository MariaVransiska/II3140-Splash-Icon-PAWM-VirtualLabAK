/**
 * Assignment Service (Simplified)
 * Handles assignment submissions using assignments_submitted JSONB column
 */

import { supabase } from '../client';

export type AssignmentSubmission = {
  assignmentId: string;
  title: string;
  fileName: string;
  submittedAt: string;
};

// ============================================
// SUBMIT ASSIGNMENT
// ============================================

export async function submitAssignment(
  userId: string,
  assignmentId: string,
  title: string,
  fileName: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📤 Submitting assignment to database...');
    
    // Get current submissions
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('assignments_submitted')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return {
        success: false,
        message: fetchError.message,
      };
    }

    const currentSubmissions = (userData?.assignments_submitted as AssignmentSubmission[]) || [];
    
    // Check if already submitted
    const existingIndex = currentSubmissions.findIndex(
      (s: AssignmentSubmission) => s.assignmentId === assignmentId
    );

    const newSubmission: AssignmentSubmission = {
      assignmentId,
      title,
      fileName,
      submittedAt: new Date().toISOString(),
    };

    let updatedSubmissions: AssignmentSubmission[];
    if (existingIndex >= 0) {
      // Update existing submission
      updatedSubmissions = [...currentSubmissions];
      updatedSubmissions[existingIndex] = newSubmission;
    } else {
      // Add new submission
      updatedSubmissions = [...currentSubmissions, newSubmission];
    }

    // Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({ assignments_submitted: updatedSubmissions })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return {
        success: false,
        message: updateError.message,
      };
    }

    console.log('✅ Assignment submitted successfully');
    return {
      success: true,
      message: 'Assignment submitted successfully',
    };
  } catch (error: any) {
    console.error('❌ Submit assignment exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit assignment',
    };
  }
}

// ============================================
// GET SUBMITTED ASSIGNMENTS
// ============================================

export async function getSubmittedAssignments(
  userId: string
): Promise<{ success: boolean; message: string; submissions?: AssignmentSubmission[] }> {
  try {
    console.log('📋 Loading submitted assignments from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select('assignments_submitted')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Get assignments error:', error);
      return {
        success: false,
        message: error.message,
        submissions: [],
      };
    }

    console.log('✅ Assignments loaded successfully');
    return {
      success: true,
      message: 'Assignments loaded successfully',
      submissions: (data.assignments_submitted as AssignmentSubmission[]) || [],
    };
  } catch (error: any) {
    console.error('❌ Get assignments exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to load assignments',
      submissions: [],
    };
  }
}

// ============================================
// CHECK IF ASSIGNMENT IS SUBMITTED
// ============================================

export async function isAssignmentSubmitted(
  userId: string,
  assignmentId: string
): Promise<boolean> {
  try {
    const result = await getSubmittedAssignments(userId);
    if (!result.success || !result.submissions) {
      return false;
    }

    return result.submissions.some(
      (s: AssignmentSubmission) => s.assignmentId === assignmentId
    );
  } catch (error) {
    console.error('❌ Check assignment exception:', error);
    return false;
  }
}
