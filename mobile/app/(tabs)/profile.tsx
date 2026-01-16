import { Text, ScrollView, Pressable, View } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import { useTheme } from '@/providers/ThemeProvider'
import { Ionicons } from '@expo/vector-icons'

type ThemeOption = "light" | "dark" | "system";

const themeOptions: { value: ThemeOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "light", label: "Light", icon: "sunny" },
    { value: "dark", label: "Dark", icon: "moon" },
    { value: "system", label: "System", icon: "phone-portrait" },
];

const ProfileScreen = () => {
    const { signOut } = useAuth();
    const { theme, setTheme, resolvedTheme } = useTheme();

    return (
        <ScrollView
            className='flex-1 bg-background dark:bg-background-dark'
            contentInsetAdjustmentBehavior='automatic'
        >
            <View className="p-4">
                <Text className='text-foreground dark:text-foreground-dark text-2xl font-bold mb-6'>
                    Settings
                </Text>

                <View className="bg-surface dark:bg-surface-dark rounded-xl p-4 mb-4">
                    <Text className="text-foreground dark:text-foreground-dark font-semibold mb-3">
                        Appearance
                    </Text>
                    <View className="flex-row gap-2">
                        {themeOptions.map((option) => (
                            <Pressable
                                key={option.value}
                                onPress={() => setTheme(option.value)}
                                className={`flex-1 py-3 rounded-lg items-center ${theme === option.value
                                    ? "bg-primary"
                                    : "bg-surface-muted dark:bg-surface-muted-dark"
                                    }`}
                            >
                                <Ionicons
                                    name={option.icon}
                                    size={20}
                                    color={theme === option.value ? "#FFFFFF" : (resolvedTheme === "dark" ? "#A0A0A5" : "#71717A")}
                                />
                                <Text className={`mt-1 text-xs font-medium ${theme === option.value
                                    ? "text-white"
                                    : "text-muted-foreground dark:text-muted-foreground-dark"
                                    }`}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <Pressable
                    onPress={() => signOut()}
                    className='bg-red-500/10 dark:bg-red-500/20 px-4 py-4 rounded-xl border border-red-500/20 active:bg-red-500/20'
                >
                    <Text className='text-red-500 font-semibold text-center'>Sign Out</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default ProfileScreen