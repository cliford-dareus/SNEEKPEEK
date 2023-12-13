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
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const Token_1 = require("../models/Token");
const User_1 = require("../models/User");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.signedCookies;
        const authToken = req.get("Authorization");
        const accessToken = authToken === null || authToken === void 0 ? void 0 : authToken.split("Bearer ")[1];
        if (!accessToken || !refreshToken) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json("UNAUTHORIZED");
        }
        const decodedRefreshToken = (0, jwt_1.jwtVerify)({ payload: refreshToken });
        const isRefreshToken = yield Token_1.Token.findOne({
            refreshToken: decodedRefreshToken.refreshToken,
        });
        if (!isRefreshToken) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        const user = yield User_1.User.findOne({
            _id: decodedRefreshToken.user.userId,
        });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
            });
        }
        req.user = user === null || user === void 0 ? void 0 : user._id;
        next();
    }
    catch (error) { }
});
exports.default = isAuthenticated;
