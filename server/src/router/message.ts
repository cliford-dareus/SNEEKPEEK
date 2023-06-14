import express from "express";
import isAuthenticated from "../middleware/isAuthenticated ";
import {
  addNewMessage,
  getAllMessage,
  updateMessageStatus,
} from "../controller/message";

const router = express.Router();

router
  .route("/:id")
  .get(isAuthenticated, getAllMessage)
  .post(isAuthenticated, addNewMessage);

router.route("/status/:channelId").patch(isAuthenticated, updateMessageStatus);

export default router;
