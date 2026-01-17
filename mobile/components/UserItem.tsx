import type { User } from "@/types";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

type UserItemProps = {
    user: User;
    isOnline: boolean;
    onPress: () => void;
};

function UserItem({ user, isOnline, onPress }: UserItemProps) {
    return (
        <Pressable
            className="flex-row items-center py-3 active:opacity-70"
            onPress={onPress}
        >
            <View className="relative">
                <Image
                    source={{ uri: user.avatar }}
                    style={{ width: 48, height: 48, borderRadius: 999 }}
                />
                {isOnline && (
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface dark:border-surface-dark" />
                )}
            </View>

            <View className="flex-1 ml-3 border-b border-surface-muted dark:border-surface-muted-dark pb-3">
                <View className="flex-row items-center justify-between">
                    <Text
                        className="text-foreground dark:text-foreground-dark font-medium text-base"
                        numberOfLines={1}
                    >
                        {user.name}
                    </Text>
                    {isOnline && (
                        <View className="flex-row items-center gap-1">
                            <View className="w-2 h-2 rounded-full bg-green-500" />
                            <Text className="text-xs text-green-600 dark:text-green-400 font-medium">
                                Online
                            </Text>
                        </View>
                    )}
                </View>
                <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark mt-0.5">
                    {user.email}
                </Text>
            </View>
        </Pressable>
    );
}

export default UserItem;