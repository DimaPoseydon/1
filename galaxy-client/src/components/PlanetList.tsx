import { useState } from 'react';
import { useGalaxy } from '../context/GalaxyContext';

export function PlanetList() {
  const { planets, joinPlanet, createPlanet } = useGalaxy();
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      createPlanet(newName.trim());
      setNewName('');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2>Планеты</h2>
      
      {/* Форма создания новой планеты */}
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Новая планета..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: '1px solid #333',
            background: '#111',
            color: '#fff',
          }}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Создать
        </button>
      </div>

      {/* Список планет */}
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {planets.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => joinPlanet(p.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: 12,
                borderRadius: 8,
                background: '#12142a',
                color: '#e8e8ff',
                border: '1px solid #23264a',
                cursor: 'pointer',
              }}
            >
              🪐 {p.name}
            </button>
          </li>
        ))}
        {planets.length === 0 && (
          <li style={{ opacity: 0.5 }}>Пока нет планет — создайте первую!</li>
        )}
      </ul>
    </div>
  );
}