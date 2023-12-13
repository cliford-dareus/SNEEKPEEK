"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated "));
const router = express_1.default.Router();
router.route("/").get(user_1.searchUser);
router.route("/single/:id").get(user_1.getUser);
router.route('/:username').get(user_1.getUserByName);
router.route("/update").patch(isAuthenticated_1.default, user_1.editUser);
router.route("/follow/:username").post(isAuthenticated_1.default, user_1.followUser);
router
    .route("/accept-request/:userToAcceptId")
    .post(isAuthenticated_1.default, user_1.acceptRequest);
router
    .route("/decline-request/:userToAcceptId")
    .post(isAuthenticated_1.default, user_1.declineRequest);
exports.default = router;
