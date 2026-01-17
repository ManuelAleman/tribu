import { useApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
    const api = useApi();

    return useMutation({
        mutationFn: async () => {
            const response = await api.post("/auth/callback");
            return response.data;
        }
    })
}