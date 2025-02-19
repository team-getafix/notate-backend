import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";

export const getStudentSubjects = async (req: Request, res: Response, next: NextFunction) => {
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
