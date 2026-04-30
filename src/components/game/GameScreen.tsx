import { useState, useEffect } from 'react';
import { useGame } from '../../GameContext';
import { Player, PlayerCards } from '../../types';
import { TimerIcon, SettingsIcon, PlayIcon, PauseIcon } from '../Icons';

const CARD_ORDER = ['profession', 'health', 'hobby', 'luggage', 'phobia', 'skill', 'biology', 'extra'] as const;

const CARD_LABELS: Record<string, string> = {
  profession: 'Профессия',
  health: 'Здоровье',
  hobby: 'Хобби',
  luggage: 'Багаж',
  phobia: 'Фобия',
  skill: 'Навык',
  biology: 'Биология',
  extra: 'Доп. факт'
};

function FloatingTimer({ timerEndAt }: { timerEndAt: number | null; timerDuration: number | null }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    if (!timerEndAt) { 
      setTimeLeft(0); 
      setShowExpired(false);
      return; 
    }
    
    const update = () => {
      const left = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
      setTimeLeft(left);
      
      if (left === 0 && !showExpired) {
        setShowExpired(true);
        setTimeout(() => setShowExpired(false), 3000);
      }
    };
    
    update();
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [timerEndAt, showExpired]);

  if (!timerEndAt) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isUrgent = timeLeft <= 10;

  return (
    <>
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        background: 'linear-gradient(to top, rgba(0,0,0,0.98), rgba(0,0,0,0.85))',
        backdropFilter: 'blur(20px)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        borderTop: `2px solid ${isUrgent ? '#e74c3c' : 'rgba(212,175,55,0.5)'}`,
        animation: isUrgent ? 'pulse 1s infinite' : 'none'
      }}>
        <TimerIcon style={{ width: '32px', height: '32px', color: isUrgent ? '#e74c3c' : '#d4af37' }} />
        <div style={{ 
          fontSize: '56px', 
          fontWeight: 900, 
          color: isUrgent ? '#e74c3c' : '#d4af37',
          fontFamily: 'monospace',
          letterSpacing: '0.1em'
        }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>

      {showExpired && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.95)',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '140px',
            fontWeight: 900,
            color: '#e74c3c',
            fontFamily: 'monospace',
            animation: 'shake 0.5s ease-in-out 6'
          }}>
            00:00
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
      `}</style>
    </>
  );
}

function HostControls() {
  const { room, startTimer, stopTimer, startVoting, setPhase, restartGame } = useGame();
  const [showPanel, setShowPanel] = useState(false);
  const [customTimer, setCustomTimer] = useState(60);

  if (!room) return null;

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 50,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(212,175,55,0.5)',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          color: '#d4af37',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <SettingsIcon style={{ width: '28px', height: '28px' }} />
      </button>

      {showPanel && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '20px',
          zIndex: 50,
          width: '300px'
        }}>
          <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.3)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#d4af37' }}>
              ПАНЕЛЬ ВЕДУЩЕГО
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>Таймер:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
                  {[15, 30, 60, 120].map(t => (
                    <button
                      key={t}
                      onClick={() => setCustomTimer(t)}
                      className={customTimer === t ? 'card-gold' : 'card'}
                      style={{ padding: '8px 0', fontSize: '11px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => startTimer(customTimer)} className="btn btn-accent" style={{ padding: '10px', fontSize: '13px' }}>
                    <PlayIcon style={{ width: '14px', height: '14px' }} /> Старт
                  </button>
                  <button onClick={stopTimer} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
                    <PauseIcon style={{ width: '14px', height: '14px' }} /> Стоп
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setPhase('game')} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
                  Игра
                </button>
                <button onClick={() => startVoting()} className="btn btn-accent" style={{ padding: '10px', fontSize: '13px' }}>
                  Голосование
                </button>
                <button onClick={restartGame} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
                  Рестарт
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GameScreen() {
  const { room, isHost, myPlayerId, playerRevealCard } = useGame();

  if (!room) return null;

  const myPlayer = room.players.find(p => p.id === myPlayerId);
  const otherPlayers = room.players.filter(p => p.id !== myPlayerId);

  return (
    <div style={{ paddingBottom: room.timerEndAt ? '110px' : '20px' }}>
      <FloatingTimer timerEndAt={room.timerEndAt} timerDuration={room.timerDuration} />
      {isHost && <HostControls />}

      {/* Stats */}
      <div className="glass" style={{ 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Выживших</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>
            {room.players.filter(p => !p.isEliminated).length}
          </div>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Мест в бункере</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#d4af37' }}>
            {room.settings.bunkerCapacity}
          </div>
        </div>
      </div>

      {/* MY CARDS TABLE */}
      {myPlayer && myPlayer.cards && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#d4af37' }}>
            МОИ ХАРАКТЕРИСТИКИ
          </h2>
          <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#d4af37', width: '25%' }}>
                    ХАРАКТЕРИСТИКА
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#d4af37', width: '50%' }}>
                    ЗНАЧЕНИЕ
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#d4af37', width: '25%' }}>
                    ДЕЙСТВИЕ
                  </th>
                </tr>
              </thead>
              <tbody>
                {CARD_ORDER.map((cardKey, idx) => {
                  const card = (myPlayer.cards as PlayerCards)[cardKey];
                  return (
                    <tr key={cardKey} style={{ borderBottom: idx < CARD_ORDER.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#aaa' }}>
                        {CARD_LABELS[cardKey]}
                      </td>
                      <td style={{ padding: '16px', fontSize: '15px', color: '#fff', fontWeight: 500 }}>
                        {card.value || '???'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {card.revealed ? (
                          <span style={{ fontSize: '13px', color: '#2ecc71', fontWeight: 600 }}>✓ Раскрыто всем</span>
                        ) : (
                          <button 
                            onClick={() => playerRevealCard(cardKey)}
                            className="btn btn-accent"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            Раскрыть
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OTHER PLAYERS TABLE */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
          ДРУГИЕ ИГРОКИ ({otherPlayers.length})
        </h2>
        <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#aaa', width: '15%' }}>
                  ИМЯ
                </th>
                {CARD_ORDER.map(cardKey => (
                  <th key={cardKey} style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#888', width: '10.5%' }}>
                    {CARD_LABELS[cardKey]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {otherPlayers.map((player, idx) => {
                if (!player.cards) return null;
                return (
                  <tr key={player.id} style={{ 
                    borderBottom: idx < otherPlayers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    opacity: player.isEliminated ? 0.5 : 1
                  }}>
                    <td style={{ padding: '16px', fontSize: '15px', color: '#fff', fontWeight: 600 }}>
                      {player.name}
                      {player.isEliminated && <span style={{ fontSize: '12px', color: '#e74c3c', marginLeft: '8px' }}>(✗)</span>}
                    </td>
                    {CARD_ORDER.map(cardKey => {
                      const card = (player.cards as PlayerCards)[cardKey];
                      return (
                        <td key={cardKey} style={{ padding: '16px', fontSize: '14px', color: card.revealed ? '#fff' : '#555' }}>
                          {card.revealed && card.value ? card.value : '???'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
