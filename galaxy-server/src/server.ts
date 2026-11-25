import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "config";
import socket from "./socket";

const port = config.get<number>("port");
const host = config.get<string>("host");

const app = express();
const httpServer = createServer(app);

// Настройка CORS для разрешения подключения с клиента
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (_, res) => res.send("Server OK"));

httpServer.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
  socket(io); // <--- Вот здесь убрали фигурные скобки!
});