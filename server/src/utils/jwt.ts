import ms from "ms";
import jwt from "jsonwebtoken";
import { CookieOptions, Request, Response } from "express";
import { Token } from "../models/Token";
import {
  ICreateJwtPayLoad,
  IJwtUser,
  IUserTokenPayLoad,
  UserToken,
} from "../types/typing";

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL = "1d";

const isProduction = process.env.NODE_ENV === "production";

/** Cookie options shared by set and clear so browsers actually remove the cookie. */
export const getRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  signed: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: ms(REFRESH_TOKEN_TTL),
});

export const jwtVerify = ({ payload }: { payload: string }) => {
  return jwt.verify(payload, process.env.JWT_SECRET!) as IJwtUser;
};

const createJWT = ({
  payload,
  expiresIn,
}: ICreateJwtPayLoad & { expiresIn: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: IUserTokenPayLoad) => {
  const refreshTokenJWT = createJWT({
    payload: { user, refreshToken },
    expiresIn: REFRESH_TOKEN_TTL,
  });

  res.cookie("refreshToken", refreshTokenJWT, getRefreshCookieOptions());
};

export const createAccessToken = (user: UserToken) => {
  return createJWT({
    payload: { user },
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });
};

export const clearRefreshToken = async (
  req: Request,
  res: Response,
  isExist?: boolean
) => {
  const { refreshToken } = req.signedCookies;

  if (refreshToken && isExist) {
    try {
      const decodedRefreshToken = jwtVerify({ payload: refreshToken });
      await Token.findOneAndDelete({
        refreshToken: decodedRefreshToken?.refreshToken,
      });
    } catch {
      // Token may already be invalid/expired — still clear the cookie
    }
  }

  clearRefreshCookie(res);
};
