// handlers/chat.handler.ts
import { Server, Socket } from "socket.io";

export function registerChatHandlers(io: Server, socket: Socket) {
  socket.on("message", (data) => {
    console.log("📩 Message received:", data);
    io.emit("received", data); // broadcast to all
  });
}
