import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode"; // For decoding JWT tokens
import { loginUser, refreshToken } from "../../api/authApi";
import { router } from "expo-router";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  token: null,
  refreshToken: null,

  login: async (username, password) => {
    try {
      const data = await loginUser(username, password); // API call
      console.log("Logged in data:::", data);

      await SecureStore.setItemAsync("authToken", data.access_token);
      await SecureStore.setItemAsync("refreshToken", data.refresh_token);

      set({
        isLoggedIn: true,
        token: data.access_token,
        refreshToken: data.refresh_token,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate error to the calling function
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("refreshToken");
    set({
      isLoggedIn: false,
      token: null,
      refreshToken: null,
    });
  },

  initializeAuth: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");

      console.log("::::storedToken", storedToken);

      if (storedToken && storedRefreshToken) {
        // Decode and validate the access token
        const decodedAccessToken = jwtDecode(storedToken);
        console.log(":::decodedAccessToken::", decodedAccessToken);
        const isTokenExpired =
          decodedAccessToken.exp * 1000 < new Date().getTime();
        console.log("isTokenExpired::", isTokenExpired, decodedAccessToken.exp);
        if (isTokenExpired) {
          // If the access token is expired, attempt to refresh it
          try {
            const refreshedTokenData = await refreshToken(storedRefreshToken);
            // Save the new tokens securely
            await SecureStore.setItemAsync(
              "authToken",
              refreshedTokenData.access_token
            );
            await SecureStore.setItemAsync(
              "refreshToken",
              refreshedTokenData.refresh_token
            );

            set({
              isLoggedIn: true,
              token: refreshedTokenData.access_token,
              refreshToken: refreshedTokenData.refresh_token,
            });
            // router.replace("(tabs)"); // Navigate to the main screen
          } catch (error) {
            console.error("Token refresh failed:", error);
            set({ isLoggedIn: false });
          }
        } else {
          // If the token is still valid, set the user as logged in
          set({
            isLoggedIn: true,
            token: storedToken,
            refreshToken: storedRefreshToken,
          });
          // router.replace("(tabs)"); // Navigate to the main screen
        }
      } else {
        set({ isLoggedIn: false });
        router.replace("/login"); // Navigate to login screen if no tokens
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoggedIn: false });
      router.replace("/login"); // Navigate to login screen on error
    }
  },
}));
