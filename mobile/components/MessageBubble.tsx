import { Message } from "@/types";
import { View, Text } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

type MessageBubbleProps = {
    message: Message;
    isFromMe: boolean;
    showTail?: boolean;
};

function MessageBubble({ message, isFromMe, showTail = true }: MessageBubbleProps) {
    const formattedTime = format(new Date(message.createdAt), "HH:mm");
    const isOptimistic = message._id.startsWith("temp-");

    return (
        <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"} mb-1`}>
            <View
                className={`max-w-[80%] px-3.5 py-2.5 ${isFromMe
                    ? `bg-primary ${showTail ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
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
                        className={`text-[10px] ${isFromMe
                            ? "text-white/70"
                            : "text-muted-foreground dark:text-muted-foreground-dark"
                            }`}
                    >
                        {formattedTime}
                    </Text>
                    {isFromMe && (
                        <Ionicons
                            name={isOptimistic ? "time-outline" : "checkmark-done"}
                            size={12}
                            color={isOptimistic ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)"}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

export default MessageBubble;