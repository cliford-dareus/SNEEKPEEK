import ms from "ms";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import createTokenUser from "../utils/createTokenUser";
import {
  attachCookiesToResponse,
  clearRefreshToken,
  createAccessToken,
  jwtVerify,
} from "../utils/jwt";
import crypto from "crypto";
import { UserToken } from "../types/typing";

// Sign Up
const signUp = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        message: ReasonPhrases.CONFLICT,
      });
    }

    await User.create({
      name,
      username,
      email,
      password,
    });

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: ReasonPhrases.CREATED,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Sign In
const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await user?.comparePassword(password);

    if (!isPasswordCorrect || !user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    const UserTokenPayload = createTokenUser(user) as UserToken;

    let refreshToken = "";
    const isTokenExist = await Token.findOne({ userId: user._id });

    if (isTokenExist) {
      const { isValid } = isTokenExist;

      if (!isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: ReasonPhrases.BAD_REQUEST,
        });
      }

      refreshToken = isTokenExist.refreshToken;
      attachCookiesToResponse({
        res,
        user: UserTokenPayload,
        refreshToken,
      });
      const accessToken = createAccessToken(UserTokenPayload);
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        user: {
          ...UserTokenPayload,
          accessToken,
          expiresAt: new Date(Date.now() + ms("15m")),
        },
      });
    }

    refreshToken = crypto.randomBytes(40).toString("hex");

    const tokenUser = {
      refreshToken,
      userId: user._id,
      expirationTime: new Date(Date.now() + ms("1d")).getTime(),
    };

    await Token.create(tokenUser);
    attachCookiesToResponse({
      res,
      user: UserTokenPayload,
      refreshToken,
    });
    const accessToken = createAccessToken(UserTokenPayload);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      user: {
        ...UserTokenPayload,
        accessToken,
        expiresAt: new Date(Date.now() + ms("15m")),
      },
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Sign Out
const signOut = async (req: Request, res: Response) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    await Token.findOneAndUpdate(
      { userId: user._id },
      { refreshToken: "", expirationTime: "" }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      signed: true,
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User logged out",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Refresh Token
const refreshTokenFn = async (req: Request, res: Response) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  try {
    const decodedRefreshToken = jwtVerify({ payload: refreshToken });
    const isTokenExist = await Token.findOne({
      refreshToken: decodedRefreshToken?.refreshToken,
    });

    if (!isTokenExist) {
      await clearRefreshToken(req, res, false);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const user = await User.findOne({
      _id: decodedRefreshToken?.user?.userId,
    });

    if (!user) {
      await clearRefreshToken(req, res, true);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const UserTokenPayload = {
      username: user.username,
      userId: user._id,
    };
    const accessToken = createAccessToken(UserTokenPayload);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      user: {
        ...UserTokenPayload,
        accessToken,
        expiresAt: new Date(Date.now() + ms("15m")),
      },
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Reset Password
const resetPassword = async (req: Request, res: Response) => {
  const userId = req.user;
  const { oldpassword, newpassword } = req.body;

  if (!oldpassword || !newpassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Both fields are required...",
    });
  }

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(oldpassword);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Incorrect current password",
      });
    }

    user.password = newpassword;
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { signUp, signIn, signOut, refreshTokenFn, resetPassword };
