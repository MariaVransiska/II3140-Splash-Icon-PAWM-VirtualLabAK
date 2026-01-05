/**
 * Authentication Service
 * Handles login, register, logout, dan session management
 */

import { supabase } from './client';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';
import { UserProfile } from '../types/database.types';
import { hashPassword } from '../../utils/crypto';
import { saveObject, loadObject, removeItem } from '../../utils/storage';

const SESSION_KEY = 'user_session';

/**
 * Save user session to AsyncStorage
 */
async function saveSession(userId: string, email: string): Promise<void> {
  try {
    await saveObject(SESSION_KEY, { userId, email, timestamp: Date.now() });
  } catch (error) {
    console.warn('Failed to save session:', error);
  }
}

/**
 * Load user session from AsyncStorage
 */
export async function loadSession(): Promise<{ userId: string; email: string } | null> {
  try {
    return await loadObject(SESSION_KEY, null);
  } catch (error) {
    console.warn('Failed to load session:', error);
    return null;
  }
}

/**
 * Clear user session
 */
export async function clearSession(): Promise<void> {
  try {
    await removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('Failed to clear session:', error);
  }
}

// ============================================
// REGISTER
// ============================================

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const { email, password, name, nim, kelas, gender } = credentials;

    console.log("📝 Register attempt for:", email);

    // Validasi input
    if (!email || !password) {
      console.log("❌ Validation failed: missing email or password");
      return {
        success: false,
        message: 'Email dan password wajib diisi',
      };
    }

    if (password.length < 6) {
      console.log("❌ Validation failed: password too short");
      return {
        success: false,
        message: 'Password minimal 6 karakter',
      };
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const passwordHash = await hashPassword(password);
    console.log("🔐 Password hashed successfully");

    // Check apakah email sudah terdaftar
    console.log("📡 Checking if email already exists...");
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      console.log("❌ Email already registered");
      return {
        success: false,
        message: 'Email sudah terdaftar',
      };
    }

    console.log("📡 Inserting new user to database...");
    // Insert user baru ke database
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: name || null,
        nim: nim || null,
        kelas: kelas || null,
        gender: gender || null,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Register database error:', error);
      return {
        success: false,
        message: error.message || 'Gagal mendaftar. Silakan coba lagi.',
        error: error.message,
      };
    }

    console.log("✅ User created successfully:", data.email);

    // Save session after successful registration
    await saveSession(data.id, data.email);
    console.log("💾 Session saved");

    return {
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: {
        id: data.id,
        email: data.email,
        name: data.name || undefined,
      },
    };
  } catch (error: any) {
    console.error('💥 Register exception:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem',
      error: error.message,
    };
  }
}

// ============================================
// LOGIN
// ============================================

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const { email, password } = credentials;

    console.log("🔑 Login attempt for:", email);

    // Validasi input
    if (!email || !password) {
      console.log("❌ Validation failed: missing email or password");
      return {
        success: false,
        message: 'Email dan password wajib diisi',
      };
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const passwordHash = await hashPassword(password);
    console.log("🔐 Password hashed successfully");

    // Query user dari database
    console.log("📡 Querying database for user...");
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('password_hash', passwordHash)
      .single();

    if (error || !user) {
      console.log("❌ Login failed - user not found or wrong password:", error?.message);
      return {
        success: false,
        message: 'Email atau password salah',
      };
    }

    console.log("✅ User found:", user.email);

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Save session
    await saveSession(user.id, user.email);
    console.log("💾 Session saved");

    // Simpan user session ke AsyncStorage (melalui storage.ts)
    return {
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
      },
    };
  } catch (error: any) {
    console.error('💥 Login exception:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem',
      error: error.message,
    };
  }
}

// ============================================
// LOGOUT
// ============================================

export async function logout(): Promise<void> {
  await clearSession();
  console.log('✅ Logged out successfully');
}

// ============================================
// GET CURRENT USER PROFILE
// ============================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Get user profile error:', error);
      return null;
    }

    // Return profile tanpa password_hash
    const { password_hash, ...profile } = data;
    return profile as UserProfile;
  } catch (error) {
    console.error('Get user profile exception:', error);
    return null;
  }
}

// ============================================
// UPDATE USER PROFILE
// ============================================

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string;
    nim: string;
    kelas: string;
    gender: string;
  }>
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: 'Gagal update profile',
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Profile berhasil diupdate',
      user: {
        id: data.id,
        email: data.email,
        name: data.name || undefined,
      },
    };
  } catch (error: any) {
    console.error('Update profile exception:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem',
      error: error.message,
    };
  }
}

// ============================================
// CHECK IF EMAIL EXISTS
// ============================================

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
}
