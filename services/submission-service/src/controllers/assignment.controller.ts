import type { NextFunction, Request, Response } from "express";
import { classServiceClient, getSubject, validateSubjectExists } from "../utils/service-client";
import { EnrichedAssignment, EnrichedSubmission, Submission } from "../types";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../utils/prisma";

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, subjectId } = req.body;
    const teacherId = req.user!.id;

    const subjectExists = await validateSubjectExists(subjectId, req.headers.authorization!);
    if (!subjectExists) {
      res.status(400).json({ error: "invalid subject ID" });

      return;
    }

    const subject = await getSubject(subjectId, req.headers.authorization!);

    if (!subject || !subject.teacherIds.includes(teacherId)) {
      res.status(403).json({ error: "not authorized for this subject" })

      return;
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        subjectId,
        teacherId
      }
    });

    const enrichedAssignment: EnrichedAssignment = {
      ...assignment,
      subject
    };

    res.status(201).json(enrichedAssignment);
  } catch (error) {
    console.error("Assignment creation error:", error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

export const getAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" })

      return;
    }

    const subject = await getSubject(assignment.subjectId, req.headers.authorization!);
    const enrichedAssignment: EnrichedAssignment = {
      ...assignment,
      subject
    };

    res.json(enrichedAssignment);
  } catch (error) {
    console.error("Get assignment error:", error);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};

export const getAssignmentsBySubject = async (
  req: AuthRequest,
  res: Response
) => {
  const { subjectId } = req.params;

  const subject = await classServiceClient.get(`/subjects/${subjectId}`, {
    headers: { Authorization: req.headers.authorization! }
  });

  const assignments = await prisma.assignment.findMany({
    where: { subjectId }
  });

  res.json(assignments);
};

export const updateAssignment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user!;

    let updatePayload = updateData;

    if (user.role === "teacher") {
      const { subjectId, ...teacherUpdateData } = updateData;
      updatePayload = teacherUpdateData;

      if (subjectId) {
        res.status(403).json({ error: "teachers cannot change subject" })

        return;
      }
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: updatePayload
    });

    res.json(updatedAssignment);
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.assignment.delete({
      where: { id }
    });

    res.json({ message: "assignment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyAssignments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { teacherId: req.user!.id },
      include: { submissions: { select: { id: true } } },
      orderBy: { dueDate: "asc" }
    });

    res.json(assignments.map(a => ({
      id: a.id,
      title: a.title,
      dueDate: a.dueDate,
      submissionsCount: a.submissions.length,
      ungradedCount: a.submissions.filter(s => !(s as Submission).grade).length
    })));
  } catch (error) {
    next(error);
  }
};

// idk where else to put this so lets just hide it here
setInterval(async () => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        submissions: { none: {} },
        createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 days old
      }
    });

    await prisma.assignment.deleteMany({
      where: { id: { in: assignments.map(a => a.id) } }
    });
  } catch (error) {
    console.error("orphan cleanup failed:", error);
  }
}, 1 * 60 * 60 * 1000); // hourly cleanup
