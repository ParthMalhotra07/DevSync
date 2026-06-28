import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  updateTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../config/cloudinary.js";
import Task from "../models/Task.js";

const router = express.Router();

router.route("/").post(protect, createTask);
router.route("/project/:projectId").get(protect, getTasksByProject);
router.route("/:id").put(protect, updateTask);
router.route("/:id/status").put(protect, updateTaskStatus);

router.post("/:id/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.attachments.push(req.file.path);
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
