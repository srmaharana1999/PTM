import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  createSprint,
  getProjectSprints,
  getActiveSprint,
  startSprint,
  completeSprint,
  addTasksToSprint,
  removeTasksFromSprint,
  deleteSprint,
} from "../controllers/sprintController";

const router = Router();

// Create sprint
router.post("/", requireAuth, createSprint);

// Get all sprints for a project
router.get("/:id", requireAuth, getProjectSprints);

// Get the active sprint for a project
router.get("/:id/active", requireAuth, getActiveSprint);

// Start a sprint (sets status → ACTIVE)
router.patch("/:id/start", requireAuth, startSprint);

// Complete a sprint (sets status → COMPLETED)
router.patch("/:id/complete", requireAuth, completeSprint);

// Add tasks to a sprint
router.patch("/:id/tasks", requireAuth, addTasksToSprint);

// Remove tasks from a sprint
router.delete("/:id/tasks", requireAuth, removeTasksFromSprint);

// Delete a sprint
router.delete("/:id", requireAuth, deleteSprint);

export default router;
