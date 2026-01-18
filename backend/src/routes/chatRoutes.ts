import { Router } from "express";
import { protectedRoute } from "../middleware/auth";
import { getChats, getOrCreateChat, markChatAsRead } from "../controllers/chatController";

const router = Router();

router.use(protectedRoute);
router.get("/", getChats);
router.post("/with/:participantId", getOrCreateChat);
router.post("/:chatId/read", markChatAsRead);

export default router;