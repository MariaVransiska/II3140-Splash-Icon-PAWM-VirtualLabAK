import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { login } from "@/lib/supabase";
import { saveObject } from "@/utils/storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const goToRegister = () => {
    router.push("/(auth)/register" as never);
  };

  const onLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        alert("Email dan password wajib diisi");
      } else {
        Alert.alert("Error", "Email dan password wajib diisi");
      }
      return;
    }

    setLoading(true);
    console.log("🔐 Attempting login with:", email);
    
    try {
      const result = await login({ email, password });
      console.log("📋 Login result:", result);

      if (result.success && result.user) {
        // Simpan user session ke local storage
        await saveObject("userSession", {
          userId: result.user.id,
          email: result.user.email,
          name: result.user.name,
        });

        console.log("✅ Login successful, navigating to home");
        
        if (Platform.OS === 'web') {
          alert("Login berhasil!");
        } else {
          Alert.alert("Sukses", result.message);
        }
        
        router.replace("/(main)/(tabs)/home" as any);
      } else {
        console.log("❌ Login failed:", result.message);
        
        if (Platform.OS === 'web') {
          alert("Login Gagal: " + result.message);
        } else {
          Alert.alert("Login Gagal", result.message);
        }
      }
    } catch (error: any) {
      console.error("💥 Login error:", error);
      
      if (Platform.OS === 'web') {
        alert("Error: " + (error.message || "Terjadi kesalahan"));
      } else {
        Alert.alert("Error", error.message || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
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
      <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <View style={styles.headerTop}>
              <View style={styles.iconCircle}>
                <Image
                  source={require("@/assets/images/Icon Final VirtualLabAK.png")}
                  style={{ width: 70, height: 70}}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>VirtualLabAK</Text>
              <Text style={styles.appSubtitle}>Masuk ke akun Anda</Text>
            </View>

            {/* CARD LOGIN */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Login</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Pressable 
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} 
                onPress={onLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryText}>Masuk</Text>
                )}
              </Pressable>

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Belum punya akun? </Text>
                <Pressable onPress={goToRegister}>
                  <Text style={styles.registerLink}>Daftar di sini</Text>
                </Pressable>
              </View>
            </View>

            {/* CARD BAWAH: footer text */}
            <View style={styles.footerCard}>
              <Text style={styles.footerText}>
                Virtual Lab Agama Kristen 2025
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 100,
    paddingBottom: 10,
  },
  headerTop: {
    alignItems: "center",
    marginBottom: 1,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#0EA5A6",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  appName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#111827",
    textAlign: "center",
  },
  appSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  input: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
  },
  primaryBtn: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: "#0EA5A6",
    paddingVertical: 11,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  primaryText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    fontSize: 15,
  },
  registerRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#4B5563",
  },
  registerLink: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#0EA5A6",
  },
  footerCard: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  footerText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
  },
});