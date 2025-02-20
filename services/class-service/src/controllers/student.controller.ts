import type { Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { type AuthRequest } from "../middlewares/auth.middleware";

export const getStudentSubjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const classes = await prisma.class.findMany({
      where: { studentIds: { has: id } },
      include: { subjects: true }
    });

    const subjectsMap = new Map<string, typeof classes[0]["subjects"][0]>();
    classes.forEach(cls => {
      cls.subjects.forEach(subject => {
        subjectsMap.set(subject.id, subject);
      });
    });

    res.json(Array.from(subjectsMap.values()));
  } catch (error) {
    next(error);
  }
}

export const getMyClasses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const classes = await prisma.class.findMany({
      where: { studentIds: { has: req.user!.id } },
      select: {
        id: true,
        name: true,
        subjects: { select: { id: true, name: true } }
      }
    });

    res.json(classes);
  } catch (error) {
    next(error);
  }
};
