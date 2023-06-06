import expres from "express";
import {
    getUser
} from "../controller/user";
import isAuthenticated from "../middleware/isAuthenticated ";

const router = expres.Router();

router.route("/:id").get(getUser);


export default router;
