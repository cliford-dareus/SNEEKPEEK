import { Response } from "express";
import { Model, ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  username: string;
  password: string;
  email: string;
  request: ObjectId[];
  followers: ObjectId[];
  following: ObjectId[];
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
// export interface ISignUpPayload {
//   name:
// }
