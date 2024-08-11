import express, { Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { userRouter } from "./routes/userRoutes"
import { cardRouter } from "./routes/cardRoutes"

dotenv.config();
const port = process.env.PORT || "8080"
const app = express();
app.use(express.json())
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/health", (_, res: Response) => {
  res.status(200).json({
    message: "Server is up and running"
  })
})

app.use("/user", userRouter)
app.use("/cards", cardRouter)

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
