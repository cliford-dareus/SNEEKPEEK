"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostwithCommment = exports.getUserPost = exports.getAllPost = exports.likeOrUnlikePost = exports.deletePost = exports.editPost = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const Comment_1 = __importDefault(require("../models/Comment"));
//Create Post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    const id = req.user;
    try {
        if (!content && !image) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "You cant post blank content",
            });
        }
        const post = yield Post_1.default.create({
            author: id,
            content,
            image,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ post });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.createPost = createPost;
// Edit Post
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content, image } = req.body;
    const id = req.user;
    try {
        if (!content && !image) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "You cant post blank content",
            });
        }
        const post = yield Post_1.default.findOne({ _id: postId, author: id });
        if (!post) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                status: http_status_codes_1.StatusCodes.FORBIDDEN,
                message: "You can only edit your posts",
            });
        }
        if (content) {
            post.content = content;
            yield post.save();
            res.status(http_status_codes_1.StatusCodes.OK).json({ post });
        }
        if (image) {
            post.image = image;
            yield post.save();
            res.status(http_status_codes_1.StatusCodes.OK).json({ post });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.editPost = editPost;
// Delete Post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const id = req.user;
    try {
        const post = yield Post_1.default.findOneAndDelete({ _id: postId, author: id });
        if (!post) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                status: http_status_codes_1.StatusCodes.FORBIDDEN,
                message: "You can only delete your posts",
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Post Deleted",
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.deletePost = deletePost;
// Like Post or Unlike Post
const likeOrUnlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const id = req.user;
    try {
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ message: "No post wid this id" });
        }
        if (post.likes.includes(id)) {
            yield post.updateOne({ $pull: { likes: id } });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Post unliked",
            });
        }
        else {
            yield post.updateOne({ $push: { likes: id } });
            res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Post liked",
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.likeOrUnlikePost = likeOrUnlikePost;
// Get All Posts
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.find()
            .populate("likes", ["_id", "username", "createdAt"])
            .populate("author", ["username", "_id", "image"])
            .populate("comments", ["_id", "author", "content"])
            .exec();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            post,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getAllPost = getAllPost;
// Get User Post
const getUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const user = yield User_1.User.findOne({ username });
        if (!user) {
            return;
        }
        const post = yield Post_1.default.find({ author: user._id });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            post,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getUserPost = getUserPost;
// Get Tagged In Posts
const getTaggedInPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
// Get Post by id and comment fill with users username and pic
const getPostwithCommment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const post = yield Post_1.default.findOne({ _id: postId });
        if (!post) {
            return;
        }
        const comment = yield Promise.all(post.comments.map((ct) => __awaiter(void 0, void 0, void 0, function* () {
            const comment = yield Comment_1.default.findById(ct);
            const user = yield User_1.User.findById(comment === null || comment === void 0 ? void 0 : comment.author, {
                username: true,
                image: true,
            });
            return {
                user,
                comment,
            };
        })));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "",
            comment,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getPostwithCommment = getPostwithCommment;
