import { io, Socket } from 'socket.io-client';

export const SERVER_URL = 'http://localhost:4000'; // Проверьте порт вашего сервера

export const socket: Socket = io(SERVER_URL, { autoConnect: false });

export const EVENTS = {
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