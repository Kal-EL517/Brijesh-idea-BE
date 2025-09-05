// src/socket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { registerChatHandlers } from "./handlers/chat.handler";

class SocketService {
    private static instance: SocketService;
    private io!: Server;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public init(server: HttpServer): void {
        this.io = new Server(server, {
            pingInterval: 10000, // send ping every 10s
            pingTimeout: 5000, 
            cors: {
                origin: "*", // update with your frontend URL
                methods: ["GET", "POST"]
            }
        });

        this.io.use((socket, next) => {
            console.log("Incoming connection:", socket.id);

            // Example: checking for token in handshake
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;
            console.log(socket.handshake);
            
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            // (TODO: Verify JWT here)
            try {
                // const payload = jwt.verify(token, process.env.JWT_SECRET);
                // socket.data.user = payload; // attach user data
                next(); // allow connection
            } catch (err) {
                next(new Error("Authentication error: Invalid token"));
            }
        });

        this.io.on("connection", (socket) => {
            console.log(`⚡: User connected -> ${socket.id}`);

            registerChatHandlers(this.io, socket);
            //   socket.on("message", (data) => {
            //     console.log("📩 Message received:", data);
            //     // broadcast to all clients
            //     this.io.emit("recieved", data);
            //   });

            socket.on("disconnect", () => {
                console.log(`❌: User disconnected -> ${socket.id}`);
            });
        });
    }

    public getIO(): Server {
        if (!this.io) {
            throw new Error("Socket.io is not initialized!");
        }
        return this.io;
    }

}

export default SocketService;
