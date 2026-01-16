export const colors = {
    light: {
        background: "#FFFFFF",
        foreground: "#18181B",
        surface: "#F4F4F5",
        surfaceCard: "#FFFFFF",
        surfaceMuted: "#E4E4E7",
        mutedForeground: "#71717A",
        primary: "#7C3AED",
        primaryLight: "#A78BFA",
    },
    dark: {
        background: "#0D0D0F",
        foreground: "#FFFFFF",
        surface: "#1A1A1D",
        surfaceCard: "#242428",
        surfaceMuted: "#2D2D30",
        mutedForeground: "#A0A0A5",
        primary: "#7C3AED",
        primaryLight: "#A78BFA",
    },
} as const;

export type ThemeColors = typeof colors.light;
