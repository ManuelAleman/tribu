import { View, Text, Pressable } from "react-native";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    description = "Failed to load chats",
    onRetry,
}: ErrorStateProps) {
    return (
        <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark px-6">
            <Text className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2 text-center">
                {title}
            </Text>

            <Text className="text-muted-foreground dark:text-muted-foreground-dark text-center mb-6">
                {description}
            </Text>

            {onRetry && (
                <Pressable
                    onPress={onRetry}
                    className="bg-primary px-6 py-3 rounded-xl active:opacity-90"
                >
                    <Text className="text-surface-card dark:text-surface-card-dark font-medium">
                        Retry
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
