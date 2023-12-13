"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = (ioServer) => {
    ioServer.on("connection", (socket) => {
        // @ts-ignore
        console.log(`⚡: ${socket.username} ${socket.userId}user just connected!`);
        // @ts-ignore
        socket.join(socket.userId + socket.username);
        console.log(socket.rooms);
        socket.on("private_message", ({ sender, reciever, message }) => {
            const room = sender.userId + sender.username;
            const room2 = reciever.userId + reciever.username;
            console.log("ROOM 1 " + room + " ROOM 2 " + room2);
            socket
                .to([room, room2])
                .emit("private_message", { sender, reciever, message });
        });
        socket.on("notification", ({ sender, target, type, message }) => {
            const room = sender.userId + sender.username;
            const room2 = target.userId + target.username;
            console.log("ROOM 1 " + room + " ROOM 2 " + room2);
            socket
                .to([room, room2])
                .emit("notification", { sender, target, type, message });
        });
        socket.on("disconnect", () => {
            // @ts-ignore
            console.log(socket.username + "disconnect");
            socket.disconnect();
        });
    });
};
exports.default = IO;
