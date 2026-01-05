import React from "react";
import { Stack } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Text as RNText } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) {
    return null; // atau splash sederhana
  }

  const Text = (props: React.ComponentProps<typeof RNText>) => (
    <RNText {...props} style={[{ fontFamily: "Poppins_400Regular" }, props.style]} />
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="description" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}