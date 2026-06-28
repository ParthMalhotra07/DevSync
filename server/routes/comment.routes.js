import express from "express";
import {
  getCommentsByTask,
  addComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, getCommentsByTask).post(protect, addComment);

export default router;
