import Post from "../models/Post";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import Comment from "../models/Comment";

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
    const post = await Post.findById(postId);
    console.log("POST" + post);
    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No post wid this id" });
    }

    console.log("USER ID" + id);

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
  console.log("here");
  try {
    const post = await Post.find()
      .populate("likes", ["_id", "username", "createdAt"])
      .populate("author", ["username", "_id", "image"])
      .populate("comments", ["_id", "author", "content"])
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
const getUserPost = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return;
    }
    const post = await Post.find({ author: user._id });

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      post,
    });

  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get Tagged In Posts

// Get Post by id and comment fill with users username and pic
const getPostwithCommment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return;
    }

    const comment = await Promise.all(
      post.comments.map(async (ct) => {
        const comment = await Comment.findById(ct);

        const user = await User.findById(comment?.author, {
          username: true,
          image: true,
        });

        return {
          user,
          comment,
        };
      })
    );

    res.status(StatusCodes.OK).json({
      message: "",
      comment,
    });
  } catch (error) {}
};

export {
  createPost,
  editPost,
  deletePost,
  likeOrUnlikePost,
  getAllPost,
  getUserPost,
  getPostwithCommment,
};
