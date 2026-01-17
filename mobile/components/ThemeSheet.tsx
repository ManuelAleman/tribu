import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import { colors } from '@/lib/colors';
import { themeOptions, ThemeOption } from '@/lib/menuSettings';
import { useCallback } from 'react';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ThemeSheetProps {
    visible: boolean;
    onClose: () => void;
}

export function ThemeSheet({ visible, onClose }: ThemeSheetProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const themeColors = colors[resolvedTheme];

    const handleSelect = useCallback((value: ThemeOption) => {
        setTheme(value);
        onClose();
    }, [setTheme, onClose]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <AnimatedPressable
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    className="absolute inset-0 bg-black/50"
                    onPress={onClose}
                />

                <Animated.View
                    entering={SlideInDown.springify().damping(20).stiffness(150)}
                    exiting={SlideOutDown.duration(200)}
                    className="bg-surface-card dark:bg-surface-card-dark rounded-t-3xl px-6 pt-4 pb-10"
                >
                    <View className="items-center mb-4">
                        <View className="w-10 h-1 bg-surface-muted dark:bg-surface-muted-dark rounded-full" />
                    </View>

                    <Text className="text-xl font-bold text-foreground dark:text-foreground-dark text-center mb-6">
                        Choose Theme
                    </Text>

                    <View className="gap-3">
                        {themeOptions.map((option) => {
                            const isSelected = theme === option.value;
                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => handleSelect(option.value)}
                                    className={`flex-row items-center p-4 rounded-2xl border-2 ${isSelected
                                        ? "border-primary bg-primary/10"
                                        : "border-surface-muted dark:border-surface-muted-dark bg-surface dark:bg-surface-dark"
                                        }`}
                                >
                                    <View
                                        className={`w-12 h-12 rounded-xl items-center justify-center ${isSelected ? "bg-primary" : "bg-surface-muted dark:bg-surface-muted-dark"
                                            }`}
                                    >
                                        <Ionicons
                                            name={option.icon}
                                            size={24}
                                            color={isSelected ? "#FFFFFF" : themeColors.mutedForeground}
                                        />
                                    </View>
                                    <Text
                                        className={`flex-1 ml-4 font-semibold text-base ${isSelected
                                            ? "text-primary"
                                            : "text-foreground dark:text-foreground-dark"
                                            }`}
                                    >
                                        {option.label}
                                    </Text>
                                    {isSelected && (
                                        <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                        </View>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
