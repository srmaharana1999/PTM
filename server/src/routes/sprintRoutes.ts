import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createSprint, getSprints } from "../controllers/sprintController";

const router = Router();

// create Sprint
router.post("/", requireAuth, createSprint);

// get Sprints per Projects
router.get("/:id", requireAuth, getSprints);

export default router;
