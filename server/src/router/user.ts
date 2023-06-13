import expres from "express";
import {
  acceptRequest,
  declineRequest,
  editUser,
  followUser,
  getUser,
  getUserByName,
  searchUser,
} from "../controller/user";
import isAuthenticated from "../middleware/isAuthenticated ";

const router = expres.Router();

router.route("/").get(searchUser);
router.route("/single/:id").get(getUser);
router.route('/:username').get(getUserByName)
router.route("/update").patch(isAuthenticated, editUser);
router.route("/follow/:username").post(isAuthenticated, followUser);
router
  .route("/accept-request/:userToAcceptId")
  .post(isAuthenticated, acceptRequest);
router
  .route("/decline-request/:userToAcceptId")
  .post(isAuthenticated, declineRequest);

export default router;
