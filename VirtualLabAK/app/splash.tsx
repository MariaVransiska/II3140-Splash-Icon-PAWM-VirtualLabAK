import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { SimpleGradientScreen } from "../components/SimpleGradientScreen";

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/description");
    }, 2500);

    return () => clearTimeout(timer);
  }, [opacity, translateY, router]);

  return (
    <SimpleGradientScreen>
      <Animated.View
        style={[
          styles.content,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <Image
          source={require("../assets/images/Icon Salib Tunggal.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>VirtualLabAK</Text>
      </Animated.View>
    </SimpleGradientScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
});