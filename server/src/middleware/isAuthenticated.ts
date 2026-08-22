import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
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
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    // Verify access token is valid JWT
    jwtVerify({ payload: accessToken });

    const decodedRefreshToken = jwtVerify({ payload: refreshToken });
    const storedToken = await Token.findOne({
      refreshToken: decodedRefreshToken.refreshToken,
    });

    if (!storedToken || !storedToken.isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const user = await User.findOne({
      _id: decodedRefreshToken.user.userId,
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    req.user = user._id;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    });
  }
};

export default isAuthenticated;
