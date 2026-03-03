import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTasks,
} from "../controllers/taskController";

const router = Router();

// Create Task
router.post("/create", requireAuth, createTask);

// fetch Task
router.get("/",requireAuth, getTasks);

// update Task
router.put("/:id", requireAuth, updateTask);

// bulk update Tasks
router.patch("/bulk", requireAuth, updateTasks);

// delete Task
router.delete("/:id", requireAuth, deleteTask);

export default router;
