import type { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../utils/prisma";

export const createClass = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, subjectIds, studentIds } = req.body;

    const existingSubjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true },
    });

    const validSubjectIds = existingSubjects.map(subject => subject.id);

    if (validSubjectIds.length !== subjectIds.length) {
      res.status(400).json({ error: "one or more subjects do not exist" });

      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        studentIds: studentIds || [],
        subjects: { connect: validSubjectIds.map(id => ({ id })) },
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
    let classes;

    if (req.user?.role === "admin") {
      classes = await prisma.class.findMany({
        include: { subjects: true },
      });
    } else if (req.user?.role === "teacher") {
      classes = await prisma.class.findMany({
        include: { subjects: true },
        where: {
          subjects: {
            some: {
              teacherIds: {
                has: req.user.id,
              },
            },
          },
        },
      });
    } else {
      res.status(401).json({ error: "not enough permissions" });
    }

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

export const addSubjectToClass = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { subjectId } = req.body;

    const existingClass = await prisma.class.findUnique({ where: { id: classId } });
    if (!existingClass) {
      res.status(404).json({ error: "class not found" });

      return;
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        subjects: {
          connect: { id: subjectId },
        },
      },
      include: { subjects: true },
    });

    res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
};

export const addStudentToClass = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { studentId } = req.body;

    const existingClass = await prisma.class.findUnique({ where: { id: classId } });
    if (!existingClass) {
      res.status(404).json({ error: "class not found" });

      return;
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        studentIds: {
          push: studentId,
        },
      },
      include: { subjects: true },
    });

    res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
}
