import expres from "express";
import {
  acceptRequest,
  declineRequest,
  editUser,
  followUser,
  getUser,
  searchUser,
} from "../controller/user";
import isAuthenticated from "../middleware/isAuthenticated ";

const router = expres.Router();

router.route("/").get(searchUser);
router.route("/:id").get(getUser);
router.route("/update").patch(isAuthenticated, editUser);
router.route("/request/:username").post(followUser);
router
  .route("/accept-request/:userToAcceptId")
  .post(isAuthenticated, acceptRequest);
router
  .route("/decline-request/:userToAcceptId")
  .post(isAuthenticated, declineRequest);

export default router;
