import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

const API_URL = "https://tribu-55z2i.sevalla.app/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

export const useApi = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const requestIntercept = api.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        })

        const responseIntercept = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    console.error("Error response", error.response.data);
                }
                else if (error.request) {
                    console.error("No response from server", error);
                }

                return Promise.reject(error);
            }
        )

        return () => {
            api.interceptors.request.eject(requestIntercept);
            api.interceptors.response.eject(responseIntercept);
        }
    }, [getToken]);

    return api;
}