import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

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
