import express from "express";
import { login, protect, register } from "../controller/auth_controller";
import { getMe, getUser, updateMe } from "../controller/user_controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/update-me", protect, updateMe);
router.get("/me", protect, getMe, getUser);

export default router;
