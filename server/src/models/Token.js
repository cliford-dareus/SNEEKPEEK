"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    refreshToken: {
        type: String,
        required: true,
    },
    isValid: {
        type: Boolean,
        default: true,
    },
    expirationTime: {
        type: String,
    },
}, { timestamps: true });
exports.Token = mongoose_1.default.model("Token", TokenSchema);