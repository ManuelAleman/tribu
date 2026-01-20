import { View } from 'react-native';
import { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

type BubbleSkeletonProps = {
    isFromMe: boolean;
    width: number;
};

function BubbleSkeleton({ isFromMe, width }: BubbleSkeletonProps) {
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
        <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
            <Animated.View
                style={[animatedStyle, { width }]}
                className={`h-12 rounded-2xl ${isFromMe
                        ? "bg-primary/40 rounded-br-md"
                        : "bg-surface-muted dark:bg-surface-muted-dark rounded-bl-md"
                    }`}
            />
        </View>
    );
}

const messagePattern = [
    { isFromMe: false, width: 180 },
    { isFromMe: false, width: 120 },
    { isFromMe: true, width: 200 },
    { isFromMe: false, width: 160 },
    { isFromMe: true, width: 140 },
    { isFromMe: true, width: 100 },
    { isFromMe: false, width: 220 },
    { isFromMe: true, width: 180 },
];

export function MessagesSkeleton() {
    return (
        <View className="flex-1 px-4 pb-4">
            <View className="flex-1" />
            {messagePattern.map((msg, index) => (
                <BubbleSkeleton
                    key={index}
                    isFromMe={msg.isFromMe}
                    width={msg.width}
                />
            ))}
        </View>
    );
}
