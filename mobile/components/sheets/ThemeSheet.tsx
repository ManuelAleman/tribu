import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import { useThemeColors } from '@/lib/colors';
import { themeOptions, ThemeOption } from '@/lib/menuSettings';
import { useCallback, useMemo, forwardRef } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

interface ThemeSheetProps {
    onClose: () => void;
}

export const ThemeSheet = forwardRef<BottomSheet, ThemeSheetProps>(({ onClose }, ref) => {
    const { theme, setTheme } = useTheme();
    const themeColors = useThemeColors();

    const snapPoints = useMemo(() => ['45%'], []);

    const handleSelect = useCallback((value: ThemeOption) => {
        setTheme(value);
        onClose();
    }, [setTheme, onClose]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            onClose={onClose}
            enablePanDownToClose
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
                backgroundColor: themeColors.surfaceCard,
            }}
            handleIndicatorStyle={{
                backgroundColor: themeColors.mutedForeground,
                width: 40,
            }}
        >
            <View className="px-6 pb-10">
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
            </View>
        </BottomSheet>
    );
});

ThemeSheet.displayName = 'ThemeSheet';