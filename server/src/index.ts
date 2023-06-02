import express, { Request, Response } from "express";
import CookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
// import cors from "cors";
dotenv.config();

import authRouter from './router/auth';
import connectDB from "./db/connect";

const app = express();

// app.use(cors);
app.use(express.json());
app.use(morgan("combined"));
app.use(CookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 4000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);

    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  } catch (error) {
    
  }
}

start();