import { useApi } from "@/lib/axios";
import type { Chat } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useAuth";

export const useChats = () => {
    const { apiWithAuth } = useApi();
    const { data: currentUser } = useCurrentUser();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const { data } = await apiWithAuth<Chat[]>({
                method: "GET",
                url: "/chats"
            });
            return data;
        },
        enabled: !!currentUser,
    })
}

export const useGetOrCreateChat = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await apiWithAuth<Chat>({
                method: "POST",
                url: `/chats/with/${participantId}`,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chats"]
            });
        },
        onError: (error) => {
            console.error("Error creating chat:", error);
        }
    })
}

export const useMarkChatAsRead = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (chatId: string) => {
            const { data } = await apiWithAuth({
                method: "POST",
                url: `/chats/${chatId}/read`,
            });
            return data;
        },
        onMutate: async (chatId: string) => {
            await queryClient.cancelQueries({ queryKey: ["chats"] });

            const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

            queryClient.setQueryData<Chat[]>(["chats"], (old) => {
                return old?.map((chat) => {
                    if (chat._id === chatId) {
                        return { ...chat, hasUnread: false };
                    }
                    return chat;
                });
            });

            return { previousChats };
        },
        onError: (_error, _chatId, context) => {
            if (context?.previousChats) {
                queryClient.setQueryData(["chats"], context.previousChats);
            }
        },
    });
}