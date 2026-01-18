import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCurrentUser } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { router, useLocalSearchParams } from 'expo-router';
import { useSocketStore } from '@/lib/socket';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useThemeColors } from '@/lib/colors';
import { MessageSender } from '@/types';
import MessageBubble from '@/components/MessageBubble';
import { MessagesSkeleton } from '@/components/MessagesSkeleton';

type ChatParams = {
    id: string;
    participantId: string;
    name: string;
    avatar: string;
}

const ChatDetailScreen = () => {
    const theme = useThemeColors();
    const { id: chatId, participantId, name, avatar } = useLocalSearchParams<ChatParams>();

    const [messageText, setMessageText] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const inputRef = useRef<TextInput>(null);

    const { data: currentUser } = useCurrentUser();
    const { data: messages, isLoading } = useMessages(chatId);

    const { joinChat, leaveChat, sendMessage, sendTyping, isConnected, onlineUsers, typingUsers } = useSocketStore();

    const isOnline = participantId ? onlineUsers.has(participantId) : false;
    const isTyping = typingUsers.get(chatId) === participantId;

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (chatId && isConnected) joinChat(chatId);
        return () => {
            if (chatId) leaveChat(chatId);
        }
    }, [chatId, isConnected, joinChat, leaveChat])

    useEffect(() => {
        if (messages && messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleTyping = useCallback((text: string) => {
        setMessageText(text);

        if (!isConnected || !chatId || !participantId) return;

        if (text.length > 0) {
            sendTyping(chatId, true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                sendTyping(chatId, false);
            }, 2000);
        }
        else {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            sendTyping(chatId, false);
        }
    }, [chatId, isConnected, sendTyping])

    const handleSend = () => {
        if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        sendTyping(chatId, false);

        setIsSending(true);
        sendMessage(chatId, messageText.trim(), {
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar,
        });
        setMessageText("");
        setIsSending(false);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }

    return (
        <SafeAreaView className='flex-1 bg-surface dark:bg-surface-dark' edges={["top", "bottom"]}>
            <View className="flex-row items-center px-4 py-3 bg-surface dark:bg-surface-dark border-b border-surface-muted dark:border-surface-muted-dark">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full items-center justify-center bg-surface-card dark:bg-surface-card-dark active:opacity-70 mr-3"
                >
                    <Ionicons name="chevron-back" size={22} color={theme.foreground} />
                </Pressable>
                <Pressable className="flex-row items-center flex-1 active:opacity-80">
                    <View className="relative">
                        {avatar ? (
                            <Image
                                source={avatar}
                                style={{ width: 44, height: 44, borderRadius: 999 }}
                            />
                        ) : (
                            <View className="w-11 h-11 rounded-full bg-surface-card dark:bg-surface-card-dark items-center justify-center">
                                <Ionicons name="person" size={22} color={theme.mutedForeground} />
                            </View>
                        )}
                        {isOnline && (
                            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface dark:border-surface-dark" />
                        )}
                    </View>

                    <View className="ml-3 flex-1">
                        <Text
                            className="text-foreground dark:text-foreground-dark font-semibold text-base"
                            numberOfLines={1}
                        >
                            {name}
                        </Text>
                        <View className="flex-row items-center mt-0.5">
                            {isTyping ? (
                                <View className="flex-row items-center">
                                    <Text className="text-xs text-primary font-medium italic">typing</Text>
                                    <Text className="text-xs text-primary font-medium">...</Text>
                                </View>
                            ) : (
                                <View className="flex-row items-center gap-1">
                                    <View className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-muted-foreground dark:bg-muted-foreground-dark"}`} />
                                    <Text className={`text-xs ${isOnline ? "text-green-600 dark:text-green-400" : "text-muted-foreground dark:text-muted-foreground-dark"}`}>
                                        {isOnline ? "Online" : "Offline"}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Pressable>

                <View className="flex-row items-center gap-1">
                    <Pressable className="w-10 h-10 rounded-full items-center justify-center bg-surface-card dark:bg-surface-card-dark active:opacity-70">
                        <Ionicons name="call" size={18} color={theme.primary} />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full items-center justify-center bg-surface-card dark:bg-surface-card-dark active:opacity-70">
                        <Ionicons name="videocam" size={18} color={theme.primary} />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full items-center justify-center active:opacity-70">
                        <Ionicons name="ellipsis-vertical" size={18} color={theme.mutedForeground} />
                    </Pressable>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
                className="flex-1"
            >
                <View className='flex-1 bg-background dark:bg-background-dark'>
                    {isLoading ? (
                        <MessagesSkeleton />
                    ) : !messages || messages.length === 0 ? (
                        <View className='flex-1 items-center justify-center px-8'>
                            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                                <Ionicons name="chatbubbles-outline" size={40} color={theme.primary} />
                            </View>
                            <Text className='text-foreground dark:text-foreground-dark text-lg font-semibold'>
                                Start the conversation
                            </Text>
                            <Text className='text-muted-foreground dark:text-muted-foreground-dark text-sm text-center mt-2'>
                                Send a message to {name} to begin chatting
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            ref={scrollViewRef}
                            className="flex-1"
                            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}
                            showsVerticalScrollIndicator={false}
                            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
                        >
                            {messages.map((message, index) => {
                                const senderId = (message.sender as MessageSender)._id;
                                const isFromMe = currentUser ? senderId === currentUser._id : false;
                                const nextMessage = messages[index + 1];
                                const nextSenderId = nextMessage ? (nextMessage.sender as MessageSender)._id : null;
                                const showTail = !nextMessage || nextSenderId !== senderId;

                                return (
                                    <MessageBubble
                                        key={message._id}
                                        message={message}
                                        isFromMe={isFromMe}
                                        showTail={showTail}
                                    />
                                );
                            })}

                            {isTyping && (
                                <View className="flex-row justify-start mb-1">
                                    <View className="bg-surface-card dark:bg-surface-card-dark px-4 py-3 rounded-2xl rounded-bl-md">
                                        <View className="flex-row items-center gap-1">
                                            <View className="w-2 h-2 rounded-full bg-muted-foreground dark:bg-muted-foreground-dark animate-pulse" />
                                            <View className="w-2 h-2 rounded-full bg-muted-foreground dark:bg-muted-foreground-dark animate-pulse" style={{ opacity: 0.7 }} />
                                            <View className="w-2 h-2 rounded-full bg-muted-foreground dark:bg-muted-foreground-dark animate-pulse" style={{ opacity: 0.4 }} />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    )}

                    <View className='px-3 pb-2 pt-2 bg-surface dark:bg-surface-dark border-t border-surface-muted dark:border-surface-muted-dark'>
                        <View className='flex-row items-center gap-2'>
                            <Pressable className='w-10 h-10 rounded-full items-center justify-center bg-surface-card dark:bg-surface-card-dark active:opacity-70'>
                                <Ionicons name="happy-outline" size={22} color={theme.mutedForeground} />
                            </Pressable>

                            <View className='flex-1 flex-row items-center bg-surface-card dark:bg-surface-card-dark rounded-3xl px-4 min-h-[40px]'>
                                <TextInput
                                    placeholder="Message..."
                                    placeholderTextColor={theme.mutedForeground}
                                    className="flex-1 text-foreground dark:text-foreground-dark"
                                    multiline
                                    style={{
                                        fontSize: 15,
                                        maxHeight: 100,
                                        textAlignVertical: 'center',
                                        paddingVertical: 10,
                                    }}
                                    value={messageText}
                                    onChangeText={handleTyping}
                                    editable={!isSending}
                                />
                                <Pressable className='ml-2 active:opacity-70'>
                                    <Ionicons name="attach" size={22} color={theme.mutedForeground} />
                                </Pressable>
                            </View>

                            <Pressable
                                className={`w-10 h-10 rounded-full items-center justify-center ${messageText.trim()
                                    ? "bg-primary active:opacity-80"
                                    : "bg-surface-card dark:bg-surface-card-dark"
                                    }`}
                                onPress={handleSend}
                                disabled={!messageText.trim() || isSending}
                            >
                                {isSending ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : messageText.trim() ? (
                                    <Ionicons name="send" size={18} color="#FFFFFF" />
                                ) : (
                                    <Ionicons name="mic" size={20} color={theme.primary} />
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatDetailScreen