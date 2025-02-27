import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { classServiceClient } from "../utils/service-client";
import prisma from "../utils/prisma";

export const getStudentAssignments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const authHeader = req.headers.authorization!;

    const { data: subjects } = await classServiceClient.get(
      `/student/${studentId}/subjects`,
      { headers: { Authorization: authHeader } }
    );

    const subjectIds = subjects.map((subject: { id: string }) => subject.id);

    const assignments = await prisma.assignment.findMany({
      where: {
        subjectId: { in: subjectIds },
      },
      include: {
        submissions: {
          where: { studentId },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
};
