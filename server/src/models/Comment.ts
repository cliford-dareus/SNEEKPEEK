import mongoose from "mongoose";
import { IComment } from "../types/comment.type";
// import { IPost } from "../types/post.type";

const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    content: { type: String, max: 300 },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
