import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";

export const createSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, teacherIds } = req.body;
    if (!name || !Array.isArray(teacherIds)) {
      res.status(400).json({ error: "name and teacherIds (as an array) are required" });

      return;
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        teacherIds,
      },
    });

    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

export const getSubjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subjects = await prisma.subject.findMany({
      include: { classes: true },
    });

    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { classes: true },
    });

    if (!subject) {
      res.status(404).json({ error: "subject not found" });

      return;
    }

    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, teacherIds } = req.body;

    const existingSubject = await prisma.subject.findUnique({ where: { id } });
    if (!existingSubject) {
      res.status(404).json({ error: "subject not found" });

      return;
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: { name, teacherIds },
    });

    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existingSubject = await prisma.subject.findUnique({ where: { id } });
    if (!existingSubject) {
      res.status(404).json({ error: "subject not found" });

      return;
    }

    const subject = await prisma.subject.delete({
      where: { id },
    });

    res.json(subject);
  } catch (error) {
    next(error);
  }
};
