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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.editUser = exports.getUserByName = exports.getUser = exports.declineRequest = exports.acceptRequest = exports.followUser = void 0;
const User_1 = require("../models/User");
const http_status_codes_1 = require("http-status-codes");
const checkUserIdentity_1 = require("../utils/checkUserIdentity");
const Notifications_1 = __importDefault(require("../models/Notifications"));
// Get User by id
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.User.findOne({ _id: id });
        if (!user) {
            throw new Error("user does not exist");
        }
        const { password, __v } = user, otherInfo = __rest(user, ["password", "__v"]);
        res.status(200).send({
            status: "success",
            message: "user info",
            user: otherInfo,
        });
    }
    catch (e) {
        res.status(500).send({
            status: "failure",
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getUser = getUser;
// Get User by username
const getUserByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        console.log(username);
        if (!username) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Please Enter an Username!",
            });
        }
        const user = yield User_1.User.findOne({ username })
            .populate("request", ["_id", "username", "image"])
            .populate("followers", ["_id", "username", "image"])
            .populate("followings", ["_id", "username", "image"]);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exit!",
            });
        }
        const _a = user.toObject(), { password, __v, email } = _a, other = __rest(_a, ["password", "__v", "email"]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            user: other,
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.getUserByName = getUserByName;
// Search User
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, sort, limit = 10 } = req.query;
        let searchTerm = {};
        console.log(username);
        if (username) {
            searchTerm.username = { $regex: username, $options: "i" };
        }
        let sortTerm = "";
        if (sort) {
            sortTerm = sort === null || sort === void 0 ? void 0 : sort.toString().split(",").join(" ");
        }
        else {
            sortTerm = "asc";
        }
        const users = yield User_1.User.find(searchTerm)
            .limit(Number(limit))
            .sort(sortTerm)
            .select("id username image");
        if (!users) {
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            users,
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.searchUser = searchUser;
// Edit User
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { newUsername, newImage } = req.body;
        if (!newUsername && !newImage) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "You must provide something new to update!",
            });
        }
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User account not found!",
            });
        }
        if (newUsername) {
            user.username = newUsername;
            user.save();
            res.status(200).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: `User Profile updated`,
            });
        }
        if (newImage) {
            user.image = newImage;
            user.save();
            res.status(200).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: `User Profile updated`,
            });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.editUser = editUser;
// Follow User
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const id = req.user;
    try {
        const userToFollow = yield User_1.User.findOne({ username });
        if (!userToFollow) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
        (0, checkUserIdentity_1.checkUserIdentity)({
            userTofollowId: userToFollow._id,
            currentUserId: id,
            res,
        });
        yield userToFollow.updateOne({ $push: { request: id } });
        yield Notifications_1.default.create({
            sender: id,
            target: userToFollow._id,
            type: "REQUEST",
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Request sent",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.followUser = followUser;
// UnFollow User
// Accept Request
const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { userToAcceptId } = req.params;
    try {
        const userToAccept = yield User_1.User.findOne({ _id: userToAcceptId });
        if (!userToAccept) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
        (0, checkUserIdentity_1.checkUserIdentity)({
            userTofollowId: userToAccept._id,
            currentUserId: id,
            res,
        });
        const currentUser = yield User_1.User.findOne({ _id: id });
        if (!currentUser) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
        if (!currentUser.request.includes(userToAccept._id)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
        yield currentUser.updateOne({
            $push: { followers: userToAccept._id },
            $pull: { request: userToAccept._id },
            $inc: { followersLength: 1 },
        });
        yield userToAccept.updateOne({
            $push: { followings: currentUser._id },
            $inc: { followingsLength: 1 },
        });
        yield Notifications_1.default.updateOne({ sender: userToAccept._id, target: currentUser._id }, { status: "READ" });
        console.log("USER ID 3" + userToAcceptId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Request accepted",
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.acceptRequest = acceptRequest;
// Decline Request
const declineRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user;
    const { userToAcceptId } = req.params;
    try {
        const userToAccept = yield User_1.User.findOne({ _id: userToAcceptId });
        if (!userToAccept) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
        (0, checkUserIdentity_1.checkUserIdentity)({
            userTofollowId: userToAccept._id,
            currentUserId: id,
            res,
        });
        const currentUser = yield User_1.User.findOne({ _id: id });
        if (!currentUser) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
        if (!currentUser.request.includes(userToAccept._id)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "User doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.declineRequest = declineRequest;
