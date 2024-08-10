import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ROLES } from "@prisma/client";
const prisma = new PrismaClient();

export const getCards = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const user = req.user

    if (!user) {
      res.status(401).json({
        message: "not authenticated"
      })
    }

    const flashcards = await prisma.flashcards.findMany({
      skip: offset,
      take: limit,
    });

    if (!flashcards) {
      res.status(404).json({
        message: "Flashcards not found"
      })
    }

    res.status(200).json({
      data: flashcards,
      message: "Success"
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Try again, we had a problem"
    })
  }
}

export const createCard = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const user = req.user as { id: string; role: ROLES };
    if (!user || !user.id) {
      res.status(401).json({
        message: "not authenticated"
      })
    }
    if (user?.role === "GUEST") {
      res.status(401).json({
        message: "Guests are not allowed to create a new card"
      })
    }
    if (!question || !answer) {
      res.status(401).json({
        message: "Try again, we had a problem"
      })
    }

    const card = await prisma.flashcards.create({
      data: {
        question,
        answer,
        userId: user.id
      },
    });

    if (!card) {
      res.status(404).json({
        message: "Flashcard not created, try again"
      })
    }
    res.status(200).json({
      message: "Success",
      card
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Try again, we had a problem"
    })
  }
}


export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const user = req.user as { id: string; role: ROLES };

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (user.role === ROLES.GUEST) {
      return res.status(403).json({
        message: "You are not authorized to delete this card",
      });
    }

    const existingCard = await prisma.flashcards.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }

    const updatedCard = await prisma.flashcards.update({
      where: { id },
      data: { question, answer },
    });

    res.status(200).json({
      message: "Flashcard updated successfully",
      card: updatedCard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while updating the flashcard",
    });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as { id: string; role: ROLES };

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (user.role === ROLES.GUEST) {
      return res.status(403).json({
        message: "You are not authorized to delete this card",
      });
    }

    const existingCard = await prisma.flashcards.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return res.status(404).json({
        message: "Flashcard not found",
      });
    }
    await prisma.flashcards.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Flashcard deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while deleting the flashcard",
    });
  }
};
