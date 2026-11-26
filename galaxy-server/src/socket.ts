import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_PLANET: "CREATE_PLANET",
    SEND_PLANET_MESSAGE: "SEND_PLANET_MESSAGE",
    JOIN_PLANET: "JOIN_PLANET",
    JOIN_PLANET_BY_CODE: "JOIN_PLANET_BY_CODE",
    GET_INVITE_CODE: "GET_INVITE_CODE",
  },
  SERVER: {
    PLANETS: "PLANETS",
    JOINED_PLANET: "JOINED_PLANET",
    PLANET_MESSAGE: "PLANET_MESSAGE",
    INVITE_CODE: "INVITE_CODE",
    JOIN_ERROR: "JOIN_ERROR",
  },
};

interface PlanetData {
  name: string;
  inviteCode: string;
}

const planets: Record<string, PlanetData> = {};
const planetsByCode: Record<string, string> = {};

function generateInviteCode(): string {
  let code: string;
  do {
    code = randomBytes(4).toString("hex").toUpperCase(); // 8 hex-символов
  } while (planetsByCode[code]);
  return code;
}

const socket = (io: Server) => {
  console.log("Sockets start");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`Client connected to id: ${socket.id}`);
    socket.emit(EVENTS.SERVER.PLANETS, planets);

    socket.on(EVENTS.CLIENT.CREATE_PLANET, ({ planetName }) => {
      console.log("Create planet:", planetName);
      const planetId = uuidv4();
      const inviteCode = generateInviteCode();

      planets[planetId] = { name: planetName, inviteCode };
      planetsByCode[inviteCode] = planetId;

      socket.join(planetId);
      io.emit(EVENTS.SERVER.PLANETS, planets);
      socket.emit(EVENTS.SERVER.JOINED_PLANET, planetId);
      socket.emit(EVENTS.SERVER.INVITE_CODE, { planetId, inviteCode });
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
        io.to(planetId).emit(EVENTS.SERVER.PLANET_MESSAGE, msgData);
      }
    );

    socket.on(EVENTS.CLIENT.JOIN_PLANET, (planetId) => {
      console.log(`Client ${socket.id} joined room: ${planetId}`);
      socket.join(planetId);
      socket.emit(EVENTS.SERVER.JOINED_PLANET, planetId);
    });

    socket.on(
      EVENTS.CLIENT.JOIN_PLANET_BY_CODE,
      ({ code }: { code: string }) => {
        const normalized = String(code || "").trim().toUpperCase();
        const planetId = planetsByCode[normalized];
        if (!planetId) {
          socket.emit(EVENTS.SERVER.JOIN_ERROR, {
            message: "Планета с таким кодом не найдена",
          });
          return;
        }
        socket.join(planetId);
        socket.emit(EVENTS.SERVER.JOINED_PLANET, planetId);
        socket.emit(EVENTS.SERVER.INVITE_CODE, { planetId, inviteCode: normalized });
      }
    );

    socket.on(
      EVENTS.CLIENT.GET_INVITE_CODE,
      ({ planetId }: { planetId: string }) => {
        const planet = planets[planetId];
        if (planet) {
          socket.emit(EVENTS.SERVER.INVITE_CODE, {
            planetId,
            inviteCode: planet.inviteCode,
          });
        }
      }
    );
  });
};

export default socket;