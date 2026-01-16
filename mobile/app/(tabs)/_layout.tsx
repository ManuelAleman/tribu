import { Redirect, Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@clerk/clerk-expo";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/lib/colors";

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const { resolvedTheme } = useTheme();
    const themeColors = colors[resolvedTheme];

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Redirect href={'/(auth)'} />
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.surfaceMuted,
                    borderTopWidth: 1,
                    height: 88,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: themeColors.primary,
                tabBarInactiveTintColor: themeColors.mutedForeground,
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Chats",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons
                            name={focused ? "chatbubbles" : "chatbubbles-outline"}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout