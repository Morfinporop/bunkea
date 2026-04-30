import { useState } from 'react';
import { useGame } from '../../GameContext';
import { VoteIcon, UserIcon } from '../Icons';

export default function VotingScreen() {
  const { room, isHost, myPlayerId, vote, endVoting } = useGame();
  const [myVote, setMyVote] = useState<string | null>(null);

  if (!room) return null;

  const activePlayers = room.players.filter(p => !p.isEliminated);
  const hasVoted = myPlayerId ? myPlayerId in room.votes : false;
  const totalVotes = Object.keys(room.votes).length;

  const handleVote = async (targetId: string) => {
    if (hasVoted || !room.votingActive) return;
    await vote(targetId);
    setMyVote(targetId);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card p-6 text-center">
        <VoteIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Голосование</h2>
        <p className="text-gray-400">Выберите игрока для исключения</p>
        <div className="mt-4 text-sm text-gray-500">
          Проголосовало: {totalVotes} / {activePlayers.length}
        </div>
      </div>

      <div className="space-y-3">
        {activePlayers.map((player) => {
          const isMyVoteTarget = room.votes[myPlayerId || ''] === player.id;
          const isSelf = player.id === myPlayerId;
          const canVote = room.votingActive && !hasVoted && !isSelf;

          return (
            <button
              key={player.id}
              onClick={() => canVote && handleVote(player.id)}
              disabled={!canVote && !isMyVoteTarget}
              className={`w-full card p-4 flex items-center justify-between ${
                isMyVoteTarget ? 'card-accent' : canVote ? 'hover:border-yellow-500' : ''
              } ${isSelf ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-8 h-8 text-gray-500" />
                <div className="text-left">
                  <div className="text-white font-bold">
                    {player.name}
                    {isSelf && <span className="text-gray-500 ml-2">(вы)</span>}
                  </div>
                </div>
              </div>
              {isMyVoteTarget && <div className="text-yellow-500 font-bold">✓ Ваш голос</div>}
            </button>
          );
        })}
      </div>

      {isHost && (
        <button onClick={() => endVoting()} className="btn-accent w-full py-4">
          Завершить голосование
        </button>
      )}
    </div>
  );
}
