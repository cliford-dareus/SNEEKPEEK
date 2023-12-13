import ms from "ms";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Token } from "../models/Token";
import {
  ICreateJwtPayLoad,
  IJwtUser,
  IUserTokenPayLoad,
  UserToken,
} from "../types/typing";

export const jwtVerify = ({ payload }: { payload: string }) => {
  return jwt.verify(payload, process.env.JWT_SECRET!) as IJwtUser;
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
    sameSite: 'none',
    secure: false,
    signed: true,
    expires: new Date(Date.now() + ms("1d")),
  });
};

export const createAccessToken = (user: UserToken) => {
  return createJWT({ payload: { user } });
};

export const clearRefreshToken = async (
  req: Request,
  res: Response,
  isExist?: boolean
) => {
  const { refreshToken } = req.signedCookies;

  if (refreshToken && isExist) {
    const decodedRefreshToken = jwtVerify({ payload: refreshToken });
    await Token.findOneAndDelete({
      refreshToken: decodedRefreshToken?.refreshToken,
    });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    signed: true,
  });
};
