import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = req;
        if (!userId) return res.status(401).json({ message: "Unauthorized - Invalid token" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);

        if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

        let user = await User.findOne({ clerkId });

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkId);

            const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
            if (!primaryEmail) {
                res.status(400);
                return next(new Error("User email not available from Clerk"));
            }

            user = await User.create({
                clerkId,
                name: clerkUser.firstName
                    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
                    : primaryEmail.split("@")[0],
                email: primaryEmail,
                avatar: clerkUser.imageUrl,
            });
        }

        return res.json(user);
    } catch (error) {
        next(error);
    }
}