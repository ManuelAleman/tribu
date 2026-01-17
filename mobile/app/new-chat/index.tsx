import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useUsers } from '@/hooks/useUsers'
import { useGetOrCreateChat } from '@/hooks/useChats'
import { User } from '@/types'
import UserItem from '@/components/UserItem'
import { useThemeColors } from '@/lib/colors'

const NewChatScreen = () => {
    const theme = useThemeColors()

    const [searchQuery, setSearchQuery] = useState('');

    const { data: allUsers, isLoading } = useUsers();
    const { mutate: getOrCreateChat, isPending: isCreatingChat } = useGetOrCreateChat();

    const users = allUsers?.filter((u) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
    });

    const handleUserSelect = (user: User) => {
        getOrCreateChat(user._id, {
            onSuccess: (chat) => {
                if (!chat.participant) {
                    console.error("No participant found");
                    return;
                }
                router.dismiss();

                setTimeout(() => {
                    router.push({
                        pathname: "/chat/[id]",
                        params: {
                            id: chat._id,
                            participantId: chat.participant._id,
                            name: chat.participant.name,
                            avatar: chat.participant.avatar,
                        },
                    });
                }, 100);
            },
        });
    };

    return (
        <SafeAreaView className='flex-1 bg-transparent' edges={['top']}>
            <View className='flex-1 bg-black/40 justify-end'>
                <View className='bg-surface dark:bg-surface-dark rounded-t-3xl h-[95%] overflow-hidden'>
                    <View className='px-5 pt-4 pb-3 border-b border-surface-muted dark:border-surface-muted-dark flex-row items-center'>
                        <Pressable
                            className="w-9 h-9 rounded-full items-center justify-center mr-3 bg-surface-card dark:bg-surface-card-dark active:opacity-70"
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color={theme.mutedForeground}
                            />
                        </Pressable>

                        <View className="flex-1">
                            <Text className="text-foreground dark:text-foreground-dark text-xl font-semibold">
                                New chat
                            </Text>
                            <Text className="text-muted-foreground dark:text-muted-foreground-dark text-xs mt-0.5">
                                Search for a user to start chatting
                            </Text>
                        </View>
                    </View>

                    <View className="px-5 py-3">
                        <View className="flex-row items-center bg-surface-card dark:bg-surface-card-dark rounded-xl px-4 py-2.5 gap-2.5 border border-surface-muted dark:border-surface-muted-dark">
                            <Ionicons name="search" size={18} color={theme.mutedForeground} />
                            <TextInput
                                placeholder="Search users..."
                                placeholderTextColor={theme.mutedForeground}
                                className="flex-1 text-foreground dark:text-foreground-dark text-sm"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCapitalize="none"
                            />
                            {searchQuery.length > 0 && (
                                <Pressable onPress={() => setSearchQuery('')} className="active:opacity-70">
                                    <Ionicons name="close-circle" size={18} color={theme.mutedForeground} />
                                </Pressable>
                            )}
                        </View>
                    </View>

                    <View className='flex-1'>
                        {isCreatingChat || isLoading ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator size="large" color={theme.primary} />
                                <Text className="text-muted-foreground dark:text-muted-foreground-dark text-sm mt-3">
                                    {isCreatingChat ? 'Creating chat...' : 'Loading users...'}
                                </Text>
                            </View>
                        ) : !users || users.length === 0 ? (
                            <View className="flex-1 items-center justify-center px-5">
                                <View className="w-20 h-20 rounded-full bg-surface-card dark:bg-surface-card-dark items-center justify-center mb-4">
                                    <Ionicons name="person-outline" size={40} color={theme.mutedForeground} />
                                </View>
                                <Text className="text-foreground dark:text-foreground-dark text-lg font-medium">
                                    No users found
                                </Text>
                                <Text className="text-muted-foreground dark:text-muted-foreground-dark text-sm mt-1 text-center">
                                    Try a different search term
                                </Text>
                            </View>
                        ) : (
                            <ScrollView
                                className="flex-1 px-5"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 24 }}
                            >
                                <Text className="text-muted-foreground dark:text-muted-foreground-dark text-xs font-medium mb-2 tracking-wider">
                                    USERS ({users.length})
                                </Text>
                                {users.map((user) => (
                                    <UserItem
                                        key={user._id}
                                        user={user}
                                        isOnline={true}
                                        onPress={() => handleUserSelect(user)}
                                    />
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default NewChatScreen