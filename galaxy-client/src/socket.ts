import { io, Socket } from 'socket.io-client';

export const SERVER_URL = 'http://localhost:4000';

export const socket: Socket = io(SERVER_URL, { autoConnect: false });

export const EVENTS = {
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

// Авто-присоединение по ссылке-приглашению вида http://localhost:3000/?planet=ABCD1234
socket.on("connect", () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("planet");
  if (!code) return;

  socket.emit(EVENTS.CLIENT.JOIN_PLANET_BY_CODE, { code });

  // Убираем ?planet=... из адресной строки, чтобы при F5 не джойнило повторно
  const url = new URL(window.location.href);
  url.searchParams.delete("planet");
  window.history.replaceState({}, "", url.toString());
});

socket.on(EVENTS.SERVER.JOIN_ERROR, (payload: { message: string }) => {
  console.warn("[Galaxy] join error:", payload.message);
});