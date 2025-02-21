import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../utils/prisma";
import path from "path";
import fs from "fs";

export const createSubmission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { assignmentId } = req.body;

    const studentId = (req as any).user.id;
    if (!(req as any).file) {
      res.status(400).json({ error: "File is required" })

      return;
    }

    const filePath = (req as any).file.path;
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        filePath,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submissionId = req.params.id;
    const { grade, comment } = req.body;

    const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
    if (!submission) {
      res.status(404).json({ error: "Submission not found" });

      return;
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedbackComment: comment,
      },
    });

    res.json(updatedSubmission);
  } catch (error) {
    next(error);
  }
};

export const getSubmission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissionId = req.params.id;
    const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
    if (!submission) {
      res.status(404).json({ error: "Submission not found" });

      return;
    }
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params[0]);
    const filePath = path.join(process.env.STORAGE_ROOT!, req.params[0]);
    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "file not found" });

      return;
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

export const getMySubmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId: req.user!.id },
      include: { assignment: true },
      orderBy: { createdAt: "desc" }
    });

    const enriched = submissions.map(sub => ({
      id: sub.id,
      assignmentTitle: sub.assignment.title,
      dueDate: sub.assignment.dueDate,
      submittedAt: sub.createdAt,
      grade: sub.grade,
      status: sub.grade ? "graded" : "pending",
      downloadUrl: `/api/submissions/${sub.id}/file` // ADD HERE
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
}

export const getAssignmentSubmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        assignment: {
          select: { title: true, dueDate: true }
        }
      }
    });

    res.json(submissions.map(sub => ({
      id: sub.id,
      studentId: sub.studentId,
      submittedAt: sub.createdAt,
      grade: sub.grade,
      assignmentTitle: sub.assignment.title,
      dueDate: sub.assignment.dueDate,
      status: sub.grade ? "graded" : "pending",
      downloadUrl: `/api/submissions/${sub.id}/file` // ADD HERE
    })));
  } catch (error) {
    next(error);
  }
};

export const getAllSubmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subjectId, assignmentId, studentId, graded } = req.query;

    const where: any = {};
    if (subjectId) where.assignment = { subjectId };
    if (assignmentId) where.assignmentId = assignmentId;
    if (studentId) where.studentId = studentId;
    if (graded) where.grade = graded === "true" ? { not: null } : null;

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: { select: { title: true, subjectId: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(submissions.map(sub => ({
      id: sub.id,
      studentId: sub.studentId,
      assignment: sub.assignment.title,
      subjectId: sub.assignment.subjectId,
      submittedAt: sub.createdAt,
      grade: sub.grade,
      status: sub.grade ? "graded" : "pending",
      downloadUrl: `/api/submissions/${sub.id}/file`
    })));
  } catch (error) {
    next(error);
  }
};
