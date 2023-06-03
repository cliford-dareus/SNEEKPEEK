import { ObjectId } from "mongoose";

export interface IJwtUser {
  id: ObjectId;
  refreshToken: string;
  user: { username: string; userId: string };
}

export interface IAccessToken {
  accessToken: string;
}
