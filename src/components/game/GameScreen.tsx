import { useState, useEffect } from 'react';
import { useGame } from '../../GameContext';
import { Player, PlayerCards } from '../../types';
import { CardIcon, UserIcon, DiceIcon, CrossIcon, CheckIcon, SettingsIcon } from '../Icons';

const CARD_ORDER = ['profession', 'health', 'hobby', 'luggage', 'phobia', 'skill', 'biology', 'extra'] as const;

function Timer({ timerEndAt }: { timerEndAt: number | null; timerDuration: number | null }) {
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

  return (
    <>
      {/* Bottom timer bar */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212,175,55,0.3)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 900, 
          color: timeLeft <= 10 ? '#e74c3c' : '#d4af37',
          fontFamily: 'monospace',
          letterSpacing: '0.1em'
        }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>

      {/* Expired animation */}
      {showExpired && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '120px',
            fontWeight: 900,
            color: '#e74c3c',
            animation: 'shake 0.5s ease-in-out 3'
          }}>
            00:00
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>
    </>
  );
}

function PlayerRow({ player, isMe, isHost }: { player: Player; isMe: boolean; isHost: boolean }) {
  const { playerRevealCard, revealCard, reassignCards, eliminatePlayer, restorePlayer } = useGame();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const cards = player.cards;
  if (!cards) return null;

  const handleRevealCard = (cardKey: string) => {
    if (isMe && !cards[cardKey as keyof PlayerCards].revealed) {
      playerRevealCard(cardKey);
    } else if (isHost && !cards[cardKey as keyof PlayerCards].revealed) {
      revealCard(player.id, cardKey);
    }
  };

  return (
    <div style={{ 
      background: 'rgba(0,0,0,0.6)',
      border: `1px solid ${isMe ? 'rgba(212,175,55,0.4)' : player.isEliminated ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '16px',
      padding: '20px',
      opacity: player.isEliminated ? 0.5 : 1,
      transition: 'all 0.3s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <UserIcon style={{ width: '40px', height: '40px', color: isMe ? '#d4af37' : '#666' }} />
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {player.name}
            {isMe && <span style={{ color: '#d4af37', marginLeft: '12px', fontSize: '16px' }}>(ВЫ)</span>}
            {player.isEliminated && <span style={{ color: '#e74c3c', marginLeft: '12px', fontSize: '16px' }}>(ИСКЛЮЧЁН)</span>}
          </div>
          <div style={{ fontSize: '14px', color: '#888' }}>
            {player.isHost ? 'Ведущий' : 'Игрок'} • Открыто: {Object.values(cards).filter(c => c.revealed).length}/8
          </div>
        </div>

        {isHost && !player.isHost && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => reassignCards(player.id)} className="btn btn-primary" style={{ padding: '10px 16px' }} title="Новые карты">
              <DiceIcon style={{ width: '20px', height: '20px' }} />
            </button>
            {!player.isEliminated ? (
              <button onClick={() => eliminatePlayer(player.id)} className="btn btn-primary" style={{ padding: '10px 16px' }} title="Исключить">
                <CrossIcon style={{ width: '20px', height: '20px', color: '#e74c3c' }} />
              </button>
            ) : (
              <button onClick={() => restorePlayer(player.id)} className="btn btn-primary" style={{ padding: '10px 16px' }} title="Вернуть">
                <CheckIcon style={{ width: '20px', height: '20px', color: '#2ecc71' }} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {CARD_ORDER.map((cardKey) => {
          const card = (cards as PlayerCards)[cardKey];
          const isRevealed = card.revealed;
          const canReveal = (isMe || isHost) && !isRevealed && !player.isEliminated;
          const isExpanded = expandedCard === cardKey;

          return (
            <div key={cardKey} style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  if (canReveal) {
                    handleRevealCard(cardKey);
                  } else if (isRevealed) {
                    setExpandedCard(isExpanded ? null : cardKey);
                  }
                }}
                disabled={!canReveal && !isRevealed}
                className={isRevealed ? 'card-gold' : 'card'}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  minHeight: '100px',
                  textAlign: 'left',
                  cursor: (canReveal || isRevealed) ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CardIcon style={{ width: '14px', height: '14px' }} />
                  {card.label}
                </div>

                {isRevealed && card.value ? (
                  <div style={{ 
                    fontSize: isExpanded ? '16px' : '14px', 
                    fontWeight: 600, 
                    color: '#fff', 
                    lineHeight: '1.3',
                    wordBreak: 'break-word'
                  }}>
                    {isExpanded ? card.value : (card.value.length > 30 ? card.value.slice(0, 30) + '...' : card.value)}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    {canReveal ? (isMe ? 'Раскрыть' : 'Раскрыть (ведущий)') : '???'}
                  </div>
                )}

                {isMe && !isRevealed && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '8px', 
                    left: '8px', 
                    right: '8px',
                    fontSize: '11px',
                    color: '#d4af37',
                    textAlign: 'center',
                    opacity: 0.7
                  }}>
                    Мои данные: {card.value}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HostControls() {
  const { room, startTimer, stopTimer, startVoting, setPhase, restartGame } = useGame();
  const [showPanel, setShowPanel] = useState(true);
  const [customTimer, setCustomTimer] = useState(60);

  if (!room) return null;

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 50,
          background: 'rgba(212,175,55,0.2)',
          border: '1px solid rgba(212,175,55,0.4)',
          borderRadius: '12px',
          padding: '12px 20px',
          color: '#d4af37',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s'
        }}
      >
        <SettingsIcon style={{ width: '18px', height: '18px' }} />
        {showPanel ? 'Скрыть панель' : 'Панель ведущего'}
      </button>

      {showPanel && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 50,
          width: '320px'
        }} className="glass" >
          <div style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#d4af37' }}>
              ПАНЕЛЬ ВЕДУЩЕГО
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="glass-light" style={{ padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Фаза</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                  {room.phase === 'catastrophe' ? 'Катастрофа' :
                   room.phase === 'game' ? 'Игра' :
                   room.phase === 'voting' ? 'Голосование' : 'Итоги'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Таймер:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
                  {[15, 30, 60, 120].map(t => (
                    <button
                      key={t}
                      onClick={() => setCustomTimer(t)}
                      className={customTimer === t ? 'card-gold' : 'card'}
                      style={{ padding: '8px 0', fontSize: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => startTimer(customTimer)} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
                    Старт
                  </button>
                  <button onClick={stopTimer} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
                    Стоп
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setPhase('catastrophe')} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px' }}>
                  Катастрофа
                </button>
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
  const { room, isHost, myPlayerId } = useGame();

  if (!room) return null;

  const allPlayers = [...room.players].sort((a, b) => {
    if (a.id === myPlayerId) return -1;
    if (b.id === myPlayerId) return 1;
    if (a.isEliminated !== b.isEliminated) return a.isEliminated ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ paddingBottom: room.timerEndAt ? '100px' : '0', transition: 'padding 0.3s' }}>
      <Timer timerEndAt={room.timerEndAt} timerDuration={room.timerDuration} />
      {isHost && <HostControls />}

      <div className="glass" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ color: '#aaa' }}>
            Выживших: <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{room.players.filter(p => !p.isEliminated).length}</span>
          </div>
          <div style={{ color: '#aaa' }}>
            Мест в бункере: <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '18px' }}>{room.settings.bunkerCapacity}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {allPlayers.map((player) => (
          <PlayerRow 
            key={player.id} 
            player={player} 
            isMe={player.id === myPlayerId} 
            isHost={isHost} 
          />
        ))}
      </div>
    </div>
  );
}
