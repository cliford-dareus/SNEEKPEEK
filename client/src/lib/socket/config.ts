import { io } from "socket.io-client";
import { IAuthInitialState } from "../../utils/types/types";

const URL =
  (import.meta as any).env?.VITE_SOCKET_URL ||
  "https://sneekpeek.onrender.com/";

const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

const socketConnect = (user: IAuthInitialState) => {
  if (!user.user?.userId || !user.user?.username) return;

  socket.auth = {
    id: String(user.user.userId),
    name: String(user.user.username),
  };

  if (socket.connected) {
    socket.disconnect();
  }

  socket.connect();
};

export { socket, socketConnect };
