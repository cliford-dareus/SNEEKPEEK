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
exports.updateMessageStatus = exports.getAllMessage = exports.addNewMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const Messages_1 = __importDefault(require("../models/Messages"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const addNewMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const msg = req.body;
        const conversation = yield Messages_1.default.findOne({ channelId: id });
        const channel = yield Conversation_1.default.findOne({ _id: id });
        console.log(channel);
        if (!channel) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                error: "Channel not found",
            });
        }
        if (conversation) {
            conversation.messages = [...conversation.messages, msg];
            yield conversation.save();
            channel.lastmessage = msg.content;
            yield channel.save();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                conversation,
            });
        }
        const newConversation = yield Messages_1.default.create({
            channelId: id,
            messages: [msg],
        });
        channel.lastmessage = msg.content;
        yield channel.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            conversation: newConversation,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.addNewMessage = addNewMessage;
const getAllMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield Messages_1.default.findOne({ channelId: id })
            .populate("messages.sender", ["_id", "username"])
            .populate("channelId");
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getAllMessage = getAllMessage;
const updateMessageStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { channelId } = req.params;
        const { status } = req.query;
        yield Messages_1.default.updateMany({ channelId }, { $set: { "messages.$[elem].status": status } }, { arrayFilters: [{ "elem.status": "DELIVERED" }] });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.updateMessageStatus = updateMessageStatus;
