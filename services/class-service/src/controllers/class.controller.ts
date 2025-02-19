import type { Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createClass = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, subjectIds, studentIds } = req.body;

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

export const getClasses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      include: { subjects: true },
    });

    res.json(classes);
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundClass = await prisma.class.findUnique({
      where: { id },
      include: { subjects: true },
    });

    if (!foundClass) {
      res.status(404).json({ error: "class not found" });

      return;
    }

    res.json(foundClass);
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, subjectIds, studentIds } = req.body;

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      res.status(404).json({ error: "class not found" });

      return;
    }

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

    res.json({ message: "class updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      res.status(404).json({ error: "class not found" });

      return;
    }

    await prisma.class.delete({
      where: { id },
    });

    res.json({ message: "class deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getClassSubjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const classData = await prisma.class.findUnique({
      where: { id },
      include: { subjects: true }
    });

    if (!classData) {
      res.status(404).json({ error: "class not found" });

      return;
    }

    res.json(classData.subjects);
  } catch (error) {
    next(error);
  }
};
