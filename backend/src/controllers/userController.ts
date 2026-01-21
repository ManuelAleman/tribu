import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import Expo from "expo-server-sdk";

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const users = await User.find({ _id: { $ne: userId } })
            .select("name email avatar")
            .limit(50);

        res.json(users);
    } catch (error) {
        res.status(500);
        next(error);
    }
}

export async function updatePushToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { expoPushToken } = req.body;

        if (!expoPushToken) {
            res.status(400).json({ error: "expoPushToken is required" });
            return;
        }

        if (!Expo.isExpoPushToken(expoPushToken)) {
            res.status(400).json({ error: "Invalid Expo push token format" });
            return;
        }

        await User.findByIdAndUpdate(userId, { expoPushToken });

        res.json({ success: true, message: "Push token updated" });
    } catch (error) {
        res.status(500);
        next(error);
    }
}