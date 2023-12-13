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
exports.postComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const http_status_codes_1 = require("http-status-codes");
const Post_1 = __importDefault(require("../models/Post"));
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    try {
        const { postId, content } = req.body;
        if (!content) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_GATEWAY,
                message: "You can post empty comment",
            });
        }
        const post = yield Post_1.default.findOne({ _id: postId });
        if (!post) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_GATEWAY,
                message: "No Post with this id",
            });
        }
        const comment = yield Comment_1.default.create({
            author: id,
            content: content,
        });
        yield post.updateOne({ $push: { comments: comment._id } });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "comment posted",
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.postComment = postComment;
