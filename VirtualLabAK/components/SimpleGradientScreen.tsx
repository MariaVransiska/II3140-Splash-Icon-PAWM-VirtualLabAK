import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children: ReactNode;
};

export function SimpleGradientScreen({ children }: Props) {
  return (
    <LinearGradient
      colors={["#0EA5A6", "#FFFFFF", "#0EA5A6"]} 
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});