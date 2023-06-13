import { Response } from "express";
import { Document, Model, ObjectId } from "mongoose";

// @MESSAGE
export interface IConversation {
  users: ObjectId[];
  messages: ObjectId;
}

export interface IMessage {
  channelId: ObjectId;
  messages: { status: status.DELIVERED; content: string; sender: ObjectId }[];
}

enum status {
  READ,
  RECIEVE,
  SEEN,
  DELIVERED,
}

// @USER
export interface IUser extends Partial<Document> {
  _id: ObjectId;
  name: string;
  username: string;
  password: string;
  email: string;
  image: string;
  request: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
  followersLength: number;
  followingsLength: number;
}

export interface IToken {
  userId: string;
  refreshToken: string;
  expirationTime: Date;
  isValid: boolean;
}

export interface IUserMethod {
  comparePassword: (password: string) => Promise<boolean>;
}

export type UserModel = Model<IUser, unknown, IUserMethod>;

export type UserToken = {
  username: string;
  userId: ObjectId;
};

export interface IUserTokenPayLoad {
  res: Response;
  user: UserToken;
  refreshToken: string;
}

export interface ICreateJwtPayLoad {
  payload: { user: UserToken; refreshToken?: string };
}

// interface ISignUpPayload {
//   name:
// }

// @POST
export interface IPost {
  author: ObjectId;
  content: string;
  image: string;
  likes: ObjectId[];
  comments: ObjectId[];
  featured: boolean;
}

// @COMMENT
export interface IComment {
  author: ObjectId;
  content: string;
  likes: ObjectId[];
}

// @JWT
export interface IJwtUser {
  id: ObjectId;
  refreshToken: string;
  user: { username: string; userId: string };
}

export interface IAccessToken {
  accessToken: string;
}
