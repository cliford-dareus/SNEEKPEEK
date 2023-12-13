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
import conversationRouter from "./router/conversation";
import messageRouter from "./router/message";
import notificationRouter from "./router/notification";

import connectDB from "./db/connect";

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("combined"));
app.use(CookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/notification", notificationRouter);

app.get('/', (req, res) => {
  res.status(200).send("<h1>Welcome to sneekserver!</h1>");
})

const PORT = process.env.PORT || 4000;

interface IUser {
  username: string;
  userId: string;
}

ioServer.use((socket, next) => {
  console.log(socket.handshake.auth);
  const username = socket.handshake.auth.name;
  const userId = socket.handshake.auth.id;

  if(!username || !userId) {
    return 
  }

  // @ts-ignore
  socket.username = username;
  // @ts-ignore
  socket.userId = userId;

  next();
});

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
