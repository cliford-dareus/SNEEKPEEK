import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongoose";

interface Ipayload {
  userTofollowId: string;
  currentUserId: string;
  res: Response;
}

export const checkUserIdentity = ({
  userTofollowId,
  currentUserId,
  res,
}: Ipayload) => {
  if (userTofollowId === currentUserId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "You can't follow yourself",
    });
  }
};
