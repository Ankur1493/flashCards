import { Request, Response } from "express";
import { PrismaClient, ROLES } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.AUTH_SECRET as string;

const createToken = (id: string): string => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "10d" });
};

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = createToken(user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: "success",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred, please try again",
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred, please try again",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    const activeUser = req.user
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });
    if (activeUser?.role === ROLES.GUEST && activeUser.id !== user?.id) {
      return res.status(401).json({
        message: "guests are not authorized to check other user details"
      })
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred, please try again",
    });
  }
};
