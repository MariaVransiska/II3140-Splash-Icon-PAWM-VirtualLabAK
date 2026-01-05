import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { saveObject, loadObject } from "@/utils/storage";
import { saveJournalText, getJournalText } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function JournalTab() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = async () => {
    try {
      console.log("📔 Loading journal from database...");
      setLoading(true);

      // Get user session
      const session = await loadObject("userSession", null);
      
      if (!session || !session.userId) {
        console.log("❌ No session found, redirecting to login");
        router.replace("/(auth)/login" as any);
        return;
      }

      setUserId(session.userId);

      // Fetch journal text from Supabase
      const result = await getJournalText(session.userId);
      
      if (result.success) {
        setText(result.content || "");
        console.log("✅ Journal loaded from database");
      } else {
        console.log("⚠️ Failed to load journal, using local storage");
        // Fallback to local storage
        const localJournal = await loadObject<string>("journal-latest", "");
        setText(localJournal);
      }
    } catch (error: any) {
      console.error("❌ Error loading journal:", error);
      // Fallback to local storage
      const localJournal = await loadObject<string>("journal-latest", "");
      setText(localJournal);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!userId) {
      if (Platform.OS === 'web') {
        alert("Session tidak valid. Silakan login kembali.");
      } else {
        Alert.alert("Error", "Session tidak valid. Silakan login kembali.");
      }
      return;
    }

    if (!text.trim()) {
      if (Platform.OS === 'web') {
        alert("Journal tidak boleh kosong");
      } else {
        Alert.alert("Error", "Journal tidak boleh kosong");
      }
      return;
    }

    try {
      console.log("💾 Saving journal to database...");
      setSaving(true);

      const result = await saveJournalText(userId, text);

      if (result.success) {
        // Also save to local storage for offline access
        await saveObject("journal-latest", text);
        
        console.log("✅ Journal saved successfully");
        
        if (Platform.OS === 'web') {
          alert("Journal berhasil disimpan!");
        } else {
          Alert.alert("Sukses", "Journal berhasil disimpan!");
        }
      } else {
        console.log("❌ Failed to save journal:", result.message);
        
        if (Platform.OS === 'web') {
          alert("Gagal menyimpan journal: " + result.message);
        } else {
          Alert.alert("Error", "Gagal menyimpan journal: " + result.message);
        }
      }
    } catch (error: any) {
      console.error("❌ Error saving journal:", error);
      
      if (Platform.OS === 'web') {
        alert("Terjadi kesalahan: " + error.message);
      } else {
        Alert.alert("Error", "Terjadi kesalahan: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const onClear = async () => {
    const confirmClear = () => {
      setText("");
      saveObject("journal-latest", "");
      
      if (Platform.OS === 'web') {
        alert("Journal dihapus");
      } else {
        Alert.alert("Info", "Journal dihapus");
      }
    };

    if (Platform.OS === 'web') {
      if (confirm("Yakin ingin menghapus journal?")) {
        confirmClear();
      }
    } else {
      Alert.alert(
        "Konfirmasi",
        "Yakin ingin menghapus journal?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: confirmClear },
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={["#0EA5A6", "#FFFFFF", "#0EA5A6"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={styles.safe}
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.topHeader}>
            <View style={styles.headerLogoCircle}>
              <Image
                source={require("@/assets/images/Icon Final VirtualLabAK.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.headerTitle}>Journal</Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EA5A6" />
                <Text style={styles.loadingText}>Memuat journal...</Text>
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Jurnal Harian</Text>

                <View style={styles.dashedBox}>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    textAlignVertical="top"
                    placeholder="Tuliskan doa, catatan rohani, atau notes kelas"
                    placeholderTextColor="#D4D4D8"
                    value={text}
                    onChangeText={setText}
                    editable={!saving}
                  />
                </View>

                <View style={styles.buttonRow}>
                  <Pressable 
                    style={[styles.btnPrimary, saving && styles.btnDisabled]} 
                    onPress={onSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.btnTextPrimary}>Simpan</Text>
                    )}
                  </Pressable>
                  <Pressable
                    style={[styles.btnPrimary, styles.btnDanger, saving && styles.btnDisabled]}
                    onPress={onClear}
                    disabled={saving}
                  >
                    <Text style={styles.btnTextDanger}>Hapus</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const RADIUS = 10;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  headerLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0EA5A6",
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    marginLeft: 10,
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#111827",
    marginBottom: 14,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#6B7280",
  },

  dashedBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: RADIUS,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    minHeight: 260,
  },
  textArea: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
  },
  btnPrimary: {
    borderRadius: RADIUS,
    paddingHorizontal: 28,
    paddingVertical: 11,
    backgroundColor: "#0EA5A6",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  btnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  btnDanger: {
    backgroundColor: "#DC2626",
  },
  btnTextPrimary: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  btnTextDanger: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});