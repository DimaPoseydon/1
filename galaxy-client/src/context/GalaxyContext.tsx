import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { socket, EVENTS } from '../socket';
import { Planet, Message } from '../types';

interface GalaxyContextValue {
  connected: boolean;
  username: string | null;
  planets: Planet[];
  currentPlanet: Planet | null;
  messages: Message[];
  login: (name: string) => void;
  joinPlanet: (planetId: string) => void;
  leavePlanet: () => void;
  sendMessage: (text: string) => void;
  createPlanet: (name: string) => void;
}

const GalaxyContext = createContext<GalaxyContextValue | null>(null);

export function GalaxyProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected to server');
      setConnected(true);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socket.on(EVENTS.SERVER.PLANETS, (data: Record<string, { name: string }>) => {
      console.log('Received planets:', data);
      const list = Object.keys(data).map(id => ({ id, name: data[id].name }));
      setPlanets(list);
    });

    socket.on(EVENTS.SERVER.JOINED_PLANET, (planetId: string) => {
      console.log('Joined planet ID:', planetId);
      setPlanets(prev => {
        const planet = prev.find(p => p.id === planetId);
        // Если сервер прислал ID, а планеты в списке еще нет (только что создали)
        // устанавливаем заглушку, чтобы интерфейс не сломался
        setCurrentPlanet(planet || { id: planetId, name: "Новая планета" });
        return prev;
      });
    });

    socket.on(EVENTS.SERVER.PLANET_MESSAGE, (msg: Message) => {
      console.log('Received message:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off(EVENTS.SERVER.PLANETS);
      socket.off(EVENTS.SERVER.JOINED_PLANET);
      socket.off(EVENTS.SERVER.PLANET_MESSAGE);
    };
  }, []);

  const login = (name: string) => {
    setUsername(name);
    if (!socket.connected) socket.connect();
  };

  const joinPlanet = (planetId: string) => {
    setMessages([]); // Очищаем историю сообщений при входе в новую планету
    socket.emit(EVENTS.CLIENT.JOIN_PLANET, planetId);
  };

  const leavePlanet = () => {
    setCurrentPlanet(null);
  };

  const sendMessage = (text: string) => {
    if (!currentPlanet || !username) return;
    
    console.log("Sending message:", { 
      planetId: currentPlanet.id, 
      message: text, 
      username 
    });

    socket.emit(EVENTS.CLIENT.SEND_PLANET_MESSAGE, {
      planetId: currentPlanet.id,
      message: text,
      username: username
    });
  };

  const createPlanet = (name: string) => {
    socket.emit(EVENTS.CLIENT.CREATE_PLANET, { planetName: name });
  };

  return (
    <GalaxyContext.Provider value={{ 
      connected, 
      username, 
      planets, 
      currentPlanet, 
      messages, 
      login, 
      joinPlanet, 
      leavePlanet, 
      sendMessage, 
      createPlanet 
    }}>
      {children}
    </GalaxyContext.Provider>
  );
}

export function useGalaxy() {
  const ctx = useContext(GalaxyContext);
  if (!ctx) throw new Error('useGalaxy must be used within GalaxyProvider');
  return ctx;
}