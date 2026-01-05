/**
 * Assignment Service (Simplified)
 * ONLY VALIDATES assignments from progress.assignments (data already exists in DB)
 * NO SUBMIT - just check if assignment is in progress.assignments array
 */

import { supabase } from '../client';

export type AssignmentSubmission = {
  assignmentId: string;
  title: string; // This holds the actual assignment ID like "1", "2", "3"
  fileName: string; // This holds the assignment title
  fileData: string; // This holds the uploaded file name
  submittedAt: string;
};

// ============================================
// SUBMIT ASSIGNMENT (keeps adding to progress.assignments)
// ============================================

export async function submitAssignment(
  userId: string,
  assignmentId: string,
  title: string,
  fileName: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📤 Submitting assignment to database...');
    
    // Get current progress
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return {
        success: false,
        message: fetchError.message,
      };
    }

    const progress = userData?.progress || {
      assignments: [],
      quizScores: [],
      videosWatched: [],
      journalEntries: [],
      materialsViewed: [],
    };

    const currentAssignments = (progress.assignments as AssignmentSubmission[]) || [];
    
    // Check if already submitted (check by title which holds assignmentId)
    const existingIndex = currentAssignments.findIndex(
      (s: AssignmentSubmission) => s.title === assignmentId
    );

    const newSubmission: AssignmentSubmission = {
      assignmentId: crypto.randomUUID(), // Unique submission ID
      title: assignmentId, // "1", "2", "3" - the actual assignment ID
      fileName: title, // "Tugas 1 - Jurnal Mingguan" - assignment title
      fileData: fileName, // "document.pdf" - uploaded file name
      submittedAt: new Date().toISOString(),
    };

    let updatedAssignments: AssignmentSubmission[];
    if (existingIndex >= 0) {
      // Update existing submission
      updatedAssignments = [...currentAssignments];
      updatedAssignments[existingIndex] = newSubmission;
      console.log(`✅ Updated existing assignment ${assignmentId}`);
    } else {
      // Add new submission
      updatedAssignments = [...currentAssignments, newSubmission];
      console.log(`✅ Added new assignment ${assignmentId}`);
    }

    // Update progress.assignments
    progress.assignments = updatedAssignments;

    // Update database
    const { error: updateError } = await supabase
      .from('users')
      .update({ progress })
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
// GET SUBMITTED ASSIGNMENTS (from progress.assignments)
// ============================================

export async function getSubmittedAssignments(
  userId: string
): Promise<{ success: boolean; message: string; submissions?: AssignmentSubmission[] }> {
  try {
    console.log('📋 Loading submitted assignments from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select('progress')
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

    const progress = data.progress || { assignments: [] };
    const assignments = (progress.assignments as AssignmentSubmission[]) || [];

    console.log('✅ Assignments loaded successfully:', assignments.length);
    return {
      success: true,
      message: 'Assignments loaded successfully',
      submissions: assignments,
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
    if (!result.success || !result.submissions) return false;
    
    // Check by title field (which stores the assignmentId like "1", "2", "3")
    return result.submissions.some((s: AssignmentSubmission) => s.title === assignmentId);
  } catch (error) {
    console.error('❌ Check assignment error:', error);
    return false;
  }
}