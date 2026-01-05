/**
 * Storage Utility with In-Memory Fallback
 * Pure in-memory storage - no native dependencies
 * Works on all platforms without native module errors
 */

// In-memory storage as primary solution
let inMemoryStorage: Record<string, string> = {};

console.log('📦 Using in-memory storage (data persists during app session only)');

export async function saveObject<T>(key: string, value: T): Promise<void> {
  try {
    const stringified = JSON.stringify(value);
    inMemoryStorage[key] = stringified;
    console.log(`💾 Saved to storage: ${key}`);
  } catch (e) {
    console.warn("saveObject error:", e);
  }
}

export async function loadObject<T>(key: string, fallback?: T): Promise<T | null> {
  try {
    const raw = inMemoryStorage[key] || null;
    
    if (!raw) return fallback !== undefined ? fallback : null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn("loadObject error:", e);
    return fallback !== undefined ? fallback : null;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    delete inMemoryStorage[key];
    console.log(`🗑️ Removed from storage: ${key}`);
  } catch (e) {
    console.warn("removeItem error:", e);
  }
}