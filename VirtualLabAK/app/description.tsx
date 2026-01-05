import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SimpleGradientScreen } from "../components/SimpleGradientScreen";

export default function DescriptionScreen() {
  const router = useRouter();

  const goToAuth = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SimpleGradientScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Image
              source={require("@/assets/images/Icon Final VirtualLabAK.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appName}>VirtualLabAK</Text>
          <Text style={styles.appSubtitle}>Virtual Lab Agama Kristen</Text>

          <Text style={styles.paragraph}>
            Membahas dasar-dasar iman, doktrin inti, dan penerapannya dalam
            etika serta kehidupan sehari-hari. Mahasiswa diharapkan memahami
            kebenaran Alkitab dan mengembangkan karakter Kristiani di tengah
            masyarakat modern.
          </Text>

          <Text style={styles.paragraph}>
            Amsal 1:7 – "Permulaan pengetahuan adalah takut akan Tuhan; hanya
            orang bodoh yang menghina hikmat dan didikan."
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Masuk ke Virtual Lab</Text>
          <Text style={styles.sectionSubtitle}>
            Silakan login atau daftar untuk mengakses{" "}
            <Text style={styles.linkText}>Virtual Lab Agama Kristen</Text>
          </Text>

          <Pressable style={styles.button} onPress={goToAuth}>
            <Text style={styles.buttonText}>Masuk</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SimpleGradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  card: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  iconCircle: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#0EA5A6",
    shadowOpacity: 1,
    shadowRadius: 4,
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
    textAlign: "center",
    color: "#111827",
  },
  appSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 16,
  },
  paragraph: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 18,
  },
  linkText: {
    color: "#00A89B",
    fontFamily: "Poppins_600SemiBold",
  },
  button: {
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: "#00A89B",
    paddingHorizontal: 48,
    paddingVertical: 11,
    marginTop: 4,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    fontSize: 15,
  },
});