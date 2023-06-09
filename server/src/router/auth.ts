import expres from "express";
import {
  refreshTokenFn,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "../controller/auth";
import isAuthenticated from "../middleware/isAuthenticated ";

const router = expres.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/signout").post(isAuthenticated, signOut);
router.route("/refresh-token").post(refreshTokenFn);
router.route("/resetpassword").post(isAuthenticated, resetPassword);

export default router;
