import { useState } from 'react';
import { useGalaxy } from '../context/GalaxyContext';

export function Login() {
  const { login, connected } = useGalaxy();
  const [name, setName] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 120 }}>
      <h1>🌌 Galaxy Chat</h1>
      <p style={{ opacity: 0.7 }}>Войдите, чтобы выбрать планету</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ваше имя"
        style={{ padding: 10, borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff' }}
      />
      <button
        onClick={() => name.trim() && login(name.trim())}
        disabled={!name.trim()}
        style={{ padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}
      >
        Войти
      </button>
      <small style={{ opacity: 0.5 }}>{connected ? '🟢 online' : '⚪ offline'}</small>
    </div>
  );
}