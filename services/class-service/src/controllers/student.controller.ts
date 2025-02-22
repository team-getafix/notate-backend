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

import { authServiceClient } from "../utils/service-client";

export const getUnassignedStudents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data: students } = await authServiceClient.get("/auth/users", {
      params: { role: "student" },
      headers: { Authorization: req.headers.authorization! }
    });

    const classes = await prisma.class.findMany({ select: { studentIds: true } });
    const assignedStudentIds = new Set(classes.flatMap(c => c.studentIds));

    const unassigned = students
      .filter((s: any) => !assignedStudentIds.has(s.id))
      .sort((a: any, b: any) => {
        const lastCompare = a.lastName.localeCompare(b.lastName);

        return lastCompare !== 0 ? lastCompare : a.firstName.localeCompare(b.firstName);
      });

    res.json(unassigned);
  } catch (error) {
    next(error);
  }
};
