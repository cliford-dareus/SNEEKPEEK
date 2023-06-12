import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const createConversation = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const getAllConversation = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { createConversation, getAllConversation };
