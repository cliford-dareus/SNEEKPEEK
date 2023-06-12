import express from "express";
import isAuthenticated from "../middleware/isAuthenticated ";
import {
  createConversation,
  getAllConversation,
} from "../controller/conversation";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, getAllConversation)
  .post(isAuthenticated, createConversation);

export default router;
