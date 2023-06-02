import ms from "ms";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { IAccessToken, IJwtUser } from "../types/jwt";
import { ICreateJwtPayLoad, IUserTokenPayLoad, UserToken } from "../types/models.type";

export const jwtVerify = ({ accessToken }: { accessToken: string }) => {
  return jwt.verify(accessToken, process.env.JWT_SECRET!) as IJwtUser;
};

const createJWT = ({ payload }: ICreateJwtPayLoad) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};

export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: IUserTokenPayLoad) => {
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
  
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: false,
    signed: true,
    expires: new Date(Date.now() + ms('1d')),
  });
};

export const createAccessToken = (user: UserToken) => {
  return createJWT({ payload: { user } });
}
