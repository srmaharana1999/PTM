import { Request, Response, NextFunction } from "express";

// Password validation rules
export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null; // Valid password
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize string input (trim and remove dangerous characters)
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

// Middleware to validate registration input
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  }

  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.email = sanitizeString(email.toLowerCase());

  // Validate email format
  if (!validateEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Validate name length
  if (req.body.name.length < 2 || req.body.name.length > 50) {
    return res
      .status(400)
      .json({ message: "Name must be between 2 and 50 characters." });
  }

  // Validate password strength
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  next();
};

// Middleware to validate login input
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Sanitize email
  req.body.email = sanitizeString(email.toLowerCase());

  // Validate email format
  if (!validateEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  next();
};
