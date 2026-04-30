import { useState, useEffect } from 'react';
import { useGame } from '../../GameContext';
import { Player, PlayerCards } from '../../types';
import { CardIcon, UserIcon, DiceIcon, CrossIcon, CheckIcon, SettingsIcon, TimerIcon } from '../Icons';

const CARD_ORDER = ['profession', 'health', 'hobby', 'luggage', 'phobia', 'skill', 'biology', 'extra'] as const;

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
        background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7))',
        backdropFilter: 'blur(20px)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: `2px solid ${isUrgent ? '#e74c3c' : 'rgba(212,175,55,0.5)'}`,
        animation: isUrgent ? 'pulse 1s infinite' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <TimerIcon style={{ width: '32px', height: '32px', color: isUrgent ? '#e74c3c' : '#d4af37' }} />
          <div style={{ 
            fontSize: '56px', 
            fontWeight: 900, 
            color: isUrgent ? '#e74c3c' : '#d4af37',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textShadow: isUrgent ? '0 0 20px rgba(231,76,60,0.5)' : '0 0 20px rgba(212,175,55,0.3)'
          }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
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
          background: 'rgba(0,0,0,0.9)',
          pointerEvents: 'none'
        }}>
          <div style={{
            fontSize: '140px',
            fontWeight: 900,
            color: '#e74c3c',
            fontFamily: 'monospace',
            animation: 'shake 0.5s ease-in-out 6',
            textShadow: '0 0 40px rgba(231,76,60,0.8)'
          }}>
            00:00
          </div>
        </div>
      )}
    </>
  );
}

function PlayerCard({ player, isMe, isHost }: { player: Player; isMe: boolean; isHost: boolean }) {
  const { playerRevealCard, revealCard, reassignCards, eliminatePlayer, restorePlayer } = useGame();
  const [justRevealed, setJustRevealed] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const cards = player.cards;
  if (!cards) return null;

  const handleRevealCard = (cardKey: string) => {
    if (isMe) {
      playerRevealCard(cardKey);
    } else if (isHost) {
      revealCard(player.id, cardKey);
    }
    setJustRevealed(cardKey);
    setTimeout(() => setJustRevealed(null), 1000);
  };

  const revealedCount = Object.values(cards).filter(c => c.revealed).length;
  const professionRevealed = cards.profession?.revealed;

  return (
    <div 
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ 
        background: isMe ? 'linear-gradient(135deg, rgba(40,35,20,0.8), rgba(20,17,10,0.8))' : 'rgba(10,10,10,0.7)',
        border: `2px solid ${isMe ? 'rgba(212,175,55,0.5)' : player.isEliminated ? 'rgba(100,100,100,0.3)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '20px',
        padding: '24px',
        opacity: player.isEliminated ? 0.6 : 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        transform: showActions ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: showActions ? '0 12px 40px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.3)'
      }}
    >
      {/* Animated background gradient */}
      {isMe && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, transparent, rgba(212,175,55,0.1), transparent)',
          animation: 'shimmer 3s infinite',
          pointerEvents: 'none'
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: isMe ? 'linear-gradient(135deg, #d4af37, #aa8c2e)' : 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 900,
          color: isMe ? '#000' : '#fff',
          boxShadow: isMe ? '0 0 20px rgba(212,175,55,0.4)' : 'none',
          transition: 'all 0.3s'
        }}>
          {player.name.charAt(0).toUpperCase()}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {player.name}
            {isMe && <span style={{ 
              fontSize: '14px', 
              padding: '4px 12px', 
              background: 'rgba(212,175,55,0.2)', 
              border: '1px solid rgba(212,175,55,0.5)',
              borderRadius: '20px',
              color: '#d4af37',
              fontWeight: 700
            }}>ВЫ</span>}
            {player.isEliminated && <span style={{ 
              fontSize: '14px', 
              padding: '4px 12px', 
              background: 'rgba(231,76,60,0.2)', 
              border: '1px solid rgba(231,76,60,0.5)',
              borderRadius: '20px',
              color: '#e74c3c',
              fontWeight: 700
            }}>ИСКЛЮЧЁН</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#888' }}>
            <span>{player.isHost ? '👑 Ведущий' : '🎮 Игрок'}</span>
            <span>•</span>
            <span>Открыто: <strong style={{ color: professionRevealed ? '#2ecc71' : '#e74c3c' }}>{revealedCount}/8</strong></span>
            {!professionRevealed && <span style={{ color: '#e74c3c', fontSize: '12px' }}>⚠️ Профессия скрыта</span>}
          </div>
        </div>

        {isHost && !player.isHost && showActions && (
          <div style={{ display: 'flex', gap: '10px', animation: 'fadeIn 0.3s' }}>
            <button 
              onClick={() => reassignCards(player.id)} 
              className="btn btn-primary" 
              style={{ padding: '12px 16px', fontSize: '14px' }}
              title="🎲 Новые карты"
            >
              <DiceIcon style={{ width: '20px', height: '20px' }} />
            </button>
            {!player.isEliminated ? (
              <button 
                onClick={() => eliminatePlayer(player.id)} 
                className="btn btn-primary" 
                style={{ padding: '12px 16px', fontSize: '14px', borderColor: 'rgba(231,76,60,0.4)' }}
                title="❌ Исключить"
              >
                <CrossIcon style={{ width: '20px', height: '20px', color: '#e74c3c' }} />
              </button>
            ) : (
              <button 
                onClick={() => restorePlayer(player.id)} 
                className="btn btn-primary" 
                style={{ padding: '12px 16px', fontSize: '14px', borderColor: 'rgba(46,204,113,0.4)' }}
                title="✓ Вернуть"
              >
                <CheckIcon style={{ width: '20px', height: '20px', color: '#2ecc71' }} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '14px',
        position: 'relative',
        zIndex: 1
      }}>
        {CARD_ORDER.map((cardKey) => {
          const card = (cards as PlayerCards)[cardKey];
          const isRevealed = card.revealed;
          const canReveal = (isMe || isHost) && !isRevealed && !player.isEliminated;
          const isJustRevealed = justRevealed === cardKey;

          return (
            <button
              key={cardKey}
              onClick={() => canReveal && handleRevealCard(cardKey)}
              disabled={!canReveal && !isRevealed}
              className={isRevealed ? 'card-gold' : 'card'}
              style={{
                padding: '18px',
                borderRadius: '14px',
                minHeight: '130px',
                textAlign: 'left',
                cursor: canReveal ? 'pointer' : 'default',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                transform: isJustRevealed ? 'scale(1.05) rotateY(360deg)' : canReveal ? 'scale(1)' : 'scale(1)',
                boxShadow: isRevealed ? '0 4px 20px rgba(212,175,55,0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (canReveal) e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (canReveal) e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <div style={{ 
                fontSize: '11px', 
                color: isRevealed ? '#d4af37' : '#666', 
                textTransform: 'uppercase', 
                marginBottom: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                <CardIcon style={{ width: '14px', height: '14px' }} />
                {card.label}
              </div>

              <div style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#fff', 
                lineHeight: '1.4',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {isRevealed && card.value ? (
                  <span style={{ wordBreak: 'break-word' }}>{card.value}</span>
                ) : isMe && card.value ? (
                  <div>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Ваши данные:</div>
                    <div style={{ fontSize: '13px', color: '#aaa', fontWeight: 500 }}>{card.value}</div>
                  </div>
                ) : (
                  <span style={{ color: '#555', fontSize: '14px' }}>
                    {canReveal ? '🔓 Нажмите для раскрытия' : '🔒 Скрыто'}
                  </span>
                )}
              </div>

              {canReveal && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  fontSize: '20px',
                  opacity: 0.3
                }}>
                  👆
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
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
          top: '24px',
          right: '24px',
          zIndex: 50,
          background: showPanel ? 'rgba(212,175,55,0.3)' : 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(212,175,55,0.5)',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          color: '#d4af37',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          boxShadow: showPanel ? '0 0 30px rgba(212,175,55,0.4)' : '0 4px 15px rgba(0,0,0,0.5)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <SettingsIcon style={{ width: '28px', height: '28px' }} />
      </button>

      {showPanel && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '24px',
          zIndex: 50,
          width: '340px',
          animation: 'slideInRight 0.3s'
        }}>
          <div className="glass" style={{ padding: '28px', borderRadius: '20px', border: '2px solid rgba(212,175,55,0.3)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '24px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ⚙️ Панель управления
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-light" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>Текущая фаза</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#d4af37' }}>
                  {room.phase === 'catastrophe' ? '☢️ Катастрофа' :
                   room.phase === 'game' ? '🎮 Игра' :
                   room.phase === 'voting' ? '🗳️ Голосование' : '🏆 Итоги'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px', fontWeight: 600 }}>⏱️ Таймер раунда:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  {[15, 30, 60, 120].map(t => (
                    <button
                      key={t}
                      onClick={() => setCustomTimer(t)}
                      className={customTimer === t ? 'card-gold' : 'card'}
                      style={{ 
                        padding: '12px 0', 
                        fontSize: '13px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: 700,
                        transition: 'all 0.2s'
                      }}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={() => startTimer(customTimer)} className="btn btn-accent" style={{ padding: '12px', fontSize: '14px', fontWeight: 700 }}>
                    ▶ Старт
                  </button>
                  <button onClick={stopTimer} className="btn btn-primary" style={{ padding: '12px', fontSize: '14px', fontWeight: 700 }}>
                    ⏸ Стоп
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => setPhase('catastrophe')} className="btn btn-primary" style={{ padding: '14px', fontSize: '14px', fontWeight: 700 }}>
                  ☢️ Показать катастрофу
                </button>
                <button onClick={() => setPhase('game')} className="btn btn-primary" style={{ padding: '14px', fontSize: '14px', fontWeight: 700 }}>
                  🎮 Вернуться к игре
                </button>
                <button onClick={() => startVoting()} className="btn btn-accent" style={{ padding: '14px', fontSize: '14px', fontWeight: 700 }}>
                  🗳️ Начать голосование
                </button>
                <button onClick={restartGame} className="btn btn-primary" style={{ padding: '14px', fontSize: '14px', fontWeight: 700 }}>
                  🔄 Перезапустить игру
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
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

  const activePlayers = allPlayers.filter(p => !p.isEliminated);
  const eliminatedPlayers = allPlayers.filter(p => p.isEliminated);

  return (
    <div style={{ paddingBottom: room.timerEndAt ? '120px' : '20px', transition: 'padding 0.5s' }}>
      <FloatingTimer timerEndAt={room.timerEndAt} timerDuration={room.timerDuration} />
      {isHost && <HostControls />}

      {/* Stats Header */}
      <div className="glass" style={{ 
        padding: '24px 32px', 
        borderRadius: '20px', 
        marginBottom: '30px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.8))',
        border: '2px solid rgba(212,175,55,0.3)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>Выживших</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff' }}>{activePlayers.length}</div>
            </div>
            <div style={{ width: '2px', height: '50px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>Мест в бункере</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#d4af37' }}>{room.settings.bunkerCapacity}</div>
            </div>
            <div style={{ width: '2px', height: '50px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>Исключено</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#e74c3c' }}>{eliminatedPlayers.length}</div>
            </div>
          </div>
          <div style={{ fontSize: '48px' }}>☢️</div>
        </div>
      </div>

      {/* Players Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {allPlayers.map((player) => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            isMe={player.id === myPlayerId} 
            isHost={isHost} 
          />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
