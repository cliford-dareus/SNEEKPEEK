import express from "express";
import isAuthenticated from "../middleware/isAuthenticated ";
import { addNewMessage, getAllMessage } from "../controller/message";

const router = express.Router();

router
  .route("/:id")
  .get(isAuthenticated, getAllMessage)
  .post(isAuthenticated, addNewMessage);

export default router;
