import expres from "express";
import { signUp } from "../controller/auth";

const router = expres.Router();

router.route("/signup").post(signUp);

export default router;
