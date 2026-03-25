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

// Trust the first proxy in the chain (required for Railway / any reverse proxy)
// This allows express-rate-limit to correctly read the real client IP from X-Forwarded-For
app.set("trust proxy", 1);

// CORS configuration from environment — must be BEFORE helmet and all other middleware
console.log("ALLOWED_ORIGINS:", process.env.ALLOWED_ORIGINS);
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Handle preflight OPTIONS requests for ALL routes
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

// Security headers (after CORS so it doesn't override CORS headers)
app.use(helmet());

// =====Middleware====
app.use(express.json());
app.use(cookieParser());

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
app.use("/api/membership", projectMemberRoutes);

// 404 — must come AFTER all route registrations
app.use(notFoundHandler);

// Global error handler — must be the LAST middleware (4-param signature)
app.use(globalErrorHandler);

export default app;
