import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { Chat, Message, MessageSender, MessagesResponse } from "@/types";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL!;

interface SocketStore {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: Set<string>;
    typingUsers: Map<string, string>;
    currentChatId: string | null;
    queryClient: QueryClient | null;

    connect: (token: string, queryClient: QueryClient) => void;
    disconnect: () => void;
    joinChat: (chatId: string) => void;
    leaveChat: (chatId: string) => void;
    sendMessage: (chatId: string, text: string, currentUser: MessageSender) => void;
    sendTyping: (chatId: string, isTyping: boolean) => void;
    reset: () => void;
}


export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    typingUsers: new Map(),
    currentChatId: null,
    queryClient: null,
    connect: (token: string, queryClient: QueryClient) => {
        if (!SOCKET_URL) return;
        const existingSocket = get().socket;

        if (existingSocket?.connected) return;
        if (existingSocket) existingSocket.disconnect();

        const socket = io(SOCKET_URL, {
            auth: { token },
        });

        socket.on("connect", () => {
            if (__DEV__) {
                console.log("Socket connected", socket.id);
            }
            set({ isConnected: true });
        });

        socket.on("disconnect", () => {
            if (__DEV__) {
                console.log("Socket disconnected", socket.id);
            }
            set({ isConnected: false });
        });

        socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
            if (__DEV__) {
                console.log("Online users", userIds);
            }
            set({ onlineUsers: new Set(userIds) });
        });

        socket.on("user-online", ({ userId }: { userId: string }) => {
            set(state => ({
                onlineUsers: new Set([...state.onlineUsers, userId])
            }))
        });

        socket.on("user-offline", ({ userId }: { userId: string }) => {
            set((state) => {
                const onlineUsers = new Set(state.onlineUsers);
                onlineUsers.delete(userId);
                return { onlineUsers: onlineUsers };
            });
        });

        socket.on("socket-error", (error: { message: string }) => {
            if (__DEV__) {
                console.error("Socket error:", error.message);
            }
        });

        socket.on("new-chat", (chat: Chat) => {
            if (!chat || !chat._id) return;

            queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
                if (!oldChats) return [chat];
                if (oldChats.some((c) => c._id === chat._id)) return oldChats;
                return [chat, ...oldChats];
            });
        });

        socket.on("new-message", (message: Message) => {
            if (!message || !message.sender) return;
            const senderId = typeof message.sender === 'string' ? message.sender : (message.sender as MessageSender)._id;
            const { currentChatId } = get();

            queryClient.setQueryData<MessagesResponse>(["messages", message.chat], (old) => {
                if (!old) return { messages: [message], participantLastReadAt: null };
                const filtered = old.messages.filter((m) => !m._id.startsWith("temp-"));
                if (filtered.some((m) => m._id === message._id)) return { ...old, messages: filtered };
                return { ...old, messages: [...filtered, message] };
            });

            queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
                if (!oldChats) return oldChats;
                
                const chatExists = oldChats.some((chat) => chat._id === message.chat);
                if (!chatExists) return oldChats;
                
                return oldChats.map((chat) => {
                    if (chat._id === message.chat) {
                        const isFromOther = chat.participant && senderId === chat.participant._id;
                        const isUnread = currentChatId !== message.chat && isFromOther;
                        return {
                            ...chat,
                            lastMessage: {
                                _id: message._id,
                                text: message.text,
                                sender: senderId,
                                createdAt: message.createdAt,
                            },
                            lastMessageAt: message.createdAt,
                            hasUnread: isUnread ? true : chat.hasUnread,
                            isLastMessageFromMe: !isFromOther,
                            isLastMessageRead: false,
                        };
                    }
                    return chat;
                });
            });

            if (currentChatId === message.chat && senderId !== currentChatId) {
                socket.emit("mark-read", { chatId: message.chat });
            }

            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                typingUsers.delete(message.chat);
                return { typingUsers: typingUsers };
            });
        });

        socket.on("typing", ({ userId, chatId, isTyping }: { userId: string, chatId: string, isTyping: boolean }) => {
            set((state) => {
                const typingUsers = new Map(state.typingUsers);
                if (isTyping) {
                    typingUsers.set(chatId, userId);
                } else {
                    typingUsers.delete(chatId);
                }
                return { typingUsers: typingUsers };
            });
        });

        socket.on("messages-read", ({ chatId, readAt }: { chatId: string, readAt: string, readBy: string }) => {
            queryClient.setQueryData<MessagesResponse>(["messages", chatId], (old) => {
                if (!old) return old;
                return { ...old, participantLastReadAt: readAt };
            });

            queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
                if (!oldChats) return oldChats;
                return oldChats.map((chat) => {
                    if (chat._id === chatId && chat.isLastMessageFromMe) {
                        return { ...chat, isLastMessageRead: true };
                    }
                    return chat;
                });
            });
        });

        set({ socket, queryClient });

    },
    disconnect: () => {
        const { socket } = get();
        socket?.disconnect();
        set({ socket: null, isConnected: false });
    },
    joinChat: (chatId: string) => {
        const { socket, queryClient } = get();
        set({ currentChatId: chatId });

        if (socket?.connected) {
            socket.emit("join-chat", chatId);
            socket.emit("mark-read", { chatId });
            
            if (queryClient) {
                queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
                    return oldChats?.map((chat) => {
                        if (chat._id === chatId) {
                            return { ...chat, hasUnread: false };
                        }
                        return chat;
                    });
                });
            }
        }
    },
    leaveChat: (chatId) => {
        const { socket } = get();
        set({ currentChatId: null });
        if (socket?.connected) {
            socket.emit("leave-chat", chatId);
        }
    },
    sendMessage: (chatId: string, text: string, currentUser: MessageSender) => {
        const { socket, queryClient } = get();
        if (!socket?.connected || !queryClient) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            _id: tempId,
            chat: chatId,
            sender: currentUser,
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        queryClient.setQueryData<MessagesResponse>(["messages", chatId], (old) => {
            if (!old) return { messages: [optimisticMessage], participantLastReadAt: null };
            return { ...old, messages: [...old.messages, optimisticMessage] };
        });

        socket.emit("send-message", { chatId, text });

        const errorHandler = (error: { message: string }) => {
            if (__DEV__) {
                console.error("Failed to send message", error.message);
            }
            queryClient.setQueryData<MessagesResponse>(["messages", chatId], (old) => {
                if (!old) return { messages: [], participantLastReadAt: null };
                return { ...old, messages: old.messages.filter((m) => m._id !== tempId) };
            });
            socket.off("socket-error", errorHandler);
        };
        socket.once("socket-error", errorHandler)
    },
    sendTyping: (chatId: string, isTyping: boolean) => {
        const { socket } = get();
        if (socket?.connected) {
            socket.emit("typing", { chatId, isTyping });
        }
    },
    reset: () => {
        const { socket } = get();
        socket?.disconnect();

        set({
            socket: null,
            isConnected: false,
            onlineUsers: new Set(),
            typingUsers: new Map(),
            currentChatId: null,
            queryClient: null,
        });
    },

}));