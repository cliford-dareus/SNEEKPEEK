import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Notification from "../models/Notifications";

const getNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const notifications = await Notification.find({ target: userId })
      .populate("target", ["_id", "username", "image"])
      .populate("sender", ["_id", "username", "image"])
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      notifications,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, target: userId },
      { status: "READ" },
      { new: true }
    )
      .populate("sender", ["_id", "username", "image"])
      .populate("target", ["_id", "username", "image"]);

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Notification not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      notification,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user;

    await Notification.updateMany(
      { target: userId, status: "RECEIVED" },
      { status: "READ" }
    );

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { getNotification, markNotificationRead, markAllNotificationsRead };
