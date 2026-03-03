import { Request, Response, NextFunction } from "express";

// ─── Custom Application Error ────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace (V8 only)
    Error.captureStackTrace(this, this.constructor);
    // Ensure instanceof checks work correctly after transpilation
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ─── 404 Not Found Handler ───────────────────────────────────────────────────
// Mount this AFTER all routes to catch unregistered paths

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// ─── Global Error Handler ────────────────────────────────────────────────────
// Must be declared with 4 parameters so Express recognizes it as an error handler

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Determine status code and operational flag
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Always log the full error on the server, only expose message to client in dev
  const isDev = process.env.NODE_ENV === "development";

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} — ${statusCode}: ${err.message}`);

  if (!isOperational) {
    // Programming / unexpected error — log full stack
    console.error(err.stack);
  }

  // Build the response payload
  const payload: Record<string, unknown> = {
    success: false,
    message: err.message || "Internal server error",
  };

  // Expose stack trace only in development
  if (isDev && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
