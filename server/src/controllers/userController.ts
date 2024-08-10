import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const userLogin = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "success"
  })
}

export const getAllUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "success"
  })
}

export const getUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "success"
  })
}
