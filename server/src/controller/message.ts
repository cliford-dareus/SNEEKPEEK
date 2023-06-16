import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Messages from "../models/Messages";
import Conversation from "../models/Conversation";

const addNewMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const msg = req.body;

    const conversation = await Messages.findOne({ channelId: id });
    const channel = await Conversation.findOne({ _id: id });
    console.log(channel);

    if (!channel) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Channel not found",
      });
    }

    if (conversation) {
      conversation.messages = [...conversation.messages, msg];
      await conversation.save();

      channel.lastmessage = msg.content;
      await channel.save();

      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        conversation,
      });
    }

    const newConversation = await Messages.create({
      channelId: id,
      messages: [msg],
    });

    channel.lastmessage = msg.content;
    await channel.save();

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

const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const { status } = req.query;
    await Messages.updateMany(
      { channelId },
      { $set: { "messages.$[elem].status": status } },
      { arrayFilters: [{ "elem.status": "DELIVERED" }] }
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { addNewMessage, getAllMessage, updateMessageStatus };
