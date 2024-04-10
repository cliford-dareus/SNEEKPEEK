import { User } from "../models/User";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { checkUserIdentity } from "../utils/checkUserIdentity";
import Notification from "../models/Notifications";

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

    const user = await User.findOne({ username })
      .populate("request", ["_id", "username", "image"])
      .populate("followers", ["_id", "username", "image"])
      .populate("followings", ["_id", "username", "image"]);

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exit!",
      });
    }

    const { password, __v, email, ...other } = user.toObject();

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

    console.log(username);

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
      .select("id username image");

    if (!users) {
      return;
    }

    res.status(StatusCodes.OK).json({
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
      userTofollowId: userToFollow._id as unknown as string,
      currentUserId: id,
      res,
    });

    if (
      userToFollow.followers.includes(id) ||
      userToFollow.request.includes(id)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Already followed",
      });
    }

    await userToFollow.updateOne({ $push: { request: id } });

    await Notification.create({
      sender: id,
      target: userToFollow._id,
      type: "REQUEST",
    });

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
const unFollowUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  const id = req.user;

  try {
    const userToUnFollow = await User.findOne({ username });

    if (!userToUnFollow) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    checkUserIdentity({
      userTofollowId: userToUnFollow._id as unknown as string,
      currentUserId: id,
      res,
    });

    if (!userToUnFollow.followers.includes(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Already unfollowed",
      });
    }

    await userToUnFollow.updateOne({ $pull: { followers: id } });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Unfollowed",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Accept Request
const acceptRequest = async (req: Request, res: Response) => {
  const { userToAcceptId } = req.params;
  const id = req.user;

  try {
    const [userToAccept, currentUser] = await Promise.all([
      User.findById(userToAcceptId).select("+request"),
      User.findById(id).select("+followers"),
    ]);

    if (!userToAccept || !currentUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }

    
    checkUserIdentity({
      userTofollowId: userToAccept._id.toString(),
      currentUserId: id,
      res,
    });
    
    if (!currentUser.request.includes(userToAccept._id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }
    
    userToAccept.followers.push(id);
    currentUser.request = currentUser.request.filter(
      (request) => request === userToAccept._id
    );
    
    if (currentUser.followers.includes(userToAccept._id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Already followed",
      })
    }
    currentUser.followers.push(userToAccept._id);
    currentUser.followersLength++;
    userToAccept.followingsLength++;
    
    await Promise.all([
      userToAccept.save(),
      currentUser.save(),
      Notification.updateOne(
        { sender: userToAccept._id, target: currentUser._id },
        { status: "READ" }
      ),
    ]);
    
    console.log("GOT HERE");
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
      userTofollowId: userToAccept._id as unknown as string,
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
