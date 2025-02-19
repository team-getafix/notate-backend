import type { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const createClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, subjectIds, studentIds } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });

      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        studentIds: studentIds || [],
        subjects: subjectIds && Array.isArray(subjectIds) && subjectIds.length > 0
          ? { connect: subjectIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { subjects: true },
    });

    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
};

export const getClasses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      include: { subjects: true },
    });

    res.json(classes);
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundClass = await prisma.class.findUnique({
      where: { id },
      include: { subjects: true },
    });

    if (!foundClass) {
      res.status(404).json({ error: 'Class not found' });

      return;
    }

    res.json(foundClass);
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, subjectIds, studentIds } = req.body;
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        studentIds,
        subjects: subjectIds && Array.isArray(subjectIds)
          ? { set: subjectIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { subjects: true },
    });

    res.json(updatedClass);
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedClass = await prisma.class.delete({
      where: { id },
    });

    res.json(deletedClass);
  } catch (error) {
    next(error);
  }
};
