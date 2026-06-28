import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// In a stateless JWT setup, logout can just be handled on frontend by removing token
router.post("/logout", (req, res) =>
  res.json({ message: "Logged out successfully" }),
);
router.get("/me", protect, getMe);

export default router;
