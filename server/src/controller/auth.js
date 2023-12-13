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
exports.resetPassword = exports.refreshTokenFn = exports.signOut = exports.signIn = exports.signUp = void 0;
const ms_1 = __importDefault(require("ms"));
const User_1 = require("../models/User");
const Token_1 = require("../models/Token");
const http_status_codes_1 = require("http-status-codes");
const createTokenUser_1 = __importDefault(require("../utils/createTokenUser"));
const jwt_1 = require("../utils/jwt");
// import { UserToken } from "../types/user.type";
const crypto_1 = __importDefault(require("crypto"));
// Sign Up
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
            });
        }
        const isUserExist = yield User_1.User.find({ email });
        if (!isUserExist) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).send({
                status: http_status_codes_1.StatusCodes.CONFLICT,
                message: http_status_codes_1.ReasonPhrases.CONFLICT,
            });
        }
        const user = yield User_1.User.create({
            name,
            username,
            email,
            password,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: http_status_codes_1.ReasonPhrases.CREATED,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.signUp = signUp;
//Sign In
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.User.findOne({ username });
        const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
        if (!isPasswordCorrect || !user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
            });
        }
        const UserToken = (0, createTokenUser_1.default)(user);
        let refreshToken = "";
        const isTokenExist = yield Token_1.Token.findOne({ userId: user._id });
        if (isTokenExist) {
            const { isValid } = isTokenExist;
            if (!isValid) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                });
            }
            refreshToken = isTokenExist === null || isTokenExist === void 0 ? void 0 : isTokenExist.refreshToken;
            (0, jwt_1.attachCookiesToResponse)({ res, user: UserToken, refreshToken });
            const accessToken = (0, jwt_1.createAccessToken)(UserToken);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                user: Object.assign(Object.assign({}, UserToken), { accessToken, expiresAt: new Date(Date.now() + (0, ms_1.default)("15m")) }),
            });
            return;
        }
        refreshToken = crypto_1.default.randomBytes(40).toString("hex");
        const tokenUser = {
            refreshToken,
            userId: user._id,
            expirationTime: new Date(Date.now() + (0, ms_1.default)("1d")).getTime(),
        };
        yield Token_1.Token.create(tokenUser);
        (0, jwt_1.attachCookiesToResponse)({ res, user: UserToken, refreshToken });
        const accessToken = (0, jwt_1.createAccessToken)(UserToken);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            user: Object.assign(Object.assign({}, UserToken), { accessToken, expiresAt: new Date(Date.now() + (0, ms_1.default)("15m")) }),
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.signIn = signIn;
//Sign Out
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const user = yield User_1.User.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
            });
        }
        yield Token_1.Token.findOneAndUpdate({ userId: user._id }, { refreshToken: "", expirationTime: "" });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            signed: true,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "User logged out",
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.signOut = signOut;
//RefreshToken
const refreshTokenFn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { refreshToken } = req.signedCookies;
    if (!refreshToken) {
        return res.status(http_status_codes_1.StatusCodes.NO_CONTENT);
    }
    try {
        const decodedRefreshToken = (0, jwt_1.jwtVerify)({ payload: refreshToken });
        const isTokenExist = yield Token_1.Token.findOne({
            refreshToken: decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.refreshToken,
        });
        if (!isTokenExist) {
            const isExist = false;
            yield (0, jwt_1.clearRefreshToken)(req, res, false);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
            });
        }
        try {
            const user = yield User_1.User.findOne({
                _id: (_a = decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.user) === null || _a === void 0 ? void 0 : _a.userId,
            });
            if (!user) {
                yield (0, jwt_1.clearRefreshToken)(req, res, true);
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const UserToken = { username: user.username, userId: user._id };
            const accessToken = (0, jwt_1.createAccessToken)(UserToken);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                user: Object.assign(Object.assign({}, UserToken), { accessToken, expiresAt: new Date(Date.now() + (0, ms_1.default)("15m")) }),
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.refreshTokenFn = refreshTokenFn;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Both fields are required...",
        });
    }
    try {
        const user = yield User_1.User.findOne({ _id: userId });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Invalid credentials",
            });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
        });
    }
});
exports.resetPassword = resetPassword;
