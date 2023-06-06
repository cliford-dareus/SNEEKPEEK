import express, { Request, Response } from "express";
import CookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
dotenv.config();

import authRouter from "./router/auth";
import postRouter from "./router/post";
import commentRouter from "./router/comment";
import userRouter from "./router/user";

import connectDB from "./db/connect";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("combined"));
app.use(CookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  } catch (error) {}
};

start();
