import { useEffect, useState } from 'react';
import { useGalaxy } from '../context/GalaxyContext';
import { socket, EVENTS } from '../socket';

export function InvitePanel() {
  const { currentPlanet } = useGalaxy();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentPlanet) return;
    const handler = (payload: { planetId: string; inviteCode: string }) => {
      if (payload.planetId === currentPlanet.id) setInviteCode(payload.inviteCode);
    };
    socket.on(EVENTS.SERVER.INVITE_CODE, handler);
    socket.emit(EVENTS.CLIENT.GET_INVITE_CODE, { planetId: currentPlanet.id });
    return () => {
      socket.off(EVENTS.SERVER.INVITE_CODE, handler);
    };
  }, [currentPlanet?.id]);

  const inviteLink = inviteCode
    ? `${window.location.origin}/?planet=${inviteCode}`
    : '';

  const copy = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: ничего, пользователь скопирует вручную
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}
      >
        🔗 Пригласить
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#15172b', padding: 24, borderRadius: 12, maxWidth: 440, width: '90%' }}
          >
            <h3 style={{ marginBottom: 12 }}>Пригласить на «{currentPlanet?.name}»</h3>
            <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 12 }}>
              Отправьте другу ссылку или код планеты:
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                readOnly
                value={inviteLink || 'Получаем код…'}
                onFocus={(e) => e.currentTarget.select()}
                style={{
                  flex: 1, padding: 8, borderRadius: 6,
                  border: '1px solid #333', background: '#0a0b1a', color: '#fff',
                }}
              />
              <button
                onClick={copy}
                disabled={!inviteLink}
                style={{ padding: '8px 12px', borderRadius: 6, cursor: inviteLink ? 'pointer' : 'not-allowed' }}
              >
                {copied ? '✓' : 'Копировать'}
              </button>
            </div>

            {inviteCode && (
              <p style={{ fontSize: 13, opacity: 0.7 }}>
                Код:{' '}
                <code style={{ background: '#0a0b1a', padding: '2px 6px', borderRadius: 4 }}>
                  {inviteCode}
                </code>
              </p>
            )}

            <button
              onClick={() => setOpen(false)}
              style={{ marginTop: 16, padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}