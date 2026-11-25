import ReactDOM from 'react-dom/client';
import App from './App';
import { GalaxyProvider } from './context/GalaxyContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GalaxyProvider>
    <App />
  </GalaxyProvider>
);