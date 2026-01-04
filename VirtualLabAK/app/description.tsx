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
    router.replace('/(auth)/login');
  };

  return (
    <SimpleGradientScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("@/assets/images/Icon Final VirtualLabAK.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Virtual Lab Agama Kristen</Text>
        <Text style={styles.body}>
            Membahas dasar-dasar iman, doktrin inti, dan penerapannya dalam etika serta kehidupan sehari-hari. Mahasiswa diharapkan memahami kebenaran Alkitab dan mengembangkan karakter Kristiani di tengah masyarakat modern.
        </Text>
        <Text style={styles.body}>
            Amsal 1:7 - "Permulaan pengetahuan adalah takut akan Tuhan; hanya orang bodoh yang menghina hikmat dan didikan."
        </Text>

        <Pressable style={styles.button} onPress={goToAuth}>
          <Text style={styles.buttonText}>Masuk</Text>
        </Pressable>
      </ScrollView>
    </SimpleGradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    paddingHorizontal: 40,
    paddingVertical: 11,
  },
  buttonText: {
    color: "#00A89B",
    fontSize: 15,
    fontWeight: "600",
  },
});