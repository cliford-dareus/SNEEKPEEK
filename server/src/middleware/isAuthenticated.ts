import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { jwtVerify } from "../utils/jwt";
import { Token } from "../models/Token";
import { User } from "../models/User";

const unauthorized = (res: Response) =>
  res.status(StatusCodes.UNAUTHORIZED).json({
    status: StatusCodes.UNAUTHORIZED,
    message: ReasonPhrases.UNAUTHORIZED,
  });

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.signedCookies;
    const authHeader = req.get("Authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!accessToken || !refreshToken) {
      return unauthorized(res);
    }

    const decodedAccess = jwtVerify({ payload: accessToken });
    const decodedRefresh = jwtVerify({ payload: refreshToken });

    const accessUserId = String(decodedAccess.user?.userId ?? "");
    const refreshUserId = String(decodedRefresh.user?.userId ?? "");

    if (!accessUserId || !refreshUserId || accessUserId !== refreshUserId) {
      return unauthorized(res);
    }

    const storedToken = await Token.findOne({
      refreshToken: decodedRefresh.refreshToken,
      userId: refreshUserId,
    });

    if (!storedToken || !storedToken.isValid) {
      return unauthorized(res);
    }

    if (
      storedToken.expirationTime &&
      Number(storedToken.expirationTime) < Date.now()
    ) {
      storedToken.isValid = false;
      await storedToken.save();
      return unauthorized(res);
    }

    const user = await User.findById(refreshUserId);

    if (!user) {
      return unauthorized(res);
    }

    req.user = user._id;
    next();
  } catch {
    return unauthorized(res);
  }
};

export default isAuthenticated;
