import * as SecureStore from "expo-secure-store";
import { api } from "./index";

// Function to create a new task room
export const createNewTaskRoom = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync("authToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await api.get("/api/tasks/new", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Created Task Room:", response.data);
    return response.data; // Contains the room ID
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create task room"
    );
  }
};

// Function to get all tasks in a room
export const getTasksInRoom = async (roomId: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync("authToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await api.get(`/api/tasks/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Tasks in Room:", response.data);
    return response.data; // Returns an array of tasks
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

// Function to get the next task for a room
export const getNextTaskForRoom = async (roomId: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync("authToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await api.get(`/api/tasks/new/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Next Task for Room:", response.data);
    return response.data; // Returns the next task object
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch next task"
    );
  }
};
