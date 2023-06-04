import expres from "express";
import isAuthenticated from "../middleware/isAuthenticated ";
import {
  createPost,
  deletePost,
  editPost,
  likeOrUnlikePost,
} from "../controller/post";

const router = expres.Router();

router.route("/").post(isAuthenticated, createPost);
router.route("/edit").patch(isAuthenticated, editPost);
router
  .route("/:postId")
  .delete(isAuthenticated, deletePost)
  .patch(isAuthenticated, likeOrUnlikePost);

export default router;
