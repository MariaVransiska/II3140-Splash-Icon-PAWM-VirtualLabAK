/**
 * Journal Service
 * Handles journal entries
 */

import { supabase } from '../client';
import { JournalEntry } from '../../types/database.types';

// ============================================
// ADD JOURNAL ENTRY
// ============================================

export async function addJournalEntry(
  userId: string,
  title: string,
  content: string
): Promise<{ success: boolean; message: string; data?: JournalEntry }> {
  try {
    // Menggunakan database function yang sudah dibuat
    const { data, error } = await supabase.rpc('add_journal_entry', {
      user_id: userId,
      title: title,
      content: content,
    });

    if (error) {
      console.error('Add journal entry error:', error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Journal entry added successfully',
      data: data as JournalEntry,
    };
  } catch (error: any) {
    console.error('Add journal entry exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to add journal entry',
    };
  }
}

// ============================================
// GET ALL JOURNAL ENTRIES
// ============================================

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('progress')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get journal entries error:', error);
      return [];
    }

    return (data.progress as any).journalEntries || [];
  } catch (error) {
    console.error('Get journal entries exception:', error);
    return [];
  }
}

// ============================================
// GET JOURNAL ENTRY BY ID
// ============================================

export async function getJournalEntryById(
  userId: string,
  entryId: string
): Promise<JournalEntry | null> {
  try {
    const entries = await getJournalEntries(userId);
    return entries.find((e) => e.entryId === entryId) || null;
  } catch (error) {
    console.error('Get journal entry by id exception:', error);
    return null;
  }
}

// ============================================
// UPDATE JOURNAL ENTRY
// ============================================

export async function updateJournalEntry(
  userId: string,
  entryId: string,
  updates: { title?: string; content?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    // Get current entries
    const entries = await getJournalEntries(userId);
    
    // Update the specific entry
    const updatedEntries = entries.map((entry) => {
      if (entry.entryId === entryId) {
        return {
          ...entry,
          ...updates,
        };
      }
      return entry;
    });

    // Update progress
    const { error } = await supabase
      .from('users')
      .update({
        progress: {
          journalEntries: updatedEntries,
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
      message: 'Journal entry updated successfully',
    };
  } catch (error: any) {
    console.error('Update journal entry exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to update journal entry',
    };
  }
}

// ============================================
// DELETE JOURNAL ENTRY
// ============================================

export async function deleteJournalEntry(
  userId: string,
  entryId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Get current entries
    const entries = await getJournalEntries(userId);
    
    // Filter out the deleted entry
    const updatedEntries = entries.filter((e) => e.entryId !== entryId);

    // Update progress
    const { error } = await supabase
      .from('users')
      .update({
        progress: {
          journalEntries: updatedEntries,
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
      message: 'Journal entry deleted successfully',
    };
  } catch (error: any) {
    console.error('Delete journal entry exception:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete journal entry',
    };
  }
}
