import ms from "ms";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import createTokenUser from "../utils/createTokenUser";
import { attachCookiesToResponse, createAccessToken } from "../utils/jwt";
import { UserToken } from "../types/models.type";
import crypto from "crypto";

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
      user,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

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
        data: { ...UserToken, accessToken },
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
      data: { ...UserToken, accessToken },
    });
  } catch (error) {}
};

const signOut = async (req: Request, res: Response) => {};

const refreshToken = async (req: Request, res: Response) => {};

export { signUp, signIn, signOut, refreshToken };
