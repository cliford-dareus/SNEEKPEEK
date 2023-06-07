import expres from "express";
import isAuthenticated from "../middleware/isAuthenticated ";
import {
  createPost,
  deletePost,
  editPost,
  getAllPost,
  getPostwithCommment,
  getUserPost,
  likeOrUnlikePost,
} from "../controller/post";

const router = expres.Router();

router.route("/").post(isAuthenticated, createPost).get(getAllPost);
router.route("/edit").patch(isAuthenticated, editPost);
router.route('/personal/:username').get(getUserPost)
router
  .route("/:postId")
  .delete(isAuthenticated, deletePost)
  .patch(isAuthenticated, likeOrUnlikePost)
  .get(getPostwithCommment);

export default router;
