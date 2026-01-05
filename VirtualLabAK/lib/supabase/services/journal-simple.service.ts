/**
 * Journal Service (Simplified)
 * Handles journal text storage using journal_text column
 */

import { supabase } from '../client';

// ============================================
// SAVE JOURNAL TEXT
// ============================================

export async function saveJournalText(
  userId: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📝 Saving journal to database...');
    
    const { error } = await supabase
      .from('users')
      .update({ journal_text: content })
      .eq('id', userId);

    if (error) {
      console.error('❌ Save journal error:', error);
      return {
        success: false,
        message: error.message,
      };
    }

    console.log('✅ Journal saved successfully');
    return {
      success: true,
      message: 'Journal saved successfully',
    };
  } catch (error: any) {
    console.error('❌ Save journal exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to save journal',
    };
  }
}

// ============================================
// GET JOURNAL TEXT
// ============================================

export async function getJournalText(
  userId: string
): Promise<{ success: boolean; message: string; content?: string }> {
  try {
    console.log('📖 Loading journal from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select('journal_text')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Get journal error:', error);
      return {
        success: false,
        message: error.message,
      };
    }

    console.log('✅ Journal loaded successfully');
    return {
      success: true,
      message: 'Journal loaded successfully',
      content: data.journal_text || '',
    };
  } catch (error: any) {
    console.error('❌ Get journal exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to load journal',
      content: '',
    };
  }
}
