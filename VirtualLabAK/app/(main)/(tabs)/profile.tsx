import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { loadObject, saveObject } from "@/utils/storage";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileData = {
  nama: string;
  nim: string;
  kelas: string;
  gender: string;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [kelas, setKelas] = useState("");
  const [gender, setGender] = useState("");

  const [kelasOpen, setKelasOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadObject<ProfileData>("profile", {
        nama: "",
        nim: "",
        kelas: "",
        gender: "",
      });
      setNama(stored.nama ?? "");
      setNim(stored.nim ?? "");
      setKelas(stored.kelas ?? "");
      setGender(stored.gender ?? "");
    })();
  }, []);

  const onSaveProfile = async () => {
    const data: ProfileData = { nama, nim, kelas, gender };
    await saveObject("profile", data);
    Alert.alert("Profil disimpan", "Data profil Anda berhasil diperbarui.");
  };

  const onLogout = () => {
    Alert.alert("Logout", "Anda akan keluar dari akun ini.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("logged-in");
          } catch (e) {
          }
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const profileIcon =
    gender === "Perempuan"
      ? require("@/assets/images/icon profile cewe.png")
      : require("@/assets/images/icon profile cowo.png");

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
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <View style={styles.wrapper}>
            <View style={styles.cardDashed}>
              <View style={styles.photoWrapper}>
                <Image
                  source={profileIcon}
                  style={styles.photo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nama</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor="#D4D4D8"
                  value={nama}
                  onChangeText={setNama}
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

              <Pressable style={styles.saveBtn} onPress={onSaveProfile}>
                <Text style={styles.saveText}>Simpan Profil</Text>
              </Pressable>
            </View>

            <Pressable style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
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

  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },

  cardDashed: {
    borderRadius: RADIUS,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
  },

  photoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  photo: {
    width: 96,
    height: 96,
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
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
  },

  saveBtn: {
    marginTop: 16,
    borderRadius: RADIUS,
    backgroundColor: "#0EA5A6",
    paddingVertical: 11,
    alignItems: "center",
  },
  saveText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  logoutBtn: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 125,
    borderRadius: RADIUS,
    backgroundColor: "#EF4444",
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  logoutText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  dropdownInput: {
    borderRadius: RADIUS,
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
    borderRadius: RADIUS,
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