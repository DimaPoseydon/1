import { useState } from 'react';
import { useGalaxy } from '../context/GalaxyContext';
import { PlanetScene } from './PlanetScene';
import { InvitePanel } from './InvitePanel'; // NEW

export function Chat() {
  const { currentPlanet, messages, sendMessage, leavePlanet, username } = useGalaxy();
  const [text, setText] = useState('');

  if (!currentPlanet) return null;

  const submit = () => {
    if (text.trim()) { sendMessage(text.trim()); setText(''); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <h2>🪐 {currentPlanet.name}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <InvitePanel />{/* NEW */}
          <button onClick={leavePlanet} style={{ padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>
            ← Назад
          </button>
        </div>
      </div>

      <PlanetScene color={currentPlanet.color} />

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.username === username ? 'flex-end' : 'flex-start', background: m.username === username ? '#2a3b8f' : '#1a1c33', padding: '6px 12px', borderRadius: 10, maxWidth: '70%' }}>
            <div style={{ fontSize: 11, opacity: 0.6 }}>{m.username}</div>
            <div>{m.message}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Сообщение..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff' }}
        />
        <button onClick={submit} style={{ padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>→</button>
      </div>
    </div>
  );
}