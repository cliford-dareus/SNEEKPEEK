import Post from "../models/Post";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import Comment from "../models/Comment";
import { ObjectId } from "mongoose";

const postPopulate = [
  { path: "likes", select: "_id username createdAt image" },
  { path: "author", select: "username _id image" },
  { path: "comments", select: "_id author content" },
  { path: "tags", select: "_id username image" },
];

const resolveTagIds = async (tagUsernames: string[] = []) => {
  if (!Array.isArray(tagUsernames) || tagUsernames.length === 0) return [];
  const users = await User.find({
    username: {
      $in: tagUsernames.map((u) => String(u).toLowerCase().trim()),
    },
  }).select("_id");
  return users.map((u) => u._id);
};

// Create Post
const createPost = async (req: Request, res: Response) => {
  const { content, image, tags } = req.body;
  const id = req.user;

  try {
    if (!content && !image) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "You can't post blank content",
      });
    }

    const tagIds = await resolveTagIds(tags);

    const post = await Post.create({
      author: id,
      content,
      image,
      tags: tagIds,
    });

    const populated = await Post.findById(post._id).populate(postPopulate);

    return res.status(StatusCodes.CREATED).json({ post: populated });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Edit Post
const editPost = async (req: Request, res: Response) => {
  const { postId, content, image, tags } = req.body;
  const id = req.user;

  try {
    if (!postId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "postId is required",
      });
    }

    if (content === undefined && image === undefined && tags === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Nothing to update",
      });
    }

    const post = await Post.findOne({ _id: postId, author: id });

    if (!post) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        message: "You can only edit your posts",
      });
    }

    if (content !== undefined) post.content = content;
    if (image !== undefined) post.image = image;
    if (tags !== undefined) {
      post.tags = (await resolveTagIds(tags)) as any;
    }

    await post.save();

    const populated = await Post.findById(post._id).populate(postPopulate);

    return res.status(StatusCodes.OK).json({ post: populated });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
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

    // Clean up comments for this post
    if (post.comments?.length) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Post deleted",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Like Post or Unlike Post
const likeOrUnlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const id = req.user;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (likeId) => String(likeId) === String(id)
    );

    if (alreadyLiked) {
      await post.updateOne({ $pull: { likes: id } });
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Post unliked",
      });
    }

    await post.updateOne({ $push: { likes: id } });
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Post liked",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get All Posts
const getAllPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.find()
      .populate(postPopulate)
      .sort({ createdAt: -1 })
      .exec();

    return res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get User Post
const getUserPost = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }

    const post = await Post.find({ author: user._id })
      .populate(postPopulate)
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      post,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get posts where user is tagged
const getTaggedInPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }

    const post = await Post.find({ tags: user._id })
      .populate(postPopulate)
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      post,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Trending posts by like count
const getTrendingPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: 10 },
    ]);

    const populated = await Post.populate(posts, postPopulate);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      post: populated,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

// Get post by id with comments filled
const getPostwithCommment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Post not found",
      });
    }

    const comment = await Promise.all(
      post.comments.map(async (ct: ObjectId) => {
        const c = await Comment.findById(ct);
        const user = await User.findById(c?.author, {
          username: true,
          image: true,
        });
        return { user, comment: c };
      })
    );

    return res.status(StatusCodes.OK).json({
      message: "",
      comment,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
    });
  }
};

export {
  createPost,
  editPost,
  deletePost,
  likeOrUnlikePost,
  getAllPost,
  getUserPost,
  getPostwithCommment,
  getTaggedInPosts,
  getTrendingPosts,
};
