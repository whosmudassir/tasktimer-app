import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTasksInRoom, getNextTaskForRoom } from "../../api/taskRoomApi"; // Importing the functions from your apiFunctions file
import * as Notifications from "expo-notifications"; // Importing expo-notifications
import EmptyState from "./EmptyState";

// Function to schedule the notification
// Function to schedule the notification

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const scheduleTaskNotification = async (task) => {
  try {
    const { minutes, seconds } = task.starts_in;
    const delayInMilliseconds = (minutes * 60 + seconds) * 1000;

    const content = {
      title: task.title,
      body: `Your task "${task.title}" is starting soon!`,
      data: { taskId: task.id }, // Send task ID as data
      android: {
        priority: "high", // High priority for Android to show immediately
      },
    };

    const actions = [
      {
        actionId: "done",
        buttonTitle: "Done",
        buttonStyle: {
          color: "#32CD32", // Green color for "Done"
        },
      },
      {
        actionId: "skip",
        buttonTitle: "Skip",
        buttonStyle: {
          color: "#FF6347", // Red color for "Skip"
        },
      },
    ];

    // Schedule the notification with the corrected trigger type
    Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: "timeInterval", // Specify the type
        seconds: delayInMilliseconds / 1000, // Convert to seconds
      },
      categoryIdentifier: "task-actions", // Set category for actions
    });

    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "Look at that notification",
    //     body: "I'm so proud of myself!",
    //   },
    //   trigger: null,
    // });

    // Create the notification category with actions
    // await Notifications.setNotificationCategoryAsync("task-actions", actions);

    console.log("Task notification scheduled successfully!");
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

const TimeSlot = ({ roomId }) => {
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedTasks = await AsyncStorage.getItem(`tasks_${roomId}`);

        if (cachedTasks) {
          setTasks(JSON.parse(cachedTasks));
        } else {
          console.log(":::fetching data from api:::");
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
    if (isFetching) return;
    setIsFetching(true);

    try {
      const data = await getTasksInRoom(roomId);
      setTasks(data);

      // Cache the fetched tasks
      await AsyncStorage.setItem(`tasks_${roomId}`, JSON.stringify(data));

      // Schedule notifications for each task
      //   data.forEach((task) => {
      //     scheduleTaskNotification(task); // Schedule notification for each task
      //   });

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

      // Schedule notification for the new task
      // scheduleTaskNotification(newTask);
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
      {tasks.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
          <View style={styles.addTaskButton}>
            <Button title="Get Next Task" onPress={fetchNextTask} />
          </View>
        </>
      ) : (
        <EmptyState
          title="No Tasks Available"
          description="Create or assign a task to this room to get started."
          actionButton={{
            title: "Create Task",
            onPress: fetchNextTask,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    justifyContent: "flex-end",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  addTaskButton: {
    paddingTop: 20,
  },
  taskItem: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    borderRadius: 8,
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
