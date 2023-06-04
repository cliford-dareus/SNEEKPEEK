import Comment from "../models/Comment";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Post from "../models/Post";

const postComment = async (req: Request, res: Response) => {
  const id = req.user;
  try {
    const { postId, content } = req.body;
    if (!content) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_GATEWAY,
        message: "You can post empty comment",
      });
    }
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_GATEWAY,
        message: "No Post with this id",
      });
    }

    const comment = await Comment.create({
      author: id,
      content: content,
    });

    await post.updateOne({ $push: { comments: comment._id } });
    
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "comment posted",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export { postComment };
