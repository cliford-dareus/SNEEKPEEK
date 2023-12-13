"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated "));
const router = express_1.default.Router();
router.route("/signup").post(auth_1.signUp);
router.route("/signin").post(auth_1.signIn);
router.route("/signout").post(isAuthenticated_1.default, auth_1.signOut);
router.route("/refresh-token").post(auth_1.refreshTokenFn);
router.route("/resetpassword").post(isAuthenticated_1.default, auth_1.resetPassword);
exports.default = router;
