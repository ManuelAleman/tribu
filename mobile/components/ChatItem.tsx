import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Chat } from '@/types'
import { Image } from 'expo-image';
import { formatDistanceToNow } from 'date-fns';
import { useSocketStore } from '@/lib/socket';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/lib/colors';

const ChatItem = ({ chat, onPress }: { chat: Chat, onPress: () => void }) => {
    const participant = chat.participant;
    const theme = useThemeColors();

    const { onlineUsers, typingUsers } = useSocketStore();

    const isOnline = onlineUsers.has(participant._id);
    const isTyping = typingUsers.get(chat._id) === participant._id;
    const hasUnread = chat.hasUnread;
    const isLastMessageFromMe = chat.isLastMessageFromMe;
    const isLastMessageRead = chat.isLastMessageRead;

    return (
        <Pressable
            className='flex-row items-center py-3 active:opacity-70'
            onPress={onPress}
        >
            <View className='relative'>
                <Image
                    source={participant.avatar}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                    }}
                />
                {isOnline && (
                    <View className='absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-[3px] border-surface dark:border-surface-dark' />
                )}
            </View>

            <View className='flex-1 ml-4 border-b border-surface-muted dark:border-surface-muted-dark pb-3'>
                <View className='flex-row items-center justify-between'>
                    <Text
                        className={`text-base font-medium ${hasUnread ? "text-primary" : "text-foreground dark:text-foreground-dark"}`}
                    >
                        {participant.name}
                    </Text>

                    <View className="flex-row items-center gap-2">
                        {hasUnread && <View className="w-2.5 h-2.5 bg-primary rounded-full" />}
                        <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                            {chat.lastMessageAt
                                ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false })
                                : ""}
                        </Text>
                    </View>
                </View>

                <View className='flex-row items-center justify-between mt-1'>
                    {isTyping ? (
                        <Text className='text-sm text-muted-foreground dark:text-muted-foreground-dark italic'>
                            Typing...
                        </Text>
                    ) : (
                        <View className='flex-row items-center flex-1 mr-3'>
                            {isLastMessageFromMe && chat.lastMessage && (
                                <Ionicons
                                    name={isLastMessageRead ? "checkmark-done" : "checkmark"}
                                    size={14}
                                    color={isLastMessageRead ? "#FCD34D" : theme.mutedForeground}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            <Text
                                className={`text-sm flex-1 ${hasUnread ? "text-foreground dark:text-foreground-dark font-medium" : "text-muted-foreground dark:text-muted-foreground-dark"}`}
                                numberOfLines={1}
                            >
                                {chat.lastMessage?.text || "No messages yet"}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

        </Pressable>
    )
}

export default ChatItem