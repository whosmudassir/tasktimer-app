import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTasksInRoom, getNextTaskForRoom } from "../../api/taskRoomApi";
import EmptyState from "./EmptyState";
import { useNotifications } from "@/hooks/useNotification";
import commonStyles from "@/styles/commonStyles";
import { Task } from "@/types";

interface TaskSectionProps {
  roomId: string;
}

const TaskSection: React.FC<TaskSectionProps> = ({ roomId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { scheduleNotification } = useNotifications();

  // Fetch data from AsyncStorage or API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedTasks = await AsyncStorage.getItem(`tasks_${roomId}`);

        if (cachedTasks) {
          setTasks(JSON.parse(cachedTasks));
        } else {
          await fetchTasks();
        }
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [roomId]);

  // Convert start_in object to total seconds
  function convertToSeconds(starts_in: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }): number {
    const { days, hours, minutes, seconds } = starts_in;
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }

  // Handle scheduling a notification
  const handleScheduleNotification = async (title: string, seconds: number) => {
    const content = {
      title: title,
      body: "Choose an option below:",
      categoryIdentifier: "user-actions",
    };

    await scheduleNotification(content, seconds);
  };

  // Fetch tasks from the API
  const fetchTasks = async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const data = await getTasksInRoom(roomId);
      setTasks(data);

      await AsyncStorage.setItem(`tasks_${roomId}`, JSON.stringify(data));

      setIsFetching(false);
    } catch (error) {
      console.log("Error fetching tasks:", error);
      setIsFetching(false);
    }
  };

  // Fetch the next task and add it to the list
  const fetchNextTask = useCallback(async () => {
    try {
      const newTask = await getNextTaskForRoom(roomId);
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        updatedTasks.sort(
          (a, b) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        );
        return updatedTasks;
      });

      await AsyncStorage.setItem(
        `tasks_${roomId}`,
        JSON.stringify([...tasks, newTask])
      );

      const totalSeconds = convertToSeconds(newTask.starts_in);

      // Schedule notification for the new task
      handleScheduleNotification(newTask.title, totalSeconds);
    } catch (error) {
      console.log("Error fetching the next task:", error);
    }
  }, [roomId, tasks]);

  // Render each task in the FlatList
  const renderItem = useCallback(({ item }: { item: Task }) => {
    const startTime = new Date(item.starts_at).toLocaleTimeString();
    return (
      <View style={styles.taskItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.startTime}>Starts at: {startTime}</Text>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      {tasks.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={tasks}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
          <View style={styles.addTaskButton}>
            <TouchableOpacity
              style={commonStyles.button}
              onPress={fetchNextTask}
            >
              <Text style={commonStyles.buttonText}>Get Next Task</Text>
            </TouchableOpacity>
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
    marginVertical: 10,
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  addTaskButton: {
    paddingTop: 20,
  },
  taskItem: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#eee",
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

export default React.memo(TaskSection);
