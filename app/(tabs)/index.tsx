import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthStore } from "@/store/authStore";
import HorizontalScrollComponent from "@/components/ui/HorizontalScrollComponent";
import TaskSection from "../../components/ui/TaskSection";
import { createNewTaskRoom } from "../../api/taskRoomApi";
import EmptyState from "@/components/ui/EmptyState";
import commonStyles from "@/styles/commonStyles";

import { Room } from "@/types";

export default function RoomTaskScreen(): JSX.Element {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<Room>({
    name: "",
    id: "",
  });

  const createRoom = async (): Promise<Room | undefined> => {
    try {
      const room = await createNewTaskRoom();
      return room;
    } catch (error) {
      console.error("Error creating room:", error);
      return undefined;
    }
  };

  // Handle the room creation
  const handleAddRoom = async (): Promise<void> => {
    if (!roomName) {
      Alert.alert("Error", "Please enter a room name");
      return;
    }
    try {
      const newRoom = await createRoom();
      if (newRoom) {
        setRooms((prevRooms) => [
          ...prevRooms,
          { id: newRoom?.id, name: roomName },
        ]);
        setModalVisible(false);
        setCurrentRoom({ id: newRoom?.id, name: roomName });
        setRoomName("");
      }
    } catch (error) {
      Alert.alert("Error", "Could not create the room");
    }
  };

  // Select room handler
  const handleSelectRoom = (room: Room): void => {
    setCurrentRoom(room);
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
              source={require("../../assets/images/TaskTimer.png")}
              style={commonStyles.logo}
            />
          </View>

          {rooms.length > 0 ? (
            <>
              {/* Rooms Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderTitle}>Rooms</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="add" size={24} color="#ff5757" />
                </TouchableOpacity>
              </View>
              <HorizontalScrollComponent
                data={rooms}
                onPress={handleSelectRoom}
                selectedRoom={currentRoom.id}
              />

              <View style={styles.taskSection}>
                {/* Current Room Info */}
                <View style={styles.taskHeaderSection}>
                  <Text style={styles.currentRoomText}>
                    <FontAwesome name="group" size={20} color="black" />
                    {"  "}
                    {currentRoom.name || "None"}
                  </Text>
                  <Text style={styles.currentIdText}>
                    # {currentRoom.id || "None"}
                  </Text>
                </View>

                {/* Tasks Section */}
                <TaskSection roomId={currentRoom.id} />
              </View>
            </>
          ) : (
            <EmptyState
              title="No Rooms Available"
              description=" Create a room to start managing tasks. Once you create a room, you can
            view and create tasks within it."
              actionButton={{
                title: "Create Room",
                onPress: () => setModalVisible(true),
              }}
            />
          )}

          {/* Modal for Adding Room */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Enter Room Name</Text>
                    <TextInput
                      style={[
                        styles.input,
                        roomName.length < 0 && styles.inputError,
                      ]}
                      value={roomName}
                      onChangeText={setRoomName}
                      placeholder="Room Name"
                    />
                    {roomName.length < 0 && (
                      <Text style={styles.errorText}>Name is required</Text>
                    )}
                    <View style={styles.modalButtonGroup}>
                      <TouchableOpacity
                        style={[
                          commonStyles.button,
                          { flex: 1, marginRight: 10 },
                        ]}
                        onPress={handleAddRoom}
                      >
                        <Text style={commonStyles.buttonText}>Add</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[commonStyles.button, { flex: 1 }]}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={commonStyles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 5,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  taskHeaderSection: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 2,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    maxHeight: "100%",
    justifyContent: "flex-start",
  },
  addRoomButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e88e5",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "flex-start",
  },
  addRoomButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  currentRoomText: {
    fontSize: 18,
    color: "black",
    marginTop: 4,
  },
  currentIdText: {
    fontSize: 13,
    color: "gray",
    marginVertical: 4,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
  },
});
