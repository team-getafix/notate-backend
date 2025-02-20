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

    // Teacher validation
    if (user.role === "teacher") {
      if (assignment.teacherId !== user.id) {
        res.status(403).json({ error: "Not your assignment" })

        return;
      }

      // Verify subject assignment
      const subject = await getSubject(assignment.subjectId, req.headers.authorization!);
      if (!subject?.teacherIds.includes(user.id)) {
        res.status(403).json({ error: "No longer assigned to this subject" })

        return;
      }
    }

    // Student can only view (handled in controller)
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

    // Admin bypass
    if (user.role === "admin") return next();

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true }
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Student access
    if (user.role === "student") {
      if (submission.studentId !== user.id) {
        return res.status(403).json({ error: "Not your submission" });
      }
      return next();
    }

    // Teacher access
    if (user.role === "teacher") {
      // Verify assignment ownership
      const assignment = await prisma.assignment.findUnique({
        where: { id: submission.assignmentId },
        select: { teacherId: true }
      });

      if (!assignment || assignment.teacherId !== user.id) {
        return res.status(403).json({ error: "Not your student\'s submission" });
      }

      // Verify current subject assignment
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

export const fileOwnerAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filePath = req.params[0];
    const user = req.user!;

    // Admin bypass
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
      res.status(404).json({ error: "File not found" });

      return;
    }

    if (user.role === "student") {
      if (submission.studentId !== user.id) {
        res.status(403).json({ error: "Not your file" })

        return;
      }

      next();
    }

    if (user.role === "teacher") {
      if (submission.assignment.teacherId !== user.id) {
        res.status(403).json({ error: "Not your student\'s file" })

        return;
      }

      const subject = await getSubject(submission.assignment.subjectId, req.headers.authorization!);
      if (!subject?.teacherIds.includes(user.id)) {
        res.status(403).json({ error: "No longer assigned to this subject" });

        return;
      }
    }

    next();
  } catch (error) {
    console.error("File access check failed:", error);
    res.status(500).json({ error: "Failed to verify file access" });
  }
};
