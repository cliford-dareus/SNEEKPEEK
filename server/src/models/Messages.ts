import mongoose from "mongoose";
import { IMessage } from "../types/typing";

const MessageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IMessage>("Message", MessageSchema);
export default Post;
