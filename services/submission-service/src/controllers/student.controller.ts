import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { classServiceClient } from "../utils/service-client";
import prisma from "../utils/prisma";

export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user!.id;

    const { data: subjects } = await classServiceClient.get(`/student/${studentId}/subjects`, {
      headers: { Authorization: req.headers.authorization! }
    });

    const subjectIds = subjects.map((subject: any) => subject.id);

    const assignments = await prisma.assignment.findMany({
      where: {
        subjectId: { in: subjectIds }
      },
      include: {
        submissions: {
          where: { studentId },
          select: { id: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    const formatted = assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      dueDate: assignment.dueDate.toISOString(),
      subjectId: assignment.subjectId,
      status: assignment.submissions.length > 0 ? 'submitted' : 'pending',
      submissionsCount: assignment.submissions.length
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching assignments:', error);

    res.status(500).json({
      error: error.response?.data?.error || 'Failed to fetch assignments'
    });
  }
};
