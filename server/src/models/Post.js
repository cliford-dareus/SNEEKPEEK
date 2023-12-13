"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        max: 500,
    },
    image: { type: String },
    likes: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose_1.default.Types.ObjectId, ref: "Comment" }],
    featured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
