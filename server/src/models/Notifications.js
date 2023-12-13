"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    target: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    type: { type: String },
    status: { type: String, default: "RECEIVED" },
}, { timestamps: true });
const Notification = mongoose_1.default.model("Notification", NotificationSchema);
exports.default = Notification;
