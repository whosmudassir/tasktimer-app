import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    configureNotificationCategories(); // Configure actions
    registerForPushNotificationsAsync().then((token) =>
      token ? setExpoPushToken(token) : null
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        console.log(value)
      );
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const actionIdentifier = response.actionIdentifier;

        if (actionIdentifier === "done" || actionIdentifier === "skip") {
          const notificationId = response.notification.request.identifier;
          try {
            Notifications.dismissNotificationAsync(notificationId);
            console.log("Notification dismissed:", notificationId);
          } catch (error) {
            console.error("Failed to dismiss notification:", error);
          }
        }
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token = null;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Push notification permissions denied!");
      return null;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.error("Error getting push token:", e);
    }

    return token;
  }

  async function scheduleNotification(
    content: Notifications.NotificationContentInput,
    seconds: number
  ) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: "timeInterval", seconds, repeats: false },
    });
    console.log("Notification scheduled with identifier:", identifier);
    return identifier;
  }

  function configureNotificationCategories() {
    Notifications.setNotificationCategoryAsync("user-actions", [
      {
        identifier: "done",
        buttonTitle: "Done",
        options: { opensAppToForeground: false },
      },
      {
        identifier: "skip",
        buttonTitle: "Skip",
        options: { opensAppToForeground: false },
      },
    ]);
  }

  return { scheduleNotification };
}
