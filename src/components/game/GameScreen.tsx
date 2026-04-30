/**
 * Game Screen - Simple card-based gameplay
 */
import { useState, useEffect } from 'react';
import { useGame } from '../../GameContext';
import { Player, PlayerCards } from '../../types';
import { CardIcon, TimerIcon, UserIcon, DiceIcon, CrossIcon, CheckIcon } from '../Icons';

const CARD_ORDER = ['profession', 'health', 'hobby', 'luggage', 'phobia', 'skill', 'biology', 'extra'] as const;
type CardKey = typeof CARD_ORDER[number];

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
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <TimerIcon className="w-4 h-4" />
          <span>Таймер</span>
        </div>
        <div className={`text-2xl font-black ${isLow ? 'text-red-500' : 'text-yellow-500'}`}>
          {mins}:{String(secs).padStart(2, '0')}
        </div>
      </div>
      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${isLow ? 'bg-red-500' : 'bg-yellow-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PlayerCard({ player, isMe, isHost }: { player: Player; isMe: boolean; isHost: boolean }) {
  const { revealCard, revealAllCards, eliminatePlayer, restorePlayer, reassignCards, playerRevealCard } = useGame();
  const cards = player.cards;
  if (!cards) return null;

  const revealedCount = Object.values(cards).filter(c => c.revealed).length;

  const handleRevealCard = (cardKey: string) => {
    if (isHost) {
      revealCard(player.id, cardKey);
    } else if (isMe) {
      playerRevealCard(cardKey);
    }
  };

  return (
    <div className={`card p-5 ${player.isEliminated ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserIcon className="w-8 h-8 text-gray-500" />
          <div>
            <div className="text-white font-bold">
              {player.name}
              {isMe && <span className="text-yellow-500 ml-2">(вы)</span>}
              {player.isEliminated && <span className="text-red-500 ml-2">(исключён)</span>}
            </div>
            <div className="text-gray-500 text-sm">
              Открыто: {revealedCount}/8
            </div>
          </div>
        </div>
        
        {isHost && !player.isHost && (
          <div className="flex gap-2">
            <button
              onClick={() => reassignCards(player.id)}
              className="p-2 border border-gray-700 hover:border-yellow-500 rounded"
              title="Новые карты"
            >
              <DiceIcon className="w-5 h-5 text-gray-500 hover:text-yellow-500" />
            </button>
            {!player.isEliminated ? (
              <button
                onClick={() => eliminatePlayer(player.id)}
                className="p-2 border border-gray-700 hover:border-red-500 rounded"
                title="Исключить"
              >
                <CrossIcon className="w-5 h-5 text-gray-500 hover:text-red-500" />
              </button>
            ) : (
              <button
                onClick={() => restorePlayer(player.id)}
                className="p-2 border border-gray-700 hover:border-green-500 rounded"
                title="Вернуть"
              >
                <CheckIcon className="w-5 h-5 text-gray-500 hover:text-green-500" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CARD_ORDER.map((cardKey) => {
          const card = (cards as PlayerCards)[cardKey];
          const canReveal = !card.revealed && (isHost || isMe) && !player.isEliminated;

          return (
            <button
              key={cardKey}
              onClick={() => canReveal && handleRevealCard(cardKey)}
              disabled={!canReveal && !card.revealed}
              className={`p-3 rounded-lg border text-left transition-all ${
                card.revealed
                  ? 'card-revealed border-green-800 cursor-default'
                  : canReveal
                    ? 'border-gray-700 hover:border-yellow-500 cursor-pointer'
                    : 'border-gray-900 cursor-default'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CardIcon className="w-4 h-4 text-gray-600" />
                <div className="text-xs text-gray-500">{card.label}</div>
              </div>
              {card.revealed && card.value ? (
                <div className="text-sm text-white font-medium">{card.value}</div>
              ) : (
                <div className="text-sm text-gray-700">
                  {canReveal ? 'Нажмите чтобы открыть' : '???'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      {isHost && !player.isEliminated && (
        <div className="mt-4">
          <button
            onClick={() => revealAllCards(player.id)}
            className="w-full btn-primary text-sm py-2"
          >
            Открыть все карты
          </button>
        </div>
      )}
    </div>
  );
}

export default function GameScreen() {
  const { room, isHost, myPlayerId } = useGame();

  if (!room) return null;

  const activePlayers = room.players.filter(p => !p.isEliminated);
  const eliminatedPlayers = room.players.filter(p => p.isEliminated);
  const myPlayer = room.players.find(p => p.id === myPlayerId);

  return (
    <div className="space-y-4">
      {/* Timer */}
      <Timer timerEndAt={room.timerEndAt} timerDuration={room.timerDuration} />

      {/* Game Info */}
      <div className="card p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Раунд: <span className="text-yellow-500 font-bold">{room.round}</span>
          </div>
          <div className="text-gray-400">
            Выживших: <span className="text-white font-bold">{activePlayers.length}</span> / 
            Мест в бункере: <span className="text-yellow-500 font-bold">{room.settings.bunkerCapacity}</span>
          </div>
        </div>
      </div>

      {/* My Cards (if not host) */}
      {!isHost && myPlayer && (
        <div>
          <div className="text-white font-bold mb-3">Ваши характеристики</div>
          <PlayerCard player={myPlayer} isMe={true} isHost={false} />
        </div>
      )}

      {/* Active Players */}
      <div>
        <div className="text-white font-bold mb-3">
          Выжившие ({activePlayers.length})
        </div>
        <div className="space-y-3">
          {activePlayers.filter(p => isHost || p.id !== myPlayerId).map((player) => (
            <PlayerCard key={player.id} player={player} isMe={player.id === myPlayerId} isHost={isHost} />
          ))}
        </div>
      </div>

      {/* Eliminated */}
      {eliminatedPlayers.length > 0 && (
        <div>
          <div className="text-gray-500 font-bold mb-3">
            Исключены ({eliminatedPlayers.length})
          </div>
          <div className="space-y-3">
            {eliminatedPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} isMe={player.id === myPlayerId} isHost={isHost} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
