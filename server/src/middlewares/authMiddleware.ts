import { Response, NextFunction } from "express";
import { AuthRequest } from "../lib/types";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  req.user = {
    userId: payload.userId,
    email: payload.email,
  };
  next();
};
