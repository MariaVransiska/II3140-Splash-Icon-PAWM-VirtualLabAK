import React, { ReactNode } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  title: string;
  children: ReactNode;
  showBack?: boolean;
};

export function MainScreenLayout({ title, children, showBack }: Props) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0EA5A6", "#FFFFFF", "#0EA5A6"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.headerRow}>
          {showBack ? (
            <Pressable
              style={styles.iconBox}
              onPress={() => router.canGoBack() && router.back()}
            >
              <Ionicons name="chevron-back" size={22} color="#0EA5A6" />
            </Pressable>
          ) : (
            <View style={styles.iconBox} />
          )}

          <Text style={styles.title}>{title}</Text>

          <View style={styles.iconBox}>
            <Image
              source={require("@/assets/images/Icon Final VirtualLabAK.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.contentWrapper}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 18, paddingBottom: 12 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 22,
    height: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  contentWrapper: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    padding: 16,
  },
});