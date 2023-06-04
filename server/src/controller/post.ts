import Post from "../models/Post";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

//Create Post
const createPost = async (req: Request, res: Response) => {
  const { content, image } = req.body;
  const id = req.user;

  try {
    if (!content && !image) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "You cant post blank content",
      });
    }

    const post = await Post.create({
      author: id,
      content,
      image,
    });

    res.status(StatusCodes.CREATED).json({ post });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Edit Post
const editPost = async (req: Request, res: Response) => {
  const { postId, content, image } = req.body;
  const id = req.user;

  try {
    if (!content && !image) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "You cant post blank content",
      });
    }

    const post = await Post.findOne({ _id: postId, author: id });

    if (!post) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        message: "You can only edit your posts",
      });
    }

    if (content) {
      post.content = content;
      await post.save();
      res.status(StatusCodes.OK).json({ post });
    }

    if (image) {
      post.image = image;
      await post.save();

      res.status(StatusCodes.OK).json({ post });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Delete Post
const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const id = req.user;

  try {
    const post = await Post.findOneAndDelete({ _id: postId, author: id });

    if (!post) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        message: "You can only delete your posts",
      });
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Post Deleted",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Like Post
const likeOrUnlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const id = req.user;

  try {
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No post wid this id" });
    }

    if (post.likes.includes(id)) {
      await post.updateOne({ $pull: { likes: id } });
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Post unliked",
      });
    } else {
      await post.updateOne({ $push: { likes: id } });
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Post liked",
      });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get All Posts
const getAllPost = async (req: Request, res: Response) => {
    console.log('here')
  try {
    const post = await Post.find()
      .populate("likes", ['_id', 'username'])
      .populate("author", ["username", "_id", "image"] )
      .populate("comments")
      .exec();

    res.status(StatusCodes.OK).json({
      post,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get Friends and Personal Posts

// Get Tagged In Posts

export { createPost, editPost, deletePost, likeOrUnlikePost, getAllPost };