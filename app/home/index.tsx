// /home/RoomTaskScreen.tsx
import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";

import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/authStore";

export default function RoomTaskScreen() {
  // Room and Task Data
  const { logout, isLoggedIn } = useAuthStore();
  console.log("isLoggedIn::::::::::::::", isLoggedIn);
  return (
    <View>
      <Button title="Logout" onPress={logout}></Button>
    </View>
  );
}
