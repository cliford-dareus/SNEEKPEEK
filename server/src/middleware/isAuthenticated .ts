import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtVerify } from "../utils/jwt";
import { Token } from "../models/Token";
import { User } from "../models/User";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.signedCookies;
    const authToken = req.get("Authorization");
    const accessToken = authToken?.split("Bearer ")[1];
    if (!accessToken || !refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json("UNAUTHORIZED");
    }

    const decodedRefreshToken = jwtVerify({ payload: refreshToken });
    const isRefreshToken = await Token.findOne({
      refreshToken: decodedRefreshToken.refreshToken,
    });

    if (!isRefreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED);
    }

    const user = await User.findOne({
      _id: decodedRefreshToken.user.userId,
    });

    req.user = user?._id;
    next();
  } catch (error) {}
};

export default isAuthenticated;
