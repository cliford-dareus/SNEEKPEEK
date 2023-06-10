import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const IO = (
  ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  ioServer.on("connection", (socket) => {
    console.log('SOCKET ID ' + socket);

    
  });
};

export default IO;
