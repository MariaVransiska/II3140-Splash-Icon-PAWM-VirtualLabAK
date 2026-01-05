/**
 * Database Types untuk Virtual Lab AK
 * Sesuai dengan schema Supabase
 */

// ============================================
// PROGRESS TYPES
// ============================================

export interface QuizScore {
  quizId: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
}

export interface Assignment {
  assignmentId: string;
  title: string;
  fileName: string;
  fileData: string;
  submittedAt: string;
}

export interface JournalEntry {
  entryId: string;
  title: string;
  content: string;
  date: string;
}

export interface MaterialViewed {
  materialId: string;
  viewedAt: string;
}

export interface VideoWatched {
  videoId: string;
  watchedAt: string;
}

export interface UserProgress {
  quizScores: QuizScore[];
  assignments: Assignment[];
  journalEntries: JournalEntry[];
  materialsViewed: MaterialViewed[];
  videosWatched: VideoWatched[];
}

// ============================================
// STATISTICS TYPES
// ============================================

export interface UserStatistics {
  totalQuizAttempts: number;
  averageQuizScore: number;
  totalStudyTime: number;
  streakDays: number;
  lastLoginDate: string | null;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  
  // Profile data
  name: string | null;
  nim: string | null;
  kelas: string | null;
  gender: string | null;
  
  // Progress tracking
  progress: UserProgress;
  
  // Statistics
  statistics: UserStatistics;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// Public user profile (without sensitive data)
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  nim: string | null;
  kelas: string | null;
  gender: string | null;
  progress: UserProgress;
  statistics: UserStatistics;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// ============================================
// DATABASE SCHEMA
// ============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at' | 'progress' | 'statistics'> & {
          progress?: UserProgress;
          statistics?: UserStatistics;
        };
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      add_quiz_score: {
        Args: {
          user_id: string;
          score: number;
          max_score: number;
          quiz_id?: string;
        };
        Returns: QuizScore;
      };
      add_assignment: {
        Args: {
          user_id: string;
          title: string;
          file_name: string;
          file_data: string;
        };
        Returns: Assignment;
      };
      add_journal_entry: {
        Args: {
          user_id: string;
          title: string;
          content: string;
        };
        Returns: JournalEntry;
      };
    };
  };
}
