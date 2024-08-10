"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const cardRoutes_1 = require("./routes/cardRoutes");
dotenv_1.default.config();
const port = process.env.PORT || "8080";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
app.get("/health", (_, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});
app.use("/user", userRoutes_1.userRouter);
app.use("/cards", cardRoutes_1.cardRouter);
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
