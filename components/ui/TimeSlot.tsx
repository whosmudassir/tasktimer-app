import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTasksInRoom, getNextTaskForRoom } from "../../api/taskRoomApi"; // Importing the functions from your apiFunctions file

const TimeSlot = ({ roomId }) => {
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedTasks = await AsyncStorage.getItem(`tasks_${roomId}`);

        if (cachedTasks) {
          // If cached data exists, use it
          setTasks(JSON.parse(cachedTasks));
        } else {
          // Fetch from API if no cached data
          await fetchTasks();
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch the tasks");
      }
    };

    fetchData();
  }, [roomId]);

  // Fetch tasks from API and store in cache using getTasksInRoom
  const fetchTasks = async () => {
    if (isFetching) return; // Prevent duplicate API calls
    setIsFetching(true);

    try {
      const data = await getTasksInRoom(roomId);
      setTasks(data);

      // Cache the fetched tasks
      await AsyncStorage.setItem(`tasks_${roomId}`, JSON.stringify(data));

      setIsFetching(false);
    } catch (error) {
      Alert.alert("Error", "Could not fetch tasks");
      setIsFetching(false);
    }
  };

  // Fetch the next task for the room using getNextTaskForRoom
  const fetchNextTask = async () => {
    try {
      const newTask = await getNextTaskForRoom(roomId);
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        // Re-sort tasks if necessary
        updatedTasks.sort(
          (a, b) => new Date(a.starts_at) - new Date(b.starts_at)
        );
        return updatedTasks;
      });

      // Update cache with the new task
      await AsyncStorage.setItem(
        `tasks_${roomId}`,
        JSON.stringify([...tasks, newTask])
      );
    } catch (error) {
      Alert.alert("Error", "Could not fetch the next task");
    }
  };

  const renderItem = ({ item }) => {
    const startTime = new Date(item.starts_at).toLocaleTimeString();
    return (
      <View style={styles.taskItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.startTime}>Starts at: {startTime}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
      <Button title="Get Next Task" onPress={fetchNextTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  taskItem: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  startTime: {
    fontSize: 14,
    color: "gray",
  },
});

export default TimeSlot;
