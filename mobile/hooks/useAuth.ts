import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
    const { apiWithAuth } = useApi();

    return useMutation({
        mutationFn: async () => {
            const response = await apiWithAuth<User>({
                method: "POST",
                url: "/auth/callback",
            });
            return response.data;
        }
    })
}