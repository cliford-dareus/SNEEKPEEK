"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated "));
const comment_1 = require("../controller/comment");
const router = express_1.default.Router();
router.route('/').post(isAuthenticated_1.default, comment_1.postComment);
exports.default = router;
