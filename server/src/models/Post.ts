import mongoose from "mongoose";
import { IPost } from "../types/typing";

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      maxlength: 500,
    },
    image: { type: String },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    tags: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
