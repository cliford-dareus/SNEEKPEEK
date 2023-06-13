import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Messages from "../models/Messages";

const addNewMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const msg = req.body;

    const conversation = await Messages.findOne({ channelId: id});

    console.log(id);

    if (conversation) {
      conversation.messages = [...conversation.messages, msg];
      await conversation.save();

      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        conversation,
      });
    }

    const newConversation = await Messages.create({
      channelId: id,
      messages: [msg],
    });

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      conversation: newConversation,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const getAllMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await Messages.findOne({ channelId: id })
      .populate("messages.sender", ["_id", "username"])
      .populate("channelId");

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { addNewMessage, getAllMessage };
