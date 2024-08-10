import express, { Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { userRouter } from "./routes/userRoutes"

dotenv.config();
const port = process.env.PORT || "8080"
const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));

app.get("/health", (_, res: Response) => {
  res.status(200).json({
    message: "Server is up and running"
  })
})

app.get("/user", userRouter)

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
