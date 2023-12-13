"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserIdentity = void 0;
const http_status_codes_1 = require("http-status-codes");
const checkUserIdentity = ({ userTofollowId, currentUserId, res, }) => {
    if (userTofollowId === currentUserId) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "You can't follow yourself",
        });
    }
};
exports.checkUserIdentity = checkUserIdentity;
