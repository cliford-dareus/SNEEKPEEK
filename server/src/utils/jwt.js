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
exports.clearRefreshToken = exports.createAccessToken = exports.attachCookiesToResponse = exports.jwtVerify = void 0;
const ms_1 = __importDefault(require("ms"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token_1 = require("../models/Token");
const jwtVerify = ({ payload }) => {
    return jsonwebtoken_1.default.verify(payload, process.env.JWT_SECRET);
};
exports.jwtVerify = jwtVerify;
const createJWT = ({ payload }) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
    return token;
};
const attachCookiesToResponse = ({ res, user, refreshToken, }) => {
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
    res.cookie("refreshToken", refreshTokenJWT, {
        httpOnly: true,
        secure: false,
        signed: true,
        expires: new Date(Date.now() + (0, ms_1.default)("1d")),
    });
};
exports.attachCookiesToResponse = attachCookiesToResponse;
const createAccessToken = (user) => {
    return createJWT({ payload: { user } });
};
exports.createAccessToken = createAccessToken;
const clearRefreshToken = (req, res, isExist) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.signedCookies;
    if (refreshToken && isExist) {
        const decodedRefreshToken = (0, exports.jwtVerify)({ payload: refreshToken });
        yield Token_1.Token.findOneAndDelete({
            refreshToken: decodedRefreshToken === null || decodedRefreshToken === void 0 ? void 0 : decodedRefreshToken.refreshToken,
        });
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        signed: true,
    });
});
exports.clearRefreshToken = clearRefreshToken;
