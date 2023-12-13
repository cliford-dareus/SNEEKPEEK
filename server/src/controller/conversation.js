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
exports.getAllConversation = exports.createConversation = void 0;
const http_status_codes_1 = require("http-status-codes");
const Conversation_1 = __importDefault(require("../models/Conversation"));
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user;
        const { recieverId } = req.body;
        const hasConversated = yield Conversation_1.default.findOne({
            users: {
                $all: [currentUser, recieverId],
            },
        });
        if (hasConversated) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                conversation: hasConversated,
            });
        }
        const conversation = yield Conversation_1.default.create({
            users: [currentUser, recieverId],
            lastmessage: 'Empty'
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            conversation,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.createConversation = createConversation;
const getAllConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user;
        const conversation = yield Conversation_1.default.find({
            users: {
                $in: [currentUser],
            },
        })
            .sort({ updatedAt: -1 })
            .populate("users", ["username", "_id", "image"]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            conversation,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getAllConversation = getAllConversation;
