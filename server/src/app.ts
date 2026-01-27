import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "./models/session.model";
import "./models/user.model";
import authRoutes from "./routes/authRoutes";

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

export default app;
