// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { connectDB } from "./database/connection";
import http from "http";
import SocketService from "./socket/socketService";
import dotenv from "dotenv";

dotenv.config();
export default class App {
  public app: Application;
  private port: number;
  private server: http.Server;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();

    // Create HTTP server for socket
    this.server = http.createServer(this.app);

    // Initialize DB connection
    connectDB();

    // Initialize socket
    // SocketService.getInstance().init(this.server);
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  private initializeRoutes(): void {
    this.app.use("/api", routes);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`🚀 Server running at http://localhost:${this.port}`);
    });
  }
}
