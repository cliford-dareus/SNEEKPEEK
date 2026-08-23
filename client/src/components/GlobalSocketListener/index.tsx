import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/slice/authSlice";
import {
  incrementSocialUnread,
  messageReceived,
} from "../../features/slice/inboxSlice";
import { socket, socketConnect } from "../../lib/socket/config";
import { notificationApi } from "../../features/api/notification";

/**
 * Listens for private messages and social notifications app-wide.
 * Toasts + badge when the user is not already in that chat thread.
 */
const GlobalSocketListener = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();

  const isAuthed = Boolean(user.token && user.user?.userId);

  // Keep socket connected while authenticated
  useEffect(() => {
    if (!isAuthed) return;
    socketConnect(user);
  }, [isAuthed, user.user?.userId, user.user?.username, user.token]);

  useEffect(() => {
    if (!isAuthed) return;

    const onPrivateMessage = ({
      sender,
      reciever,
      message,
    }: {
      sender: { userId?: string; username: string; _id?: string };
      reciever: { userId?: string; username: string };
      message: string;
    }) => {
      const myName = user.user?.username;
      if (!myName || reciever.username !== myName) return;
      // Ignore our own echoes
      if (sender.username === myName) return;

      const path = location.pathname;
      // Active chat with this sender: /messages/chat/:name/:id
      const inThisChat =
        path.includes("/messages/chat/") &&
        path.split("/")[3] === sender.username;

      if (inThisChat) return;

      dispatch(
        messageReceived({
          fromUserId: String(sender.userId || sender._id || ""),
          fromUsername: sender.username,
          preview: message,
        })
      );

      toast(`New message from @${sender.username}`, {
        icon: "💬",
        duration: 4000,
      });
    };

    const onNotification = ({
      sender,
      target,
      message,
      type,
    }: {
      sender: { username: string; userId: string };
      target: { userId: string };
      message?: string;
      type?: string;
    }) => {
      if (String(target.userId) !== String(user.user?.userId)) return;

      dispatch(incrementSocialUnread());
      dispatch(notificationApi.util.invalidateTags(["Notification"]));

      const text = message || type || "sent you a notification";
      toast(`@${sender.username} ${text}`, { icon: "🔔", duration: 4000 });
    };

    socket.on("private_message", onPrivateMessage);
    socket.on("notification", onNotification);

    return () => {
      socket.off("private_message", onPrivateMessage);
      socket.off("notification", onNotification);
    };
  }, [
    isAuthed,
    user.user?.userId,
    user.user?.username,
    location.pathname,
    dispatch,
  ]);

  return null;
};

export default GlobalSocketListener;
