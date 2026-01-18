import { Text, ScrollView, Pressable, View } from 'react-native'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useTheme } from '@/providers/ThemeProvider'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { MENU_SECTIONS } from '@/lib/menuSettings';
import { colors } from '@/lib/colors';
import { useState } from 'react';
import { ThemeSheet } from '@/components/ThemeSheet';
import { useQueryClient } from '@tanstack/react-query';

const ProfileScreen = () => {
    const { signOut } = useAuth();
    const { user } = useUser();
    const { theme, resolvedTheme } = useTheme();
    const themeColors = colors[resolvedTheme];
    const [themeSheetVisible, setThemeSheetVisible] = useState(false);
    const queryClient = useQueryClient();

    const handleSignOut = () => {
        queryClient.clear(); // Limpia todo el caché antes de cerrar sesión
        signOut();
    };

    const themeLabel = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

    const handleMenuPress = (action?: string) => {
        if (action === "theme") {
            setThemeSheetVisible(true);
        }
    };

    const getItemValue = (item: typeof MENU_SECTIONS[number]["items"][number]) => {
        if ("action" in item && item.action === "theme") {
            return themeLabel;
        }
        return "value" in item ? item.value : undefined;
    };

    return (
        <>
            <ScrollView
                className='flex-1 bg-background dark:bg-background-dark'
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className='items-center'>
                    <View className='relative'>
                        <View className="rounded-full border-2 border-primary p-0.5">
                            <Image
                                source={user?.imageUrl}
                                style={{ width: 100, height: 100, borderRadius: 999 }}
                            />
                        </View>

                        <Pressable
                            className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-background dark:border-background-dark active:opacity-80"
                            hitSlop={10}
                        >
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </Pressable>
                    </View>

                    <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark mt-4">
                        {user?.firstName} {user?.lastName}
                    </Text>

                    <Text className="text-muted-foreground dark:text-muted-foreground-dark mt-1">
                        {user?.emailAddresses[0]?.emailAddress}
                    </Text>

                    <View className="flex-row items-center mt-3 bg-green-500/20 px-3 py-1.5 rounded-full">
                        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <Text className="text-green-500 text-sm font-medium">Online</Text>
                    </View>
                </View>

                {MENU_SECTIONS.map((section) => (
                    <View key={section.title} className="mt-8">
                        <Text className="text-muted-foreground dark:text-muted-foreground-dark text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
                            {section.title}
                        </Text>
                        <View className="bg-surface-card dark:bg-surface-card-dark rounded-2xl overflow-hidden">
                            {section.items.map((item, index) => (
                                <Pressable
                                    key={item.label}
                                    onPress={() => handleMenuPress("action" in item ? item.action : undefined)}
                                    className={`flex-row items-center px-4 py-3.5 active:opacity-70 ${index < section.items.length - 1
                                        ? "border-b border-surface-muted dark:border-surface-muted-dark"
                                        : ""
                                        }`}
                                >
                                    <View
                                        className="w-9 h-9 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: `${item.color}20` }}
                                    >
                                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    <Text className="flex-1 ml-3 text-foreground dark:text-foreground-dark font-medium">
                                        {item.label}
                                    </Text>
                                    {getItemValue(item) && (
                                        <Text className="text-muted-foreground dark:text-muted-foreground-dark text-sm mr-1">
                                            {getItemValue(item)}
                                        </Text>
                                    )}
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={themeColors.mutedForeground}
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                <Pressable
                    className="mt-8 bg-red-500/10 rounded-2xl py-4 items-center active:opacity-70 border border-red-500/20"
                    onPress={handleSignOut}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        <Text className="ml-2 text-red-500 font-semibold">Log Out</Text>
                    </View>
                </Pressable>

                <Text className="text-center text-muted-foreground dark:text-muted-foreground-dark text-xs mt-8">
                    Version 1.0.0
                </Text>
            </ScrollView>

            <ThemeSheet
                visible={themeSheetVisible}
                onClose={() => setThemeSheetVisible(false)}
            />
        </>
    )
}

export default ProfileScreen