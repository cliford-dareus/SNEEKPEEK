import mongoose from "mongoose";
import { IToken } from "../types/typing";

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
    isValid: {
      type: Boolean,
      default: true,
    },
    expirationTime: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Token = mongoose.model<IToken>("Token", TokenSchema);
