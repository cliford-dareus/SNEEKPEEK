"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessagesSchema = new mongoose_1.default.Schema({
    channelId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    messages: {
        type: [
            {
                status: String,
                content: String,
                sender: {
                    type: mongoose_1.default.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
    },
}, { timestamps: true });
const Messages = mongoose_1.default.model("Messages", MessagesSchema);
exports.default = Messages;
