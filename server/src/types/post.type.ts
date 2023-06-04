import { ObjectId } from "mongoose";

export interface IPost {
  author: ObjectId;
  content: string;
  image: string;
  likes: ObjectId[];
  comments: ObjectId[];
  featured: boolean;
}
