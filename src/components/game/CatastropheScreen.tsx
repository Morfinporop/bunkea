/**
 * Catastrophe Screen - Show disaster info
 */
import { useGame } from '../../GameContext';
import { RadioactiveIcon, WarningIcon } from '../Icons';

export default function CatastropheScreen() {
  const { room, isHost, setPhase } = useGame();

  if (!room) return null;

  const handleNext = () => {
    setPhase('game');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Catastrophe Card */}
      <div className="card p-8">
        <div className="text-center mb-6">
          <RadioactiveIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-2">{room.catastrophe.name}</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        <p className="text-gray-300 text-center leading-relaxed mb-6">
          {room.catastrophe.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-500 text-sm mb-1">Срок изоляции</div>
            <div className="text-white font-bold">{room.catastrophe.duration}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-500 text-sm mb-1">Мест в бункере</div>
            <div className="text-yellow-500 font-bold text-xl">{room.settings.bunkerCapacity}</div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-900/20 border border-yellow-900/40 rounded-lg p-4 flex items-start gap-3">
          <WarningIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-200 text-sm">
            В бункер могут попасть только <strong>{room.settings.bunkerCapacity}</strong> из {room.players.length} игроков. 
            Убедите других в своей ценности!
          </p>
        </div>
      </div>

      {/* Players */}
      <div className="card p-6">
        <div className="text-white font-bold mb-4">Участники ({room.players.length})</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {room.players.map((player) => (
            <div key={player.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
              <div className="text-white font-medium text-sm truncate">{player.name}</div>
              <div className="text-gray-600 text-xs">{player.isHost ? 'Ведущий' : 'Игрок'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      {isHost && (
        <button onClick={handleNext} className="btn-accent w-full py-4 text-lg">
          Начать раунд 1
        </button>
      )}

      {!isHost && (
        <div className="card p-6 text-center">
          <p className="text-gray-500">Ожидание ведущего...</p>
        </div>
      )}
    </div>
  );
}
