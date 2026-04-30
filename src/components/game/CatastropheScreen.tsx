import { useGame } from '../../GameContext';
import { RadioactiveIcon, WarningIcon, UserIcon } from '../Icons';

export default function CatastropheScreen() {
  const { room, isHost, setPhase } = useGame();

  if (!room) return null;

  const handleNext = () => {
    setPhase('game');
  };

  const catImage = room.catastrophe.image || '/bunker-bg.jpg';

  return (
    <div className="space-y-6">
      {/* Catastrophe Card with Background Image */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={catImage} alt={room.catastrophe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          <div className="text-center mb-8">
            <RadioactiveIcon className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">{room.catastrophe.name}</h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <p className="text-xl text-gray-200 text-center leading-relaxed mb-8 max-w-3xl mx-auto">
            {room.catastrophe.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Срок изоляции</div>
              <div className="text-white font-bold text-2xl">{room.catastrophe.duration}</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Угроза</div>
              <div className="text-white font-bold text-lg">{room.catastrophe.threat}</div>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Мест в бункере</div>
              <div className="text-yellow-500 font-black text-3xl">{room.settings.bunkerCapacity}</div>
            </div>
          </div>

          <div className="mt-8 glass rounded-xl p-5 flex items-start gap-4 max-w-4xl mx-auto border border-yellow-500/20">
            <WarningIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <p className="text-yellow-200 leading-relaxed">
              Места в бункере ограничены. Только <strong className="text-yellow-500">{room.settings.bunkerCapacity}</strong> из {room.players.length} игроков смогут выжить. Убедите других в своей ценности!
            </p>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="glass rounded-2xl p-6">
        <div className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-500" />
          <span>Участники ({room.players.length})</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {room.players.map((player) => (
            <div key={player.id} className="glass rounded-lg p-4 text-center hover:border-white/20 transition">
              <div className="text-white font-medium mb-1 truncate">{player.name}</div>
              <div className="text-gray-500 text-xs">{player.isHost ? 'Ведущий' : 'Игрок'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      {isHost ? (
        <button onClick={handleNext} className="btn btn-accent w-full text-xl py-6">
          Начать раунд 1
        </button>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-gray-400">Ожидание начала игры...</p>
        </div>
      )}
    </div>
  );
}
