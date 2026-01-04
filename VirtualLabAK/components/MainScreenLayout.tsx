import React, { ReactNode } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
      colors={["#00F2FF", "#00A89B"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerRow}>
          {showBack ? (
            <Pressable
              style={styles.iconBox}
              onPress={() => router.canGoBack() && router.back()}
            >
              <Ionicons name="chevron-back" size={22} color="#00A89B" />
            </Pressable>
          ) : (
            <View style={styles.iconBox} />
          )}

          <Text style={styles.title}>{title}</Text>

          <View style={styles.iconBox}>
            <Ionicons name="heart" size={18} color="#111827" />
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