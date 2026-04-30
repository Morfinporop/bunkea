import { useNavigate } from 'react-router-dom';
import { useGame } from '../../GameContext';
import { TrophyIcon, UserIcon } from '../Icons';

export default function ResultsScreen() {
  const navigate = useNavigate();
  const { room, isHost, restartGame, clearSession } = useGame();

  if (!room) return null;

  const survivors = room.players.filter(p => !p.isEliminated);
  const eliminated = room.players.filter(p => p.isEliminated);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card p-8 text-center">
        <TrophyIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Игра завершена!</h2>
        <p className="text-gray-400">{survivors.length} игроков выжили</p>
      </div>

      <div>
        <div className="text-yellow-500 font-bold mb-3">Выжившие</div>
        <div className="space-y-2">
          {survivors.map((player) => (
            <div key={player.id} className="card-accent p-4 flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-yellow-500" />
              <div className="text-white font-bold">{player.name}</div>
            </div>
          ))}
        </div>
      </div>

      {eliminated.length > 0 && (
        <div>
          <div className="text-gray-500 font-bold mb-3">Исключены</div>
          <div className="space-y-2">
            {eliminated.map((player) => (
              <div key={player.id} className="card p-4 flex items-center gap-3 opacity-50">
                <UserIcon className="w-6 h-6 text-gray-600" />
                <div className="text-gray-400">{player.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {isHost && (
          <button onClick={() => restartGame().then(() => navigate('/lobby'))} className="btn-accent flex-1 py-3">
            Новая игра
          </button>
        )}
        <button onClick={() => { clearSession(); navigate('/'); window.location.reload(); }} className="btn-primary flex-1 py-3">
          На главную
        </button>
      </div>
    </div>
  );
}
