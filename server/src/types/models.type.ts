import { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface IToken extends Document {
  userId: string;
  refreshToken: string;
  expirationTime: Date;
}

export interface IUserMethod {
  comparedPassword: (password: string) => boolean;
}

export type IUserModel = Model<IUser, unknown, IUserMethod>;

// export interface ISignUpPayload {
//   name:
// }
