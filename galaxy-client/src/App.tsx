import { useGalaxy } from './context/GalaxyContext';
import { Login } from './components/Login';
import { PlanetList } from './components/PlanetList';
import { Chat } from './components/Chat';

export default function App() {
  const { username, currentPlanet } = useGalaxy();

  if (!username) return <Login />;
  if (!currentPlanet) return <PlanetList />;
  return <Chat />;
}