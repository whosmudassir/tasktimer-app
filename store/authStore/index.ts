import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { loginUser, refreshToken } from "../../api/authApi";
import { router, Stack } from "expo-router";
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
      const data = await loginUser(username, password);
      console.log("logged in data:::", data);
      await SecureStore.setItemAsync("authToken", data.access_token); // Store access token
      await SecureStore.setItemAsync("refreshToken", data.refresh_token); // Store refresh token

      set({
        isLoggedIn: true,
        token: data.access_token,
        refreshToken: data.refresh_token,
      });
    } catch (error) {
      console.error("Login failed:", error);
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

      console.log("::::storedToken", storedToken, storedRefreshToken);
      if (storedToken && storedRefreshToken) {
        // Optionally try refreshing the token with the refresh token
        try {
          await refreshToken(storedRefreshToken);
          router.replace("(tabs)");
          set({
            isLoggedIn: true,
            token: storedToken,
            refreshToken: storedRefreshToken,
          });
        } catch (error) {
          console.error("Token refresh failed:", error);
          set({ isLoggedIn: false });
        }
      } else {
        set({ isLoggedIn: false });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoggedIn: false });
    }
  },
}));
