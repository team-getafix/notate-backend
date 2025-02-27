import type { Response, NextFunction } from "express";
import { getSubject } from "../utils/service-client";
import { AuthRequest } from "./auth.middleware";
import prisma from "../utils/prisma";

export const assignmentAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignmentId = req.params.assignmentId || req.params.id;
    const user = req.user!;

    if (user.role === "admin") return next();

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { teacherId: true, subjectId: true }
    });

    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });

      return;
    }

    if (user.role === "teacher") {
      if (assignment.teacherId !== user.id) {
        res.status(403).json({ error: "Not your assignment" })

        return;
      }

      const subject = await getSubject(assignment.subjectId, req.headers.authorization!);
      if (!subject?.teacherIds.includes(user.id)) {
        res.status(403).json({ error: "No longer assigned to this subject" })

        return;
      }
    }

    next();
  } catch (error) {
    console.error("Assignment access check failed:", error);
    res.status(500).json({ error: "Failed to verify assignment access" });
  }
};

export const submissionAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const submissionId = req.params.submissionId || req.params.id;
    const user = req.user!;

    if (user.role === "admin") return next();

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true }
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    if (user.role === "student") {
      if (submission.studentId !== user.id) {
        return res.status(403).json({ error: "Not your submission" });
      }

      return next();
    }

    if (user.role === "teacher") {
      const assignment = await prisma.assignment.findUnique({
        where: { id: submission.assignmentId },
        select: { teacherId: true }
      });

      if (!assignment || assignment.teacherId !== user.id) {
        return res.status(403).json({ error: "Not your student\'s submission" });
      }

      const subject = await getSubject(submission.assignment.subjectId, req.headers.authorization!);
      if (!subject?.teacherIds.includes(user.id)) {
        return res.status(403).json({ error: "No longer assigned to this subject" });
      }
    }

    next();
  } catch (error) {
    console.error("Submission access check failed:", error);
    res.status(500).json({ error: "Failed to verify submission access" });
  }
};

export const fileAccessValidator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filePath = decodeURIComponent(req.params[0]);
    const user = req.user!;

    if (user.role === "admin") return next();

    const submission = await prisma.submission.findFirst({
      where: {
        OR: [
          { filePath: filePath },
          { feedbackPath: filePath }
        ]
      },
      include: { assignment: true }
    });

    if (!submission) {
      return res.status(404).json({ error: "File not found" });
    }

    if (user.role === "student") {
      if (submission.studentId !== user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      return next();
    }

    if (user.role === "teacher") {
      const assignment = await prisma.assignment.findUnique({
        where: { id: submission.assignmentId },
        select: { teacherId: true }
      });

      if (!assignment || assignment.teacherId !== user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      const subject = await getSubject(submission.assignment.subjectId, req.headers.authorization!);
      if (!subject?.teacherIds.includes(user.id)) {
        return res.status(403).json({ error: "No longer assigned to this subject" });
      }
    }

    next();
  } catch (error) {
    console.error("File access check failed:", error);
    res.status(500).json({ error: "Failed to verify file access" });
  }
};
