import React, { useState } from "react";
import {
  TextInput,
  Button,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { TextInput as PaperInput } from "react-native-paper";
import { router } from "expo-router";

const LoginScreen = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login("mavehealth", "0Eq2LjfABRY95"); // Call the login function
      // Redirect to the home screen or other protected routes
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const isButtonDisabled = !username || !password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>TaskTimer</Text>

            <View style={styles.formContainer}>
              <PaperInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                left={
                  <PaperInput.Icon
                    name={() => <Ionicons name="person-outline" size={20} />}
                  />
                }
                style={styles.input}
                autoCapitalize="none"
              />
              <PaperInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                left={
                  <PaperInput.Icon
                    name={() => (
                      <Ionicons name="lock-closed-outline" size={20} />
                    )}
                  />
                }
                style={styles.input}
                autoCapitalize="none"
              />
              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title="Login"
                onPress={handleLogin}
                // disabled={isButtonDisabled}
                color={isButtonDisabled ? "#aaa" : "#007BFF"}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer: {
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5, // Adds a shadow for better visual appearance on Android
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    padding: 10,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default LoginScreen;
