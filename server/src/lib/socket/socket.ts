import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const roomFor = (userId: string, username: string) =>
  `${String(userId)}:${String(username)}`;

const IO = (
  ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  ioServer.on("connection", (socket: Socket) => {
    // @ts-ignore
    const userId = String(socket.userId || "");
    // @ts-ignore
    const username = String(socket.username || "");

    const myRoom = roomFor(userId, username);
    socket.join(myRoom);

    socket.on("private_message", ({ sender, reciever, message }) => {
      if (!sender?.userId || !reciever?.userId) return;

      const room1 = roomFor(sender.userId, sender.username);
      const room2 = roomFor(reciever.userId, reciever.username);

      ioServer
        .to([room1, room2])
        .emit("private_message", { sender, reciever, message });
    });

    // Relay only — persistence is handled by REST controllers
    socket.on("notification", ({ sender, target, type, message }) => {
      if (!target?.userId || !target?.username) return;

      const targetRoom = roomFor(target.userId, target.username);

      ioServer.to(targetRoom).emit("notification", {
        sender,
        target,
        type: type || "GENERAL",
        message: message || "",
      });
    });

    socket.on("disconnect", () => {
      socket.leave(myRoom);
    });
  });
};

export default IO;
export { roomFor };
