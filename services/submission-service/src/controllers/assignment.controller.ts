import { Request, Response } from 'express';
import { classServiceClient, getSubject } from '../utils/service-client';
import { EnrichedAssignment } from '../types';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, subjectId } = req.body;
    const teacherId = req.user!.id;

    const subject = await getSubject(subjectId, req.headers.authorization!);

    if (!subject || !subject.teacherIds.includes(teacherId)) {
      res.status(403).json({ error: 'Not authorized for this subject' })

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
    console.error('Assignment creation error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const getAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' })

      return;
    }

    const subject = await getSubject(assignment.subjectId, req.headers.authorization!);
    const enrichedAssignment: EnrichedAssignment = {
      ...assignment,
      subject
    };

    res.json(enrichedAssignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
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
