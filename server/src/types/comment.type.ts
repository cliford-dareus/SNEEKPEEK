import { ObjectId } from "mongoose";


export interface IComment {
    author: ObjectId;
    content: string;
    likes: ObjectId[]
}