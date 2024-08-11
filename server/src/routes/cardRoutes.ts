import express from "express"
const router = express.Router();
import { getCards, createCard, updateCard, deleteCard } from "../controllers/cardsController"
import { authenticate } from "../authenticate";

router.get("/", getCards);
router.post("/", authenticate, createCard);
router.patch("/:id", authenticate, updateCard);
router.delete("/:id", authenticate, deleteCard)


export { router as cardRouter }
