import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { classServiceClient } from "../utils/service-client";

const secretKey = process.env.JWT_SECRET || "devsecret";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "no token provided" });

    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey) as { id: string; role: string };
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
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

export const requireSubjectTeacher = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const subjectId = req.params.subjectId || req.body.subjectId;

  if (req.user?.role !== "teacher") {
    return res.status(403).json({ error: "teacher access required" });
  }

  try {
    const { data: subject } = await classServiceClient.get(`/subjects/${subjectId}`, {
      headers: { Authorization: req.headers.authorization! }
    });

    if (!subject.teacherIds.includes(req.user.id)) {
      return res.status(403).json({ error: "not assigned to this subject" });
    }

    next();
  } catch (error) {
    console.error("subject verification failed:", error);
    res.status(502).json({ error: "failed to verify subject access" });
  }
};

export const requireAdmin = requireRoles(["admin"]);
export const requireTeacher = requireRoles(["teacher"]);
export const requireStudent = requireRoles(["student"]);
export const requireTeacherAdmin = requireRoles(["admin", "teacher"]);
