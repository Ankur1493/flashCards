"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.updateCard = exports.createCard = exports.getCards = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const user = req.user;
        if (!user) {
            res.status(401).json({
                message: "not authenticated"
            });
        }
        const flashcards = yield prisma.flashcards.findMany({
            skip: offset,
            take: limit,
        });
        if (!flashcards) {
            res.status(404).json({
                message: "Flashcards not found"
            });
        }
        res.status(200).json({
            data: flashcards,
            message: "Success"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Try again, we had a problem"
        });
    }
});
exports.getCards = getCards;
const createCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer } = req.body;
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({
                message: "not authenticated"
            });
        }
        if ((user === null || user === void 0 ? void 0 : user.role) === "GUEST") {
            res.status(401).json({
                message: "Guests are not allowed to create a new card"
            });
        }
        if (!question || !answer) {
            res.status(401).json({
                message: "Try again, we had a problem"
            });
        }
        const card = yield prisma.flashcards.create({
            data: {
                question,
                answer,
                userId: user.id
            },
        });
        if (!card) {
            res.status(404).json({
                message: "Flashcard not created, try again"
            });
        }
        res.status(200).json({
            message: "Success",
            card
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Try again, we had a problem"
        });
    }
});
exports.createCard = createCard;
const updateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        if (user.role === client_2.ROLES.GUEST) {
            return res.status(403).json({
                message: "You are not authorized to delete this card",
            });
        }
        const existingCard = yield prisma.flashcards.findUnique({
            where: { id },
        });
        if (!existingCard) {
            return res.status(404).json({
                message: "Flashcard not found",
            });
        }
        const updatedCard = yield prisma.flashcards.update({
            where: { id },
            data: { question, answer },
        });
        res.status(200).json({
            message: "Flashcard updated successfully",
            card: updatedCard,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred while updating the flashcard",
        });
    }
});
exports.updateCard = updateCard;
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        if (user.role === client_2.ROLES.GUEST) {
            return res.status(403).json({
                message: "You are not authorized to delete this card",
            });
        }
        const existingCard = yield prisma.flashcards.findUnique({
            where: { id },
        });
        if (!existingCard) {
            return res.status(404).json({
                message: "Flashcard not found",
            });
        }
        yield prisma.flashcards.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Flashcard deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred while deleting the flashcard",
        });
    }
});
exports.deleteCard = deleteCard;
