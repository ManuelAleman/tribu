import { View, ScrollView } from 'react-native';
import { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

function SkeletonItem() {
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className="flex-row items-center py-3">
            <Animated.View
                style={animatedStyle}
                className="size-14 rounded-full bg-surface-muted dark:bg-surface-muted-dark"
            />

            <View className="flex-1 ml-4">
                <Animated.View
                    style={animatedStyle}
                    className="h-4 w-32 rounded-md bg-surface-muted dark:bg-surface-muted-dark mb-2"
                />
                <Animated.View
                    style={animatedStyle}
                    className="h-3 w-48 rounded-md bg-surface-muted dark:bg-surface-muted-dark"
                />
            </View>

            <Animated.View
                style={animatedStyle}
                className="h-3 w-10 rounded-md bg-surface-muted dark:bg-surface-muted-dark"
            />
        </View>
    );
}

export function ChatSkeleton({ count = 6 }: { count?: number }) {
    return (
        <View className="flex-1 bg-surface dark:bg-surface-dark">
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 24,
                }}
            >
                <View className="pt-2 pb-4 flex-row items-center justify-between">
                    <View className="h-7 w-20 rounded-md bg-surface-muted dark:bg-surface-muted-dark opacity-50" />
                    <View className="size-10 rounded-full bg-surface-muted dark:bg-surface-muted-dark opacity-50" />
                </View>

                {Array.from({ length: count }).map((_, index) => (
                    <SkeletonItem key={index} />
                ))}
            </ScrollView>
        </View>
    );
}
