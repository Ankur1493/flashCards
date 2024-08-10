import jwt from "jsonwebtoken";
import { PrismaClient, Flashcards, ROLES } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

interface JwtPayload {
  _id: string;
}

interface IUser {
  id: string;
  email: string;
  role: ROLES;
  flashcards: Flashcards[];
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined = req.cookies?.jwt;

  if (!token) {
    return res.status(400).json({
      error: "no token",
      message: "Token not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded._id },
      select: {
        id: true,
        email: true,
        role: true,
        flashcards: true,
      },
    });

    if (!user) {
      return res.status(403).json({
        status: "failed",
        message: "User not authenticated",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(401).json({
      error: "not authorized",
      message: "Session expired. Please log in again.",
    });
  }
};

