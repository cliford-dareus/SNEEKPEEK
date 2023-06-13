import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Conversation from "../models/Conversation";

const createConversation = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const {recieverId} = req.body;

    const hasConversated = await Conversation.findOne({
      users: {
        $all: [currentUser, recieverId],
      },
    });

    if (hasConversated) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        conversation: hasConversated,
      });
    }

    const conversation = await Conversation.create({
      users: [currentUser, recieverId],
    });

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      conversation,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const getAllConversation = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const conversation = await Conversation.find({
      users: {
        $in: [currentUser],
      },
    })
    .sort({ updatedAt: -1 })
    .populate("users", ["username", "_id", "image"]);
  
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      conversation,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { createConversation, getAllConversation };
