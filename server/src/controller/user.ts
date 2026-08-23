import { User } from "../models/User";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Notification from "../models/Notifications";

const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("user does not exist");
    }
    const { password, __v, ...otherInfo } = user.toObject();
    return res.status(200).send({
      status: "success",
      message: "user info",
      user: otherInfo,
    });
  } catch (e) {
    return res.status(500).send({
      status: "failure",
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const getUserByName = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Please enter a username",
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() })
      .populate("request", ["_id", "username", "image"])
      .populate("followers", ["_id", "username", "image"])
      .populate("followings", ["_id", "username", "image"]);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "User doesn't exist",
      });
    }

    const { password, __v, email, ...other } = user.toObject();

    return res.status(StatusCodes.OK).json({
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

    const users = await User.find(searchTerm)
      .limit(Number(limit))
      .sort(sortTerm)
      .select("_id username image");

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      users,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const { newUsername, newImage } = req.body;
    if (!newUsername && !newImage) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "You must provide something new to update",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User account not found",
      });
    }

    if (newUsername) {
      user.username = newUsername.toLowerCase();
    }

    if (newImage) {
      user.image = newImage;
    }

    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "User profile updated",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

const followUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  const id = req.user;

  try {
    const userToFollow = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!userToFollow) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    if (String(userToFollow._id) === String(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "You can't follow yourself",
      });
    }

    const alreadyRequested = userToFollow.request.some(
      (r) => String(r) === String(id)
    );
    const alreadyFollowing = userToFollow.followers.some(
      (f) => String(f) === String(id)
    );

    if (alreadyRequested || alreadyFollowing) {
      return res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        message: alreadyFollowing
          ? "Already following this user"
          : "Follow request already sent",
      });
    }

    await userToFollow.updateOne({ $push: { request: id } });

    await Notification.create({
      sender: id,
      target: userToFollow._id,
      type: "REQUEST",
      message: "sent you a follow request",
      status: "RECEIVED",
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Request sent",
      target: {
        userId: userToFollow._id,
        username: userToFollow.username,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

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

    if (String(userToAccept._id) === String(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Invalid request",
      });
    }

    const currentUser = await User.findOne({ _id: id });
    if (!currentUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    const hasRequest = currentUser.request.some(
      (r) => String(r) === String(userToAccept._id)
    );

    if (!hasRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "No pending request from this user",
      });
    }

    await currentUser.updateOne({
      $push: { followers: userToAccept._id },
      $pull: { request: userToAccept._id },
      $inc: { followersLength: 1 },
    });

    await userToAccept.updateOne({
      $push: { followings: currentUser._id },
      $inc: { followingsLength: 1 },
    });

    await Notification.updateMany(
      {
        sender: userToAccept._id,
        target: currentUser._id,
        type: "REQUEST",
      },
      { status: "READ" }
    );

    await Notification.create({
      sender: currentUser._id,
      target: userToAccept._id,
      type: "FOLLOW",
      message: "accepted your follow request",
      status: "RECEIVED",
    });

    return res.status(StatusCodes.OK).json({
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

    const currentUser = await User.findOne({ _id: id });
    if (!currentUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    const hasRequest = currentUser.request.some(
      (r) => String(r) === String(userToAccept._id)
    );

    if (!hasRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "No pending request from this user",
      });
    }

    await currentUser.updateOne({
      $pull: { request: userToAccept._id },
    });

    await Notification.updateMany(
      {
        sender: userToAccept._id,
        target: currentUser._id,
        type: "REQUEST",
      },
      { status: "READ" }
    );

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Request declined",
    });
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
