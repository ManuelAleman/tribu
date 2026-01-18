import { Message } from "@/types";
import { View, Text } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

type MessageBubbleProps = {
    message: Message;
    isFromMe: boolean;
    showTail?: boolean;
    isRead?: boolean;
};

function MessageBubble({ message, isFromMe, showTail = true, isRead = false }: MessageBubbleProps) {
    if (!message || !message.createdAt) return null;
    
    const formattedTime = format(new Date(message.createdAt), "HH:mm");
    const isOptimistic = message._id?.startsWith("temp-") ?? false;

    const getCheckmarkIcon = () => {
        if (isOptimistic) return "time-outline";
        if (isRead) return "checkmark-done";
        return "checkmark";
    };

    const getCheckmarkColor = () => {
        if (isOptimistic) return "rgba(255,255,255,0.5)";
        if (isRead) return "#FCD34D";
        return "rgba(255,255,255,0.7)";
    };

    return (
        <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"} mb-1`}>
            <View
                className={`max-w-[80%] px-3.5 py-2.5 ${isFromMe
                    ? `bg-primary dark:bg-primary-dark ${showTail ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                    : `bg-surface-card dark:bg-surface-card-dark ${showTail ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                    }`}
            >
                <Text
                    className={`text-[15px] leading-5 ${isFromMe
                        ? "text-white"
                        : "text-foreground dark:text-foreground-dark"
                        }`}
                >
                    {message.text}
                </Text>

                <View className={`flex-row items-center justify-end mt-1 gap-1 ${isFromMe ? "opacity-80" : ""}`}>
                    <Text
                        className={`text-[12px] ${isFromMe
                            ? "text-white/70"
                            : "text-muted-foreground dark:text-muted-foreground-dark"
                            }`}
                    >
                        {formattedTime}
                    </Text>
                    {isFromMe && (
                        <Ionicons
                            name={getCheckmarkIcon()}
                            size={16}
                            color={getCheckmarkColor()}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

export default MessageBubble;