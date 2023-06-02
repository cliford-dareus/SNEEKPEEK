import mongoose from "mongoose";
import { IToken } from "../types/models.type";

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expirationTime: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Token = mongoose.model<IToken>("Token", TokenSchema);
