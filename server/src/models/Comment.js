"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    author: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    content: { type: String, max: 300 },
    likes: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
const Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.default = Comment;
