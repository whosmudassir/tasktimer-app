import React, { useState } from "react";
import {
  TextInput,
  Button,
  Text,
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { TextInput as PaperInput } from "react-native-paper";
import commonStyles from "../../styles/commonStyles";

const LoginScreen = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //   Username: mavehealth
  // Password: 0Eq2LjfABRY95

  const handleLogin = async () => {
    try {
      setError(""); // Clear previous errors
      await login("mavehealth", "0Eq2LjfABRY95"); // Call the login function in Zustand
      console.log("Login successful");
      // Navigate to the home screen or protected route
    } catch (err) {
      setError("Login failed. Please check your username and password.");
    }
  };

  const isButtonDisabled = !username || !password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={commonStyles.logoContainer}>
            <Image
              source={require("../../assets/images/TaskTimer.png")} // Path to your logo file
              style={commonStyles.logo}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.formContainer}>
            <PaperInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              left={<PaperInput.Icon icon="account-outline" />}
              style={styles.input}
              autoCapitalize="none"
            />
            <PaperInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              left={<PaperInput.Icon icon="lock-outline" />}
              style={styles.input}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={{
                ...commonStyles.button,
                opacity: isButtonDisabled ? 0.5 : 1,
              }}
              onPress={handleLogin}
              // disabled={isButtonDisabled}
            >
              <Text style={commonStyles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // White background
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LoginScreen;
