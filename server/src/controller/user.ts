import { User } from "../models/User";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { checkUserIdentity } from "../utils/checkUserIdentity";
import { ObjectId } from "mongoose";

// Get User by id
const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("user does not exist");
    }
    const { password, __v, ...otherInfo } = user;
    res.status(200).send({
      status: "success",
      message: "user info",
      user: otherInfo,
    });
  } catch (e) {
    res.status(500).send({
      status: "failure",
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get User by username
const getUserByName = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    console.log(username);

    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Please Enter an Username!",
      });
    }

    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exit!",
      });
    }
    const { password, ...other } = user.toObject();

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      user: other,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Search User
const searchUser = async (req: Request, res: Response) => {
  try {
    const { username, sort, limit = 10 } = req.query;

    let searchTerm: { [key: string]: any } = {};

    if (username) {
      searchTerm.username = { $regex: username as string, $options: "i" };
    }

    let sortTerm = "";

    if (sort) {
      sortTerm = sort?.toString().split(",").join(" ");
    } else {
      sortTerm = "asc";
    }

    const user = await User.find(searchTerm)
      .limit(Number(limit))
      .sort(sortTerm);

    if (!user) {
      return;
    }

    res.status(200).send(user);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Edit User
const editUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const { newUsername, newImage } = req.body;
    if (!newUsername && !newImage) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "You must provide something new to update!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User account not found!",
      });
    }

    if (newUsername) {
      user.username = newUsername;
      user.save();

      res.status(200).json({
        status: StatusCodes.OK,
        message: `User Profile updated`,
      });
    }

    if (newImage) {
      user.image = newImage;
      user.save();

      res.status(200).json({
        status: StatusCodes.OK,
        message: `User Profile updated`,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Follow User
const followUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  const id = req.user;

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

    await userToFollow.updateOne({ $push: { request: id } });

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
      $inc: { followers: 1 },
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

export {
  followUser,
  acceptRequest,
  declineRequest,
  getUser,
  getUserByName,
  editUser,
  searchUser,
};
