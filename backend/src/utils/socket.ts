import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat, type IChat } from "../models/Chat";
import { User } from "../models/User";

export const onlineUsers: Map<string, Set<string>> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL!,
    ]
    const io = new SocketServer(httpServer, {
        cors: {
            origin: allowedOrigins,
        },
    });

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }

        try {
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
            const clerkId = session.sub;

            const user = await User.findOne({ clerkId });
            if (!user) {
                return next(new Error("User not found"));
            }

            socket.data.userId = user._id.toString();
            next();

        } catch (error) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        const socketIds = onlineUsers.get(userId) ?? new Set<string>();
        socketIds.add(socket.id);
        onlineUsers.set(userId, socketIds);

        socket.broadcast.emit("user-online", { userId });

        socket.join(`user:${userId}`);

        socket.on("join-chat", async (chatId: string) => {
            try {
                const allowed = await Chat.exists({ _id: chatId, participants: userId });
                if (!allowed) {
                    socket.emit("socket-error", {
                        message: "Chat not found"
                    })
                    return;
                }
                socket.join(`chat:${chatId}`);
            } catch (error) {
                socket.emit("socket-error", {
                    message: "Chat not found"
                })
                return;
            }

        });

        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`);
        });

        socket.on("send-message", async (data: { chatId: string, text: string }) => {
            try {
                const { chatId, text } = data;

                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId,
                });

                if (!chat) {
                    socket.emit("socket-error", {
                        message: "Chat not found",
                    });
                    return;
                }

                const message = await Message.create({
                    text,
                    sender: userId,
                    chat: chatId,
                })

                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();

                await message.populate("sender", "name avatar");

                io.to(`chat:${chatId}`).emit("new-message", message);

                for (const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-message", message);
                }

            } catch (error) {
                socket.emit("socket-error", {
                    message: "Failed to send message",
                })
            }
        });

        socket.on("typing", async (data: { chatId: string, isTyping: boolean }) => {
            const typingPayload = {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping,
            };

            socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);
            try {
                const chat = await Chat.findById<IChat>(data.chatId);
                if (chat) {
                    const otherParticipantId = chat.participants.find((p) => p.toString() !== userId);
                    if (otherParticipantId) {
                        socket.to(`user:${otherParticipantId}`).emit("typing", typingPayload);
                    }
                }
            } catch (error) {
                console.error("Failed to emit typing", error);
            }
        });

        socket.on("disconnect", () => {
            const socketIds = onlineUsers.get(userId);
            if (!socketIds) return;

            socketIds.delete(socket.id);
            if (socketIds.size === 0) {
                onlineUsers.delete(userId);
                socket.broadcast.emit("user-offline", { userId });
            }
        });
    });

    return io;
};
