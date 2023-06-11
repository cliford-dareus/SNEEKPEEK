import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const IO = (
  ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  ioServer.on("connection", (socket) => {
    // @ts-ignore
    socket.join(socket.userId + socket.username);

    socket.on("private_message", ({ sender, reciever, message }) => {
      const room = sender.userId + sender.username;
      const room2 = reciever.userId + reciever.username
      
      socket.to([room2, room]).emit("private_message", { sender, reciever, message });
    });
  });
};

export default IO;
