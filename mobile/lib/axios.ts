import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(
                `[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
                {
                    status: error.response.status,
                    data: error.response.data,
                }
            );
        } else if (error.request) {
            console.warn("[API ERROR] No response from server", {
                endpoint: error.config?.url,
                method: error.config?.method,
            });
        } else {
            console.error("[API ERROR] Unknown error", error.message);
        }

        return Promise.reject(error);
    }
);

export const useApi = () => {
    const { getToken } = useAuth();

    const apiWithAuth = useCallback(
        async <T>(config: Parameters<typeof api.request>[0]) => {
            const token = await getToken();

            return api.request<T>({
                ...config,
                headers: {
                    ...config.headers,
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });
        },
        [getToken]
    );

    return { api, apiWithAuth };
};
