import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import CookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import IO from "./lib/socket/socket";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const ioServer = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});

import authRouter from "./router/auth";
import postRouter from "./router/post";
import commentRouter from "./router/comment";
import userRouter from "./router/user";

import connectDB from "./db/connect";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("combined"));
app.use(CookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 4000;

ioServer.use((socket, next) => {
  console.log(socket.handshake.auth)
})

IO(ioServer);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    httpServer.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  } catch (error) {}
};

start();
