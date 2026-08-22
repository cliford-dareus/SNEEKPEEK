import expres from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import {
  createPost,
  deletePost,
  editPost,
  getAllPost,
  getPostwithCommment,
  getTaggedInPosts,
  getTrendingPosts,
  getUserPost,
  likeOrUnlikePost,
} from "../controller/post";

const router = expres.Router();

router.route("/").post(isAuthenticated, createPost).get(getAllPost);
router.route("/edit").patch(isAuthenticated, editPost);
router.route("/trending").get(getTrendingPosts);
router.route("/personal/:username").get(getUserPost);
router.route("/tagged/:username").get(getTaggedInPosts);
router
  .route("/:postId")
  .delete(isAuthenticated, deletePost)
  .patch(isAuthenticated, likeOrUnlikePost)
  .get(getPostwithCommment);

export default router;
