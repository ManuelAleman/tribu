import { ChatItem } from '@/components/chat';
import { ChatSkeleton, ErrorState } from '@/components/ui';
import { NewChatSheet } from '@/components/sheets';
import { useChats } from '@/hooks/useChats';
import { colors } from '@/lib/colors';
import { useTheme } from '@/providers/ThemeProvider';
import type { Chat } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router'
import { View, Text, FlatList, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useCallback } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

const ChatsScreen = () => {
    const router = useRouter();
    const { data: chats, isLoading, isFetching, isPending, error, refetch } = useChats();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const showLoading = isLoading || isPending || (isFetching && !chats);

    const handleOpenNewChat = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleCloseNewChat = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    if (showLoading) {
        return <ChatSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                title="Failed to load chats"
                description="Please try again later"
                onRetry={() => { refetch() }}
            />
        )
    }

    const handleChatPress = (chat: Chat) => {
        router.push({
            pathname: "/chat/[id]",
            params: {
                id: chat._id,
                participantId: chat.participant._id,
                name: chat.participant.name,
                avatar: chat.participant.avatar,
            }
        })
    }

    return (
        <SafeAreaView className='flex-1 bg-surface dark:bg-surface-dark' edges={['top']}>
            <FlatList
                data={chats}
                keyExtractor={item => item._id}
                renderItem={({ item }) =>
                    <ChatItem chat={item} onPress={() => { handleChatPress(item) }} />
                }
                ListHeaderComponent={<Header onNewChat={handleOpenNewChat} />}
                ListEmptyComponent={showLoading ? null : <NoMessagesComponent onNewChat={handleOpenNewChat} />}
                ListFooterComponent={chats && chats.length > 0 ? <Footer /> : null}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 24,
                }}
            />
            <NewChatSheet ref={bottomSheetRef} onClose={handleCloseNewChat} />
        </SafeAreaView>
    )
}

export default ChatsScreen;

function Header({ onNewChat }: { onNewChat: () => void }) {
    return (
        <View className="pt-2 pb-4">
            <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                    Chats
                </Text>
                <Pressable
                    hitSlop={10}
                    accessibilityLabel='Start a new chat'
                    className="size-10 bg-primary rounded-full items-center justify-center active:opacity-80"
                    onPress={onNewChat}
                >
                    <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </View>
    );
}

function Footer() {
    const { resolvedTheme } = useTheme();
    const themeColors = colors[resolvedTheme];

    return (
        <View className="items-center justify-center py-6">
            <View className="flex-row items-center gap-2">
                <Ionicons
                    name="lock-closed-outline"
                    size={14}
                    color={themeColors.mutedForeground}
                />
                <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                    Your personal messages are safe
                </Text>
            </View>
        </View>
    );
}

function NoMessagesComponent({ onNewChat }: { onNewChat: () => void }) {
    return (
        <View className="flex-1 items-center justify-center py-16">
            <View className="mb-6">
                <Image
                    source={require('@/assets/images/no-message-image.png')}
                    className="w-48 h-48"
                    resizeMode="contain"
                />
            </View>

            <Text className="text-xl font-bold text-foreground dark:text-foreground-dark mb-2 text-center">
                No messages yet
            </Text>
            <Text className="text-base text-muted-foreground dark:text-muted-foreground-dark text-center mb-8 px-8 leading-6">
                Start a conversation and stay connected with the people you care about.
            </Text>

            <Pressable
                className="bg-primary flex-row items-center px-6 py-3 rounded-full active:opacity-80"
                onPress={onNewChat}
            >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                    New chat
                </Text>
            </Pressable>
        </View>
    );
}