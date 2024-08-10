import express from "express"
import { userRegister, userLogin, getUser } from "../controllers/userController"
import { authenticate } from "../authenticate";

const router = express.Router();

router.post("/register", userRegister)
router.post("/login", userLogin);
router.get("/:id", authenticate, getUser);

export { router as userRouter }
