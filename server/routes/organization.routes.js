import express from "express";
import {
  getOrganizations,
  createOrganization,
  getOrganizationById,
} from "../controllers/organization.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getOrganizations)
  .post(protect, createOrganization);
router.route("/:id").get(protect, getOrganizationById);

export default router;
