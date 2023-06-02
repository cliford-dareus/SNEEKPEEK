import expres from "express";
import { signIn, signUp } from "../controller/auth";

const router = expres.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

export default router;
