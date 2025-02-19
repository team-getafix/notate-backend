import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "devsecret";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const extractUserFromToken = (req: Request): { id: string; role: string } | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, secretKey) as { id: string; role: string };
  } catch {
    return null;
  }
};

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const user = extractUserFromToken(req);

  if (!user) {
    res.status(401).json({ error: "invalid or missing token" });
    return;
  }

  req.user = user;
  next();
};

export const requireRoles = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      res.status(403).json({ error: "access denied" });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRoles(["admin"]);
export const requireTeacher = requireRoles(["teacher"]);
export const requireStudent = requireRoles(["student"]);
