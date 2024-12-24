import { api } from "./index";

// Function to login and get tokens
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", {
      username,
      password,
    });
    console.log("Resss::", response);
    return response.data; // Contains tokens or user data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Function to refresh the access token using the refresh token
export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await api.post("/api/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data; // Contains new access token and refresh token
  } catch (error) {
    throw new Error(error.response?.data?.message || "Refresh token failed");
  }
};
