import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "./models/session.model";
import "./models/user.model";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import projectRoutes from "./routes/projectRoutes";
import projectMemberRoutes from "./routes/projectMemberRoutes";
import sprintRoutes from "./routes/sprintRoutes";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/errorHandler";

const app = express();

// Trust the first proxy (Railway/Vercel) to correctly read client IP
app.set("trust proxy", 1);

// CORS origins
const rawOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
      "https://ptm-nine.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ];

const corsOptions: cors.CorsOptions = {
  origin: rawOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

// Apply CORS to all routes (also handles OPTIONS preflight automatically)
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
// Sprint routes
app.use("/api/sprint", sprintRoutes);


// 404 — must come AFTER all route registrations
app.use(notFoundHandler);

// Global error handler — must be the LAST middleware (4-param signature)
app.use(globalErrorHandler);

export default app;
