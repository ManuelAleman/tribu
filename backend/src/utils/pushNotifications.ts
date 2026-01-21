import Expo, { type ExpoPushMessage, type ExpoPushTicket } from "expo-server-sdk";

const expo = new Expo();

interface PushNotificationData {
    chatId: string;
    messageId: string;
    [key: string]: unknown;
}

export const sendPushNotification = async (
    expoPushToken: string,
    title: string,
    body: string,
    data: PushNotificationData
): Promise<ExpoPushTicket | null> => {
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Invalid Expo push token: ${expoPushToken}`);
        return null;
    }

    const message: ExpoPushMessage = {
        to: expoPushToken,
        sound: "default",
        title,
        body,
        data,
        priority: "high",
    };

    try {
        const chunks = expo.chunkPushNotifications([message]);
        const tickets: ExpoPushTicket[] = [];

        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        const ticket = tickets[0];

        if (!ticket) {
            console.error("No ticket returned from Expo");
            return null;
        }

        if (ticket.status === "error") {
            const errorTicket = ticket as { status: "error"; message: string; details?: { error: string } };
            console.error(`Push notification error: ${errorTicket.message}`);
            if (errorTicket.details?.error) {
                console.error(`Error details: ${errorTicket.details.error}`);
            }
        } else {
            console.log(`Push notification sent successfully`);
        }

        return ticket;
    } catch (error) {
        console.error("Failed to send push notification:", error);
        return null;
    }
};
