"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../authenticate");
const router = express_1.default.Router();
exports.userRouter = router;
router.post("/register", userController_1.userRegister);
router.post("/login", userController_1.userLogin);
router.get("/:id", authenticate_1.authenticate, userController_1.getUser);
