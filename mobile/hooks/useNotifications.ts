import { useState, useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useApi } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
    }),
});

export function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);
    const { apiWithAuth } = useApi();
    const { isSignedIn } = useAuth();

    const registerForPushNotifications = useCallback(async () => {
        if (!Device.isDevice) {
            console.log("Push notifications require a physical device");
            return null;
        }

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("messages", {
                name: "Messages",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#7C3AED",
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        setPermissionStatus(finalStatus);

        if (finalStatus !== "granted") {
            console.log("Push notification permission denied");
            return null;
        }

        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (!projectId) {
                console.error("EAS projectId not found in app.json");
                return null;
            }

            const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
            const token = tokenData.data;
            setExpoPushToken(token);
            console.log("Expo Push Token:", token);
            return token;
        } catch (error) {
            console.error("Error getting push token:", error);
            return null;
        }
    }, []);

    const sendTokenToBackend = useCallback(async (token: string) => {
        if (!isSignedIn) return;

        try {
            await apiWithAuth({
                method: "POST",
                url: "/users/push-token",
                data: { expoPushToken: token },
            });
            console.log("Push token registered with backend");
        } catch (error) {
            console.error("Failed to register push token:", error);
        }
    }, [apiWithAuth, isSignedIn]);

    const handleNotificationResponse = useCallback((response: Notifications.NotificationResponse) => {
        const data = response.notification.request.content.data;

        if (data?.chatId) {
            router.push(`/chat/${data.chatId}`);
        }
    }, []);

    useEffect(() => {
        if (!isSignedIn) return;

        const initialize = async () => {
            const token = await registerForPushNotifications();
            if (token) {
                await sendTokenToBackend(token);
            }
        };

        initialize();

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification received:", notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [isSignedIn, registerForPushNotifications, sendTokenToBackend, handleNotificationResponse]);

    return {
        expoPushToken,
        permissionStatus,
        registerForPushNotifications,
    };
}
