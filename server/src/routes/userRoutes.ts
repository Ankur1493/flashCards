import express from "express"
import { userLogin, getAllUsers, getUser } from "../controllers/userController"

const router = express.Router();

router.post("/login", userLogin);
router.get("/all", getAllUsers);
router.get("/:id", getUser);

export { router as userRouter }
