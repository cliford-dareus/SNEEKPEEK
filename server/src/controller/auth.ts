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
import { UserToken } from "../types/user.type";
import crypto from "crypto";

// Sign Up
const signUp = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    const isUserExist = await User.find({ email });

    if (!isUserExist) {
      return res.status(StatusCodes.CONFLICT).send({
        status: StatusCodes.CONFLICT,
        message: ReasonPhrases.CONFLICT,
      });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: ReasonPhrases.CREATED,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

//Sign In
const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await user?.comparePassword(password);

    if (!isPasswordCorrect || !user) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        status: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    const UserToken = createTokenUser(user) as UserToken;

    let refreshToken = "";
    const isTokenExist = await Token.findOne({ userId: user._id });

    if (isTokenExist) {
      const { isValid } = isTokenExist;

      if (!isValid) {
        res.status(StatusCodes.BAD_REQUEST).send({
          status: StatusCodes.BAD_REQUEST,
        });
      }

      refreshToken = isTokenExist?.refreshToken;
      attachCookiesToResponse({ res, user: UserToken, refreshToken });
      const accessToken = createAccessToken(UserToken);
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        user: {
          ...UserToken,
          accessToken,
          expiresAt: new Date(Date.now() + ms("15m")),
        },
      });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");

    const tokenUser = {
      refreshToken,
      userId: user._id,
      expirationTime: new Date(Date.now() + ms("1d")).getTime(),
    };

    await Token.create(tokenUser);
    attachCookiesToResponse({ res, user: UserToken, refreshToken });
    const accessToken = createAccessToken(UserToken);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      user: {
        ...UserToken,
        accessToken,
        expiresAt: new Date(Date.now() + ms("15m")),
      },
    });
  } catch (error) {}
};

//Sign Out
const signOut = async (req: Request, res: Response) => {
  
};

//RefreshToken
const refreshTokenFn = async (req: Request, res: Response) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    return res.status(StatusCodes.NO_CONTENT);
  }

  try {
    const decodedRefreshToken = jwtVerify({ payload: refreshToken });
    const isTokenExist = await Token.findOne({
      refreshToken: decodedRefreshToken?.refreshToken,
    });

    if (!isTokenExist) {
      const isExist = false;
      await clearRefreshToken(req, res, false);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    try {
      const user = await User.findOne({
        _id: decodedRefreshToken?.user?.userId,
      });

      if (!user) {
        await clearRefreshToken(req, res, true);
        return res.status(StatusCodes.UNAUTHORIZED);
      }

      const UserToken = { username: user.username, userId: user._id };
      const accessToken = createAccessToken(UserToken);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        user: {
          ...UserToken,
          accessToken,
          expiresAt: new Date(Date.now() + ms("15m")),
        },
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST);
  }
};

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
  } catch (error) {}
};

export { signUp, signIn, signOut, refreshTokenFn, resetPassword };
