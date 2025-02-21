import type { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/jwt.middleware";
import { RegisterUserDto, LoginUserDto } from "../dtos/user.dto";
import { generateTempPassword, sendWelcomeEmail } from "../utils/email";
import bcrypt from "@node-rs/bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

const SECRET_KEY = process.env.JWT_SECRET || "development";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, firstName, middleName, lastName, role } =
      req.body as RegisterUserDto;

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res
        .status(409)
        .json({ error: "a user with this email already exists" });

      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        middleName: middleName || null,
        lastName,
        role,
      },
    });

    await sendWelcomeEmail(email, tempPassword);

    res
      .status(201)
      .json({ message: "user created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginUserDto;
    if (!email || !password) {
      res
        .status(400)
        .json({ error: "email and password are required" });

      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "invalid credentials" });

      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "no user information found" });

      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ error: "user not found" });

      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
