import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";

export const useCurrentUser = () => {
    const { apiWithAuth } = useApi();
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            await apiWithAuth<User>({
                method: "POST",
                url: "/auth/callback"
            });

            const { data } = await apiWithAuth<User>({
                method: "GET",
                url: "/auth/me"
            });
            return data;
        },
        enabled: !!isSignedIn,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};