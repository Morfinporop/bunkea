import { useState, useEffect } from 'react';
import { useGame } from '../../GameContext';
import { Player, PlayerCards } from '../../types';
import { CardIcon, TimerIcon, UserIcon, DiceIcon, CrossIcon, CheckIcon } from '../Icons';

const CARD_ORDER = ['profession', 'health', 'hobby', 'luggage', 'phobia', 'skill', 'biology', 'extra'] as const;

function Timer({ timerEndAt, timerDuration }: { timerEndAt: number | null; timerDuration: number | null }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!timerEndAt) { setTimeLeft(0); return; }
    const update = () => {
      const left = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
      setTimeLeft(left);
    };
    update();
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [timerEndAt]);

  if (!timerEndAt) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const total = timerDuration || 120;
  const pct = (timeLeft / total) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="glass" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '14px' }}>
          <TimerIcon style={{ width: '20px', height: '20px' }} />
          <span>Таймер раунда</span>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, color: isLow ? '#e74c3c' : '#d4af37' }}>
          {mins}:{String(secs).padStart(2, '0')}
        </div>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: isLow ? '#e74c3c' : '#d4af37', transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function MyCards({ player }: { player: Player }) {
  const { playerRevealCard } = useGame();
  const cards = player.cards;
  if (!cards) return null;

  return (
    <div className="glass" style={{ padding: '25px', borderRadius: '16px', marginBottom: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#d4af37' }}>
        МОИ ХАРАКТЕРИСТИКИ
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {CARD_ORDER.map((cardKey) => {
          const card = (cards as PlayerCards)[cardKey];
          const isRevealed = card.revealed;

          return (
            <div key={cardKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className={isRevealed ? 'card-gold' : 'card'} style={{ padding: '16px', borderRadius: '12px', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <CardIcon style={{ width: '16px', height: '16px', color: '#888' }} />
                  <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.label}
                  </div>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', lineHeight: '1.3' }}>
                  {card.value}
                </div>

                {isRevealed && (
                  <div style={{ fontSize: '11px', color: '#d4af37', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckIcon style={{ width: '12px', height: '12px' }} />
                    <span>Раскрыто всем</span>
                  </div>
                )}
              </div>

              {!isRevealed && (
                <button
                  onClick={() => playerRevealCard(cardKey)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px 16px', fontSize: '13px' }}
                >
                  Раскрыть всем
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OtherPlayerCard({ player, isHost }: { player: Player; isHost: boolean }) {
  const { revealCard, revealAllCards, eliminatePlayer, restorePlayer, reassignCards } = useGame();
  const cards = player.cards;
  if (!cards) return null;

  const revealedCount = Object.values(cards).filter(c => c.revealed).length;

  return (
    <div className="glass" style={{ padding: '20px', borderRadius: '16px', opacity: player.isEliminated ? 0.5 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <UserIcon style={{ width: '32px', height: '32px', color: '#888' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: player.isEliminated ? '#888' : '#fff' }}>
              {player.name}
              {player.isEliminated && <span style={{ color: '#e74c3c', marginLeft: '10px', fontSize: '14px' }}>(Исключён)</span>}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              Открыто: {revealedCount}/8 карт
            </div>
          </div>
        </div>

        {isHost && !player.isHost && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => reassignCards(player.id)}
              className="btn btn-primary"
              style={{ padding: '10px 14px' }}
              title="Новые карты"
            >
              <DiceIcon style={{ width: '18px', height: '18px' }} />
            </button>
            {!player.isEliminated ? (
              <button
                onClick={() => eliminatePlayer(player.id)}
                className="btn btn-primary"
                style={{ padding: '10px 14px', borderColor: 'rgba(231, 76, 60, 0.3)' }}
                title="Исключить"
              >
                <CrossIcon style={{ width: '18px', height: '18px', color: '#e74c3c' }} />
              </button>
            ) : (
              <button
                onClick={() => restorePlayer(player.id)}
                className="btn btn-primary"
                style={{ padding: '10px 14px', borderColor: 'rgba(46, 204, 113, 0.3)' }}
                title="Вернуть"
              >
                <CheckIcon style={{ width: '18px', height: '18px', color: '#2ecc71' }} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {CARD_ORDER.map((cardKey) => {
          const card = (cards as PlayerCards)[cardKey];
          const canRevealAsHost = !card.revealed && isHost && !player.isEliminated;

          return (
            <button
              key={cardKey}
              onClick={() => canRevealAsHost && revealCard(player.id, cardKey)}
              disabled={!canRevealAsHost && !card.revealed}
              className={card.revealed ? 'card-gold' : 'card'}
              style={{
                padding: '14px',
                borderRadius: '10px',
                minHeight: '90px',
                textAlign: 'left',
                cursor: canRevealAsHost ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CardIcon style={{ width: '14px', height: '14px', color: '#666' }} />
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>
                  {card.label}
                </div>
              </div>

              {card.revealed && card.value ? (
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: '1.2' }}>
                  {card.value}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#555' }}>
                  {canRevealAsHost ? 'Раскрыть (ведущий)' : '???'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isHost && !player.isEliminated && (
        <button
          onClick={() => revealAllCards(player.id)}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '15px', fontSize: '14px', padding: '12px' }}
        >
          Раскрыть все карты
        </button>
      )}
    </div>
  );
}

export default function GameScreen() {
  const { room, isHost, myPlayerId } = useGame();

  if (!room) return null;

  const myPlayer = room.players.find(p => p.id === myPlayerId);
  const otherPlayers = room.players.filter(p => p.id !== myPlayerId && !p.isEliminated);
  const eliminatedPlayers = room.players.filter(p => p.isEliminated && p.id !== myPlayerId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Timer timerEndAt={room.timerEndAt} timerDuration={room.timerDuration} />

      <div className="glass" style={{ padding: '18px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ color: '#aaa' }}>
            Раунд: <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '16px' }}>{room.round}</span>
          </div>
          <div style={{ color: '#aaa' }}>
            Выживших: <span style={{ color: '#fff', fontWeight: 700 }}>{room.players.filter(p => !p.isEliminated).length}</span>
            {' / '}
            Мест в бункере: <span style={{ color: '#d4af37', fontWeight: 700 }}>{room.settings.bunkerCapacity}</span>
          </div>
        </div>
      </div>

      {!isHost && myPlayer && <MyCards player={myPlayer} />}

      {isHost && myPlayer && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#fff' }}>
            Ваши характеристики (видны только вам)
          </h3>
          <MyCards player={myPlayer} />
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '15px', color: '#fff' }}>
          {isHost ? `Все игроки (${otherPlayers.length + 1})` : `Другие игроки (${otherPlayers.length})`}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {isHost && myPlayer && <OtherPlayerCard player={myPlayer} isHost={true} />}
          {otherPlayers.map((player) => (
            <OtherPlayerCard key={player.id} player={player} isHost={isHost} />
          ))}
        </div>
      </div>

      {eliminatedPlayers.length > 0 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#888' }}>
            Исключены ({eliminatedPlayers.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {eliminatedPlayers.map((player) => (
              <OtherPlayerCard key={player.id} player={player} isHost={isHost} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
