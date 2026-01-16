import { View, Text, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import useAuthSocialAuth from '@/hooks/useSocialAuth'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/lib/colors'

const { width, height } = Dimensions.get('window')

const AuthScreen = () => {
    const { handleSocialAuth, loadingStrategy } = useAuthSocialAuth();
    const isLoading = loadingStrategy !== null;

    const { resolvedTheme } = useTheme();
    const themeColors = colors[resolvedTheme];
    const isDark = resolvedTheme === 'dark';

    return (
        <View className='flex-1 bg-background dark:bg-background-dark'>
            <View
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-30"
                style={{ backgroundColor: themeColors.primary }}
            />
            <View
                className="absolute top-1/4 -left-20 w-40 h-40 rounded-full opacity-20"
                style={{ backgroundColor: themeColors.primaryLight }}
            />
            <View
                className="absolute bottom-20 -right-10 w-32 h-32 rounded-full opacity-25"
                style={{ backgroundColor: themeColors.primary }}
            />

            <SafeAreaView className='flex-1'>
                <View className="items-center pt-8">
                    <Image
                        source={require("../../assets/images/tribu-logo.png")}
                        style={{ width: 80, height: 80 }}
                        contentFit="contain"
                    />
                    <Text className="text-2xl font-bold text-primary tracking-widest uppercase mt-1">
                        Tribu
                    </Text>
                </View>

                <View className="flex-1 justify-center items-center px-6">
                    <Image
                        source={require("../../assets/images/auth-hero-img.png")}
                        style={{
                            width: width - 80,
                            height: height * 0.28
                        }}
                        contentFit="contain"
                    />

                    <View className="mt-8 items-center">
                        <Text className="text-4xl font-bold text-foreground dark:text-foreground-dark text-center">
                            Talk Simply,
                        </Text>
                        <View className="flex-row items-center gap-2 mt-1">
                            <View className="h-0.5 w-8 bg-primary rounded-full" />
                            <Text className="text-2xl font-bold text-primary">
                                Live Better
                            </Text>
                            <View className="h-0.5 w-8 bg-primary rounded-full" />
                        </View>
                        <Text className="text-muted-foreground dark:text-muted-foreground-dark text-center mt-4 text-sm px-4">
                            Connect with your community in a simple, meaningful way
                        </Text>
                    </View>
                </View>

                <View className="px-6 pb-8">
                    <Text className="text-muted-foreground dark:text-muted-foreground-dark text-center text-xs mb-4 uppercase tracking-wider">
                        Continue with
                    </Text>

                    <View className='flex-row gap-3'>
                        <Pressable
                            className="flex-1 flex-row items-center justify-center gap-3 py-4 rounded-2xl active:scale-[0.97] border"
                            style={{
                                backgroundColor: isDark ? themeColors.surfaceCard : '#FFFFFF',
                                borderColor: isDark ? themeColors.surfaceMuted : '#E5E7EB',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.3 : 0.08,
                                shadowRadius: 8,
                                elevation: 3,
                            }}
                            disabled={isLoading}
                            accessibilityRole='button'
                            accessibilityLabel='Continue with Google'
                            onPress={() => !isLoading && handleSocialAuth("oauth_google")}
                        >
                            {loadingStrategy === "oauth_google" ? (
                                <ActivityIndicator size="small" color={themeColors.primary} />
                            ) : (
                                <>
                                    <Image
                                        source={require("../../assets/images/google.png")}
                                        style={{ width: 22, height: 22 }}
                                        contentFit="contain"
                                    />
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: themeColors.foreground }}
                                    >
                                        Google
                                    </Text>
                                </>
                            )}
                        </Pressable>

                        <Pressable
                            className="flex-1 flex-row items-center justify-center gap-3 py-4 rounded-2xl active:scale-[0.97]"
                            style={{
                                backgroundColor: isDark ? '#FFFFFF' : '#000000',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.3 : 0.15,
                                shadowRadius: 8,
                                elevation: 3,
                            }}
                            disabled={isLoading}
                            accessibilityRole='button'
                            accessibilityLabel='Continue with Apple'
                            onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
                        >
                            {loadingStrategy === "oauth_apple" ? (
                                <ActivityIndicator size="small" color={isDark ? '#000000' : '#FFFFFF'} />
                            ) : (
                                <>
                                    <Ionicons
                                        name="logo-apple"
                                        size={22}
                                        color={isDark ? '#000000' : '#FFFFFF'}
                                    />
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: isDark ? '#000000' : '#FFFFFF' }}
                                    >
                                        Apple
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </View>

                    <Text className="text-muted-foreground dark:text-muted-foreground-dark text-center text-xs mt-6 px-8">
                        By continuing, you agree to our{' '}
                        <Text className="text-primary">Terms</Text> and{' '}
                        <Text className="text-primary">Privacy Policy</Text>
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default AuthScreen