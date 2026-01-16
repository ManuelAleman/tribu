/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./providers/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "#FFFFFF",
                    dark: "#0D0D0F",
                },
                foreground: {
                    DEFAULT: "#18181B",
                    dark: "#FFFFFF",
                },
                surface: {
                    DEFAULT: "#F4F4F5",
                    dark: "#1A1A1D",
                },
                "surface-card": {
                    DEFAULT: "#FFFFFF",
                    dark: "#242428",
                },
                "surface-muted": {
                    DEFAULT: "#E4E4E7",
                    dark: "#2D2D30",
                },
                "muted-foreground": {
                    DEFAULT: "#71717A",
                    dark: "#A0A0A5",
                },
                primary: {
                    DEFAULT: "#7C3AED",
                    light: "#A78BFA",
                    dark: "#5B21B6",
                    soft: "#EDE9FE",
                },
            },
        },
    },
    plugins: [],
}