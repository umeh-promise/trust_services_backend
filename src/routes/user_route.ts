import express from "express";
import { protect, restrictTo } from "../controller/auth_controller";
import { getAllUsers, getUser } from "../controller/user_controller";

const router = express.Router();

router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get("/:id", protect, restrictTo("admin"), getUser);

export default router;
