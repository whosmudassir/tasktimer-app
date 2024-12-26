import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import for safe area
import commonStyles from "@/styles/commonStyles";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets(); // Use to get safe area insets
  const { logout, isLoggedIn } = useAuthStore();
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Room Section */}

          {/* App Title */}
          <View style={commonStyles.logoContainer}>
            <Image
              source={require("../../assets/images/TaskTimer.png")} // Path to your logo file
              style={commonStyles.logo}
            />
          </View>

          {/* Username */}
          <Text style={styles.username}>Hey there</Text>

          {/* GitHub Link */}
          <TouchableOpacity
            onPress={() => openLink("https://github.com/your-project-link")}
          >
            <Text style={styles.link}>
              <MaterialIcons name="link" size={20} color="black" /> GitHub
              Project
            </Text>
          </TouchableOpacity>

          {/* Developer Portfolio Link */}
          <TouchableOpacity
            onPress={() => openLink("https://your-portfolio-link.com")}
          >
            <Text style={styles.link}>
              <MaterialIcons name="link" size={20} color="black" /> Developer
              Portfolio
            </Text>
          </TouchableOpacity>

          {/* Empty View to push button to bottom */}
          <View style={{ flex: 1 }} />

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { marginBottom: insets.bottom + 20 }]} // Add margin to prevent overlap
            onPress={logout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between", // Distribute content with space between
  },
  logoContainer: {
    alignItems: "center", // Center align the logo
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 40,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    paddingTop: 10,
    fontStyle: "italic",
  },
  link: {
    color: "#1e88e5",
    fontSize: 16,
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: "#FF5757",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
