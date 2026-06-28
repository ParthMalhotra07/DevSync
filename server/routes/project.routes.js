import express from "express";
import {
  createProject,
  getProjectsByTeam,
  getProjectById,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createProject);
router.route("/team/:teamId").get(protect, getProjectsByTeam);
router.route("/:id").get(protect, getProjectById);

export default router;
