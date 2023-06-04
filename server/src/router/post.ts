import expres from "express";
import isAuthenticated from "../middleware/isAuthenticated ";
import {
  createPost,
  deletePost,
  editPost,
  getAllPost,
  likeOrUnlikePost,
} from "../controller/post";

const router = expres.Router();

router.route("/").post(isAuthenticated, createPost).get(getAllPost);
router.route("/edit").patch(isAuthenticated, editPost);
router
  .route("/:postId")
  .delete(isAuthenticated, deletePost)
  .patch(isAuthenticated, likeOrUnlikePost);

export default router;
