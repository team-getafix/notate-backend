import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../utils/prisma";

export const getStudentAssignments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = (req as any).user.id;
    const assignments = await prisma.assignment.findMany({
      include: {
        submissions: {
          where: { studentId }
        }
      },
      orderBy: { dueDate: 'asc' },
    });
    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
};
