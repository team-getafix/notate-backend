import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "admins only" });

    return;
  }

  next();
};

export const requireTeacherForSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const subjectId = req.params.id;
  if (!subjectId) {
    res.status(400).json({ error: "subject ID is required" });

    return;
  }

  try {
    const { default: prisma } = await import("../utils/prisma");
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      res.status(404).json({ error: "subject not found" });

      return;
    }

    if (!req.user || !subject.teacherIds.includes(req.user.id)) {
      res.status(403).json({ error: "you are not assigned to this subject" });

      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
