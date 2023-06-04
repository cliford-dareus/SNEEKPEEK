import exp from "constants";
import { User } from "../models/User";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { checkUserIdentity } from "../utils/checkUserIdentity";
import { ObjectId } from "mongoose";

// Get User by id

// Get User by username

// Edit User

// Follow User
const followUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  const id = req.user as ObjectId;
  try {
    const userToFollow = await User.findOne({ username });

    if (!userToFollow) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    checkUserIdentity({
      userTofollowId: userToFollow._id,
      currentUserId: id,
      res,
    });

    await userToFollow?.updateOne({ $push: { request: id } });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Request sent",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};
// UnFollow User

// Accept Request
const acceptRequest = async (req: Request, res: Response) => {
  const id = req.user;
  const { userToAcceptId } = req.params;

  try {
    const userToAccept = await User.findOne({ _id: userToAcceptId });
    if (!userToAccept) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    checkUserIdentity({
      userTofollowId: userToAccept._id,
      currentUserId: id,
      res,
    });

    const currentUser = await User.findOne({ _id: id });
    if (!currentUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    if (!currentUser.request.includes(userToAccept._id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    await currentUser.updateOne({
      $push: { followers: userToAccept._id },
      $pull: { request: userToAccept._id },
    });

    await userToAccept.updateOne({
      $push: { following: currentUser._id },
    });

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Request accepted",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};
// Decline Request
const declineRequest = async (req: Request, res: Response) => {
    const id = req.user;
    const { userToAcceptId } = req.params;

    try {
        const userToAccept = await User.findOne({ _id: userToAcceptId });
        if (!userToAccept) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: "User doesn't exist",
          });
        }
    
        checkUserIdentity({
          userTofollowId: userToAccept._id,
          currentUserId: id,
          res,
        });
    
        const currentUser = await User.findOne({ _id: id });
        if (!currentUser) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: "User doesn't exist",
          });
        }
    
        if (!currentUser.request.includes(userToAccept._id)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: "User doesn't exist",
          });
        }
        
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: ReasonPhrases.BAD_REQUEST,
          });
    }
};

export { followUser, acceptRequest };
