"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.cardRouter = router;
const cardsController_1 = require("../controllers/cardsController");
const authenticate_1 = require("../authenticate");
router.get("/", authenticate_1.authenticate, cardsController_1.getCards);
router.post("/", authenticate_1.authenticate, cardsController_1.createCard);
router.patch("/:id", authenticate_1.authenticate, cardsController_1.updateCard);
router.delete("/:id", authenticate_1.authenticate, cardsController_1.deleteCard);
