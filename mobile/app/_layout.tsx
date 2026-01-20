import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ClerkProvider } from '@clerk/clerk-expo';
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/lib/colors";
import { StatusBar } from "expo-status-bar";
import { SocketConnection } from '@/components/ui';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { resolvedTheme } = useTheme();
  const themeColors = colors[resolvedTheme];

  return (
    <>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeColors.background,
        }
      }}>
        <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SocketConnection />
            <ThemeProvider>
              <RootLayoutNav />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ClerkProvider>
  );
}