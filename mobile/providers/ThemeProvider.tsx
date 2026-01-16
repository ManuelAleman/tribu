import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
    theme: ThemePreference;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: ThemePreference) => void;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = "@tribu_theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemePreference>("system");
    const [isLoading, setIsLoading] = useState(true);

    const { colorScheme, setColorScheme } = useColorScheme();

    const resolvedTheme: ResolvedTheme =
        colorScheme === "dark" ? "dark" : "light";

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);

                if (
                    stored === "light" ||
                    stored === "dark" ||
                    stored === "system"
                ) {
                    setThemeState(stored);
                    setColorScheme(stored);
                } else {
                    setColorScheme("system");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [setColorScheme, setThemeState, setIsLoading]);

    const setTheme = useCallback(
        async (newTheme: ThemePreference) => {
            setThemeState(newTheme);
            await AsyncStorage.setItem(STORAGE_KEY, newTheme);

            if (newTheme === "system") {
                setColorScheme("light");
                requestAnimationFrame(() => {
                    setColorScheme("system");
                });
            } else {
                setColorScheme(newTheme);
            }
        },
        [setColorScheme]
    );

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                setTheme,
                isLoading,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
