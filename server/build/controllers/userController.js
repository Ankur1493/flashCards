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
exports.getUser = exports.userLogin = exports.userRegister = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.AUTH_SECRET;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, SECRET_KEY, { expiresIn: "10d" });
};
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }
        const userExist = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (userExist) {
            return res.status(409).json({
                message: "User already exists",
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield prisma.user.create({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred, please try again",
        });
    }
});
exports.userRegister = userRegister;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password",
            });
        }
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const match = yield bcryptjs_1.default.compare(password, user.password);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred, please try again",
        });
    }
});
exports.userLogin = userLogin;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        if (!email) {
            return res.status(400).json({
                message: "email is required",
            });
        }
        const activeUser = req.user;
        const user = yield prisma.user.findUnique({
            where: {
                email
            },
        });
        if ((activeUser === null || activeUser === void 0 ? void 0 : activeUser.role) === client_1.ROLES.GUEST && activeUser.id !== (user === null || user === void 0 ? void 0 : user.id)) {
            return res.status(401).json({
                message: "guests are not authorized to check other user details"
            });
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred, please try again",
        });
    }
});
exports.getUser = getUser;
