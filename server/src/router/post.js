"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated "));
const post_1 = require("../controller/post");
const router = express_1.default.Router();
router.route("/").post(isAuthenticated_1.default, post_1.createPost).get(post_1.getAllPost);
router.route("/edit").patch(isAuthenticated_1.default, post_1.editPost);
router.route('/personal/:username').get(post_1.getUserPost);
router
    .route("/:postId")
    .delete(isAuthenticated_1.default, post_1.deletePost)
    .patch(isAuthenticated_1.default, post_1.likeOrUnlikePost)
    .get(post_1.getPostwithCommment);
exports.default = router;
