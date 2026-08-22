import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import CookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import IO from "./lib/socket/socket";

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

if (process.env.JWT_SECRET!.length < 32) {
  console.warn(
    "Warning: JWT_SECRET should be at least 32 characters for production use."
  );
}

const CLIENT_ORIGIN =
  process.env.CLIENT_URL || "https://sneekpeek.netlify.app";

const app = express();
const httpServer = createServer(app);
const ioServer = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
});

import authRouter from "./router/auth";
import postRouter from "./router/post";
import commentRouter from "./router/comment";
import userRouter from "./router/user";
import conversationRouter from "./router/conversation";
import messageRouter from "./router/message";
import notificationRouter from "./router/notification";

import connectDB from "./db/connect";

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("combined"));
app.use(CookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/notification", notificationRouter);

app.get("/", (_req, res) => {
  res.status(200).send("<h1>Welcome to sneekserver!</h1>");
});

const PORT = process.env.PORT || 4000;

ioServer.use((socket, next) => {
  const username = socket.handshake.auth?.name;
  const userId = socket.handshake.auth?.id;

  if (!username || !userId) {
    return next(new Error("Unauthorized: missing auth credentials"));
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
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
