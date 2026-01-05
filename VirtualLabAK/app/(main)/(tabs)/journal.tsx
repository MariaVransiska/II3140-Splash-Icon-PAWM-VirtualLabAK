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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { saveObject, loadObject } from "@/utils/storage";

export default function JournalTab() {
  const [text, setText] = useState("");

  useEffect(() => {
    loadObject<string>("journal-latest", "").then(setText);
  }, []);

  const onSave = async () => {
    await saveObject("journal-latest", text);
  };

  const onClear = async () => {
    setText("");
    await saveObject("journal-latest", "");
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
                />
              </View>

              <View style={styles.buttonRow}>
                <Pressable style={styles.btnPrimary} onPress={onSave}>
                  <Text style={styles.btnTextPrimary}>Simpan</Text>
                </Pressable>
                <Pressable
                  style={[styles.btnPrimary, styles.btnDanger]}
                  onPress={onClear}
                >
                  <Text style={styles.btnTextDanger}>Hapus</Text>
                </Pressable>
              </View>
            </View>
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
    alignItems: "center",
    backgroundColor: "#0EA5A6",
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