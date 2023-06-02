import { User } from "../models/User";
import { Token } from "../models/Token";
import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

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

const signIn = async (req: Request, res: Response) => {};

const signOut = async (req: Request, res: Response) => {};

const refreshToken = async (req: Request, res: Response) => {};

export { signUp, signIn, signOut, refreshToken };
