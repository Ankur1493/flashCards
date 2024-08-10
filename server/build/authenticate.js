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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    if (!token) {
        return res.status(400).json({
            error: "no token",
            message: "Token not provided",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        const user = yield prisma.user.findUnique({
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
    }
    catch (err) {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(401).json({
            error: "not authorized",
            message: "Session expired. Please log in again.",
        });
    }
});
exports.authenticate = authenticate;
