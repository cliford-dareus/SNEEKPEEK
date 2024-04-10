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
      notifications,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

// TODO: add erase old notifications after a week or two
const eraseNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Notification.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "notification does not exist",
      });
    }
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "notification deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export { getNotification };

