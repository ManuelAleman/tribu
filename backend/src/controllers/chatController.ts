import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const chats = await Chat.find({ participants: userId })
            .populate("participants", "name email avatar")
            .populate("lastMessage")
            .sort({ lastMessageAt: -1 });

        const formatedChats = chats.map(chat => {
            const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);

            return {
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
            }
        })

        return res.json(formatedChats);
    } catch (error) {
        next(error);
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { participantId } = req.params;

        if (!participantId) {
            return res.status(400).json({ message: "Participant ID is required" });
        }

        if (participantId === userId) {
            return res.status(400).json({ message: "Participant ID cannot be the same as the user ID" });
        }

        let chat = await Chat.findOne({
            participants: { $all: [userId, participantId] },
        }).populate("participants", "name email avatar")
            .populate("lastMessage");

        if (!chat) {
            const newChat = new Chat({ participants: [userId, participantId] });
            chat = await newChat.save();
            chat = await newChat.populate("participants", "name email avatar");
        }

        const otherParticipant = chat.participants.find(p => p._id.toString() !== userId);

        return res.json({
            _id: chat._id,
            participantId: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
        });
    } catch (error) {
        next(error);
    }
}