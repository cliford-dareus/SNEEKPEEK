"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConversationSchema = new mongoose_1.default.Schema({
    users: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
        },
    ],
    lastmessage: {
        type: String,
    },
}, { timestamps: true });
const Conversation = mongoose_1.default.model("Conversation", ConversationSchema);
exports.default = Conversation;
