import ms from "ms";
import crypto from "crypto";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import createTokenUser from "../utils/createTokenUser";
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  attachCookiesToResponse,
  clearRefreshCookie,
  clearRefreshToken,
  createAccessToken,
  jwtVerify,
} from "../utils/jwt";
import { UserToken } from "../types/typing";

const MIN_PASSWORD_LENGTH = 8;

const isStrongEnoughPassword = (password: string) =>
  typeof password === "string" && password.length >= MIN_PASSWORD_LENGTH;

const issueSession = async (user: {
  _id: unknown;
  username: string;
}) => {
  const userToken = createTokenUser(user as any) as UserToken;
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expirationTime = Date.now() + ms(REFRESH_TOKEN_TTL);

  await Token.findOneAndUpdate(
    { userId: user._id },
    {
      refreshToken,
      userId: user._id,
      isValid: true,
      expirationTime: String(expirationTime),
    },
    { upsert: true, new: true }
  );

  return { userToken, refreshToken };
};

// Sign Up
const signUp = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Name, username, email, and password are required",
      });
    }

    if (!isStrongEnoughPassword(password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        message: "An account with that email or username already exists",
      });
    }

    await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
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
        message: "Username and password are required",
      });
    }

    // password has select: false — must opt in
    const user = await User.findOne({ username: username.toLowerCase() }).select(
      "+password"
    );

    // Constant-ish response: do not reveal whether username exists
    if (!user || !(await user.comparePassword(password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const { userToken, refreshToken } = await issueSession(user);

    attachCookiesToResponse({
      res,
      user: userToken,
      refreshToken,
    });

    const accessToken = createAccessToken(userToken);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      user: {
        ...userToken,
        accessToken,
        expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_TTL)),
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

    await Token.findOneAndDelete({ userId });

    clearRefreshCookie(res);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User logged out",
    });
  } catch (error) {
    clearRefreshCookie(res);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User logged out",
    });
  }
};

// Refresh Token (rotates refresh token on each successful refresh)
const refreshTokenFn = async (req: Request, res: Response) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  try {
    const decodedRefreshToken = jwtVerify({ payload: refreshToken });
    const storedToken = await Token.findOne({
      refreshToken: decodedRefreshToken?.refreshToken,
      userId: decodedRefreshToken?.user?.userId,
    });

    if (!storedToken || !storedToken.isValid) {
      await clearRefreshToken(req, res, false);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    if (
      storedToken.expirationTime &&
      Number(storedToken.expirationTime) < Date.now()
    ) {
      await Token.findByIdAndDelete(storedToken._id);
      clearRefreshCookie(res);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    const user = await User.findById(decodedRefreshToken?.user?.userId);

    if (!user) {
      await clearRefreshToken(req, res, true);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ReasonPhrases.UNAUTHORIZED,
      });
    }

    // Rotate refresh token
    const { userToken, refreshToken: newRefreshToken } = await issueSession(
      user
    );

    attachCookiesToResponse({
      res,
      user: userToken,
      refreshToken: newRefreshToken,
    });

    const accessToken = createAccessToken(userToken);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      user: {
        ...userToken,
        accessToken,
        expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_TTL)),
      },
    });
  } catch (error) {
    clearRefreshCookie(res);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    });
  }
};

// Reset Password (authenticated change)
const resetPassword = async (req: Request, res: Response) => {
  const userId = req.user;
  const { oldpassword, newpassword } = req.body;

  if (!oldpassword || !newpassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Both current and new password are required",
    });
  }

  if (!isStrongEnoughPassword(newpassword)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }

  if (oldpassword === newpassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "New password must be different from the current password",
    });
  }

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(oldpassword);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    user.password = newpassword;
    await user.save();

    // Invalidate all sessions after password change
    await Token.deleteMany({ userId: user._id });
    clearRefreshCookie(res);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Password updated successfully. Please sign in again.",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { signUp, signIn, signOut, refreshTokenFn, resetPassword };
