import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_PLANET: "CREATE_PLANET",
    SEND_PLANET_MESSAGE: "SEND_PLANET_MESSAGE",
    JOIN_PLANET: "JOIN_PLANET",
  },
  SERVER: {
    PLANETS: "PLANETS",
    JOINED_PLANET: "JOINED_PLANET",
    PLANET_MESSAGE: "PLANET_MESSAGE",
  },
};

const planets: Record<string, { name: string }> = {};

const socket = (io: Server) => {
  console.log("Sockets start");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`Client connected to id: ${socket.id}`);
    socket.emit(EVENTS.SERVER.PLANETS, planets);

    socket.on(EVENTS.CLIENT.CREATE_PLANET, ({ planetName }) => {
      console.log("Create planet:", planetName);
      const planetId = uuidv4();

      planets[planetId] = {
        name: planetName,
      };

      socket.join(planetId);
      io.emit(EVENTS.SERVER.PLANETS, planets);
      socket.emit(EVENTS.SERVER.JOINED_PLANET, planetId);
    });

    socket.on(
      EVENTS.CLIENT.SEND_PLANET_MESSAGE,
      ({ planetId, message, username }) => {
        console.log(`[Message] From ${username} in room ${planetId}: ${message}`);
        const date = new Date();
        const msgData = {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        };
        
        // Отправляем ВСЕМ в комнате (включая отправителя)
        io.to(planetId).emit(EVENTS.SERVER.PLANET_MESSAGE, msgData);
      }
    );

    socket.on(EVENTS.CLIENT.JOIN_PLANET, (planetId) => {
      console.log(`Client ${socket.id} joined room: ${planetId}`);
      socket.join(planetId);
      socket.emit(EVENTS.SERVER.JOINED_PLANET, planetId);
    });
  });
};

export default socket;