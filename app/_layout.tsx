import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/store/authStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoggedIn, initializeAuth } = useAuthStore();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Hide splash screen once fonts are loaded
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Initialize auth state when the app starts
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Navigate based on the authentication state
    if (loaded) {
      if (isLoggedIn) {
        router.replace("/(tabs)"); // Redirect to home if logged in
      } else {
        router.replace("/login"); // Redirect to login (index route) if not logged in
      }
    }
  }, [isLoggedIn, loaded]);

  // Debugging the current state of `isLoggedIn`
  console.log("isLoggedIn:", isLoggedIn);

  if (!loaded) {
    // Return null while fonts are loading
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* File-based routing Stack */}
      <Stack>
        {/* Ensure routes are defined */}
        <Stack.Screen
          name="/login"
          options={{ headerShown: false, title: "Login" }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Profile" }}
        />
        <Stack.Screen name="not-found" options={{ title: "Not Found" }} />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
