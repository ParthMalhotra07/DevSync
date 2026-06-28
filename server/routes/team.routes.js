import express from "express";
import { createTeam, getTeamsByOrg } from "../controllers/team.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createTeam);
router.route("/:orgId").get(protect, getTeamsByOrg);

export default router;
