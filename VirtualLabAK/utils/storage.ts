import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveObject<T>(key: string, value: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("saveObject error", e);
  }
}

export async function loadObject<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn("loadObject error", e);
    return fallback;
  }
}