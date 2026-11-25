export interface Planet {
  id: string;
  name: string;
  color?: string;
}

export interface Message {
  id: string;
  planetId: string;
  planetName: string;
  username: string;
  message: string; // В сервере используется 'message', а не 'text'
  timestamp?: number;
}