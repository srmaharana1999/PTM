import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "./models/session.model";
import "./models/user.model";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import projectRoutes from "./routes/projectRoutes";
import projectMemberRoutes from "./routes/projectMemberRoutes";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// =====Middleware====
app.use(express.json());
app.use(cookieParser());

// CORS configuration from environment
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running." });
});

// Auth routes
app.use("/api/auth", authRoutes);
// Task routes
app.use("/api/tasks", taskRoutes);
// Project routes
app.use("/api/projects", projectRoutes);
// Project Member router
app.use("/api/project-member", projectMemberRoutes);

// 404 — must come AFTER all route registrations
app.use(notFoundHandler);

// Global error handler — must be the LAST middleware (4-param signature)
app.use(globalErrorHandler);

export default app;
