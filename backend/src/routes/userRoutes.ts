import { Router } from "express";
import { protectedRoute } from "../middleware/auth";
import { getUsers, updatePushToken } from "../controllers/userController";

const router = Router();

router.get("/", protectedRoute, getUsers);
router.post("/push-token", protectedRoute, updatePushToken);

export default router;