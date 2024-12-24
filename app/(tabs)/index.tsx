// /home/RoomTaskScreen.tsx
import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";

import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import HorizontalScrollComponent from "@/components/ui/HorizontalScrollComponent";
import TimeSlot from "@/components/ui/TimeSlot";
import {
  createNewTaskRoom,
  getTasksInRoom,
  getNextTaskForRoom,
} from "../../api/taskRoomApi";

export default function RoomTaskScreen() {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]); // Stores all rooms
  const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility
  const [roomName, setRoomName] = useState(""); // Controls input value
  const [currentRoom, setCurrentRoom] = useState({ name: "", id: "" });
  const data = [
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
    { name: "room name 1", id: "a" },
  ];

  const data2 = [
    { name: "Task 1", startTime: 9, endTime: 11 },
    { name: "Task 2", startTime: 9, endTime: 12 },
    { name: "Task 3", startTime: 11, endTime: 13 },
    { name: "Task 4", startTime: 14, endTime: 16 },
  ];
  // Room and Task Data
  const { logout, isLoggedIn } = useAuthStore();
  console.log("isLoggedIn::::::::::::::", isLoggedIn);

  // Example of usage:
  const roomId = "<room_id>";

  const createRoom = async () => {
    try {
      const room = await createNewTaskRoom();
      console.log("New Room Created:", room);
      return room;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleAddRoom = async () => {
    if (!roomName) {
      Alert.alert("Error", "Please enter a room name");
      return;
    }

    try {
      const newRoom = await createRoom();
      // Add the new room to the rooms state

      setRooms((prevRooms) => [
        ...prevRooms,
        { id: newRoom.id, name: roomName },
      ]);
      // Close the modal and reset room name
      setModalVisible(false);
      setRoomName("");
    } catch (error) {
      Alert.alert("Error", "Could not create the room");
    }
  };

  const fetchAllTasks = async () => {
    try {
      const tasks = await getTasksInRoom(roomId);
      console.log("All Tasks in Room:", tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchNextTask = async () => {
    try {
      const nextTask = await getNextTaskForRoom(roomId);
      console.log("Next Task:", nextTask);
    } catch (error) {
      console.error("Error fetching next task:", error);
    }
  };

  const handleSelectRoom = (room) => {
    setCurrentRoom(room);
  };

  return (
    <>
      {/* Create Room Section */}
      <Text style={{ marginTop: 50 }}>Room</Text>
      <Button title="Add Room" onPress={() => setModalVisible(true)} />
      <HorizontalScrollComponent
        data={rooms}
        onPress={handleSelectRoom}
        selectedRoom={currentRoom.id}
      />
      <Text>Current Room: {currentRoom.name}</Text>
      <Text>Current ID: {currentRoom.id}</Text>

      {/* Create Task Section */}
      <Text>-----Tasks List------</Text>
      <TimeSlot roomId={currentRoom.id} />

      {/* Modal to Add Room */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Room Name</Text>
            <TextInput
              style={styles.input}
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Room Name"
            />
            <Button title="Add" onPress={handleAddRoom} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
});
