import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import {
  getNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controller/notification";

const router = express.Router();

router.route("/").get(isAuthenticated, getNotification);
router.route("/read-all").patch(isAuthenticated, markAllNotificationsRead);
router.route("/:id/read").patch(isAuthenticated, markNotificationRead);

export default router;
