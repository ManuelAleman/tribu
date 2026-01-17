import { Ionicons } from "@expo/vector-icons";

export type ThemeOption = "light" | "dark" | "system";

export const themeOptions: { value: ThemeOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "light", label: "Light", icon: "sunny" },
    { value: "dark", label: "Dark", icon: "moon" },
    { value: "system", label: "System", icon: "phone-portrait" },
];

export const MENU_SECTIONS = [
    {
        title: "Account",
        items: [
            {
                icon: "person-outline",
                label: "Edit Profile",
                color: "#F4A261",
            },
            {
                icon: "notifications-outline",
                label: "Notifications",
                value: "On",
                color: "#8B5CF6",
            },
        ],
    },
    {
        title: "Preferences",
        items: [
            {
                icon: "color-palette-outline",
                label: "Appearance",
                action: "theme",
                color: "#6366F1",
            },
            {
                icon: "language-outline",
                label: "Language",
                action: "language",
                color: "#EC4899",
            },
        ],
    },
] as const;
