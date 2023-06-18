import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Notification from "../models/Notifications";

const getNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const notifications = await Notification.find({ target: userId })
      .populate("target", ["_id", "username", "image"])
      .populate("sender", ["_id", "username", "image"]);

    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        notifications
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export { getNotification };

// TODO: add erase old notifications after a week or two
