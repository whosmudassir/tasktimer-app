import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";

const API_URL = "https://mavehiringserver.azurewebsites.net"; // Replace with your API base URL

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response, // Return the response if successful
  async (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 error, log out the user
      const { logout } = useAuthStore.getState();
      await logout();
      // router.replace("/login"); // Redirect to the login screen
    }
    return Promise.reject(error); // Reject the error so the caller can handle it
  }
);

export { api };
