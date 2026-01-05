import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { register } from "@/lib/supabase";

export default function RegisterScreen() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nim, setNim] = useState("");
  const [kelas, setKelas] = useState("");
  const [gender, setGender] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [kelasOpen, setKelasOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const goToLogin = () => {
    router.back();
  };

  const onRegister = async () => {
    console.log("📝 Register attempt with:", { nama, email, nim, kelas, gender });
    
    // Validasi input
    if (!nama || !email || !password || !nim || !kelas || !gender) {
      const message = "Semua field wajib diisi";
      console.log("❌ Validation failed:", message);
      
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert("Error", message);
      }
      return;
    }

    if (nim.length !== 8) {
      const message = "NIM harus 8 digit";
      console.log("❌ Validation failed:", message);
      
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert("Error", message);
      }
      return;
    }

    if (password.length < 6) {
      const message = "Password minimal 6 karakter";
      console.log("❌ Validation failed:", message);
      
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert("Error", message);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        email,
        password,
        name: nama,
        nim,
        kelas,
        gender,
      });

      console.log("📋 Register result:", result);

      if (result.success) {
        console.log("✅ Registration successful!");
        
        if (Platform.OS === 'web') {
          alert("Registrasi berhasil! Silakan login.");
          router.replace("/(auth)/login" as any);
        } else {
          Alert.alert(
            "Sukses",
            result.message,
            [
              {
                text: "OK",
                onPress: () => router.replace("/(auth)/login" as any),
              },
            ]
          );
        }
      } else {
        console.log("❌ Registration failed:", result.message);
        
        if (Platform.OS === 'web') {
          alert("Registrasi Gagal: " + result.message);
        } else {
          Alert.alert("Registrasi Gagal", result.message);
        }
      }
    } catch (error: any) {
      console.error("💥 Register error:", error);
      
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
      <SafeAreaView
        style={styles.safe}
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <View style={styles.headerTop}>
              <View style={styles.iconCircle}>
                <Image
                  source={require("@/assets/images/Icon Final VirtualLabAK.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>VirtualLabAK</Text>
              <Text style={styles.appSubtitle}>Buat akun baru</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Daftar</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor="#D4D4D8"
                  value={nama}
                  onChangeText={setNama}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan email Anda"
                  placeholderTextColor="#D4D4D8"
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
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#D4D4D8"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>NIM</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8 digit NIM"
                  placeholderTextColor="#D4D4D8"
                  keyboardType="number-pad"
                  maxLength={8}
                  value={nim}
                  onChangeText={setNim}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Kelas</Text>
                
                <Pressable
                  style={styles.dropdownInput}
                  onPress={() => setKelasOpen((prev) => !prev)}
                >
                    <Text
                    style={[
                      styles.dropdownText,
                      !kelas && { color: "#D4D4D8" },
                    ]}
                    >
                        {kelas || "Pilih Kelas"}
                    </Text>
                    <Text style={styles.dropdownArrow}>
                    {kelasOpen ? "▲" : "▼"}
                    </Text>
                </Pressable>

                {kelasOpen && (
                  <View style={styles.dropdownMenu}>
                    {["K01", "K02", "K03"].map((opt) => (
                      <Pressable
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setKelas(opt);
                          setKelasOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Gender dropdown */}
              <View style={styles.field}>
                <Text style={styles.label}>Gender</Text>

                <Pressable
                  style={styles.dropdownInput}
                  onPress={() => setGenderOpen((prev) => !prev)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      !gender && { color: "#D4D4D8" },
                    ]}
                  >
                    {gender || "Pilih Gender"}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {genderOpen ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {genderOpen && (
                  <View style={styles.dropdownMenu}>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGender("Perempuan");
                        setGenderOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Perempuan</Text>
                    </Pressable>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGender("Laki-laki");
                        setGenderOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>Laki-laki</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <Pressable 
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} 
                onPress={onRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryText}>Daftar</Text>
                )}
              </Pressable>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Sudah punya akun? </Text>
                <Pressable onPress={goToLogin}>
                  <Text style={styles.loginLink}>Login di sini</Text>
                </Pressable>
              </View>
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
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 24,
  },
  headerTop: {
    alignItems: "center",
    marginBottom: 16,
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
  icon: {
    width: 70,
    height: 70,
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
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#111827",
    textAlign: "center",
    marginBottom: 18,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
  },
  primaryBtn: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: "#0EA5A6",
    paddingVertical: 11,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  primaryText: {
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    fontSize: 15,
  },
  loginRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#4B5563",
  },
  loginLink: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#0EA5A6",
  },

  // Dropdown styles
  dropdownInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
  },
  dropdownArrow: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
  },
});