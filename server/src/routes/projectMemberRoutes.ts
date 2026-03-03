import { Router } from "express";
import {
  createMember,
  deleteMembers,
  getProjectMembers,
  updateMemberRole,
} from "../controllers/projectMemberController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

// Add members to a project
router.post("/", requireAuth, createMember);

// Get all members of a project
router.get("/project/:projectId", requireAuth, getProjectMembers);

// Update a member's role
router.patch(
  "/project/:projectId/member/:memberId",
  requireAuth,
  updateMemberRole,
);

// Remove members from a project
router.delete("/project/:projectId", requireAuth, deleteMembers);

export default router;
