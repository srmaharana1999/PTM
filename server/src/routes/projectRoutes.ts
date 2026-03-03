import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  createProject,
  deleteProjectById,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController";

const router = Router();

// Create Project
router.post("/create", requireAuth, createProject);

// Fetch Project
router.get("/", requireAuth, getProjects);

// get Project by id
router.get("/:id", requireAuth, getProjectById);

// delete Project
router.delete("/:id", requireAuth, deleteProjectById);

// project Update
router.patch("/:pid", requireAuth, updateProject);

export default router;
