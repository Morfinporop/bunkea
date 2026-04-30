import { useState } from 'react';
import { useGame } from '../../GameContext';
import { VoteIcon, UserIcon } from '../Icons';

export default function VotingScreen() {
  const { room, isHost, myPlayerId, vote, endVoting } = useGame();
  const [, setMyVote] = useState<string | null>(null);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass" style={{ padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
        <VoteIcon style={{ width: '60px', height: '60px', color: '#d4af37', margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '12px' }}>Голосование</h2>
        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '24px' }}>
          Выберите игрока для исключения из бункера
        </p>
        <div style={{ fontSize: '14px', color: '#888' }}>
          Проголосовало: <span style={{ color: '#d4af37', fontWeight: 700 }}>{totalVotes}</span> / {activePlayers.length}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activePlayers.map((player) => {
          const isMyVoteTarget = room.votes[myPlayerId || ''] === player.id;
          const isSelf = player.id === myPlayerId;
          const canVote = room.votingActive && !hasVoted && !isSelf;

          return (
            <button
              key={player.id}
              onClick={() => canVote && handleVote(player.id)}
              disabled={!canVote && !isMyVoteTarget}
              className={isMyVoteTarget ? 'card-gold' : 'card'}
              style={{
                padding: '24px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: canVote ? 'pointer' : 'default',
                opacity: isSelf ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <UserIcon style={{ width: '32px', height: '32px', color: '#888' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                    {player.name}
                    {isSelf && <span style={{ color: '#888', marginLeft: '10px', fontSize: '14px' }}>(Вы)</span>}
                  </div>
                </div>
              </div>
              {isMyVoteTarget && (
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#d4af37' }}>✓ Ваш голос</div>
              )}
            </button>
          );
        })}
      </div>

      {isHost && (
        <button onClick={() => endVoting()} className="btn btn-accent" style={{ width: '100%', fontSize: '18px', padding: '20px' }}>
          Завершить голосование
        </button>
      )}
    </div>
  );
}
