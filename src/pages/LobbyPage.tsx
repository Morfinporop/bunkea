import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { UserIcon, PlayIcon, ArrowLeftIcon, RadioactiveIcon } from '../components/Icons';

export default function LobbyPage() {
  const navigate = useNavigate();
  const { room, isHost, myPlayerId, startGame, kickPlayer, clearSession } = useGame();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!room || room.phase !== 'lobby') {
    if (room && room.phase !== 'lobby') navigate('/game');
    return null;
  }

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    setLoading(true);
    const res = await startGame();
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate('/game');
  };

  const handleLeave = () => {
    clearSession();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src="/lobby-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{room.settings.roomName}</h1>
              <p className="text-gray-400">Ожидание игроков...</p>
            </div>
            <button onClick={handleLeave} className="text-gray-400 hover:text-white transition flex items-center gap-2">
              <ArrowLeftIcon className="w-5 h-5" />
              Выйти
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Room Code & Players */}
            <div className="lg:col-span-2 space-y-6">
              {/* Room Code */}
              <div className="glass rounded-2xl p-8">
                <div className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Код комнаты</div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-6xl font-black text-yellow-500 tracking-[0.15em]">{room.code}</div>
                  <button onClick={copyCode} className="btn btn-primary px-6">
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-3">Поделитесь кодом с игроками</p>
              </div>

              {/* Players List */}
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Игроки: {room.players.length}/{room.settings.maxPlayers}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.players.map(player => (
                    <div key={player.id} className={`glass-light rounded-xl p-5 flex items-center gap-4 transition ${player.id === myPlayerId ? 'border border-yellow-500/50' : ''}`}>
                      <UserIcon className="w-10 h-10 text-gray-600" />
                      <div className="flex-1">
                        <div className="text-white font-bold text-lg">
                          {player.name}
                          {player.id === myPlayerId && <span className="text-yellow-500 ml-2">(Вы)</span>}
                        </div>
                        <div className="text-gray-500 text-sm">{player.isHost ? 'Ведущий' : 'Игрок'}</div>
                      </div>
                      {isHost && !player.isHost && (
                        <button onClick={() => kickPlayer(player.id)} className="text-gray-600 hover:text-red-500 transition text-sm">
                          Выгнать
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="glass-light rounded-xl p-4 text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Info & Start */}
            <div className="space-y-6">
              {/* Catastrophe Info */}
              <div className="glass rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-4 uppercase tracking-wider">Катастрофа</div>
                <div className="flex items-start gap-3 mb-4">
                  <RadioactiveIcon className="w-10 h-10 text-yellow-500" />
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{room.catastrophe.name}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{room.catastrophe.description.slice(0, 100)}...</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Срок:</span>
                    <span className="text-white font-medium">{room.catastrophe.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Угроза:</span>
                    <span className="text-white font-medium">{room.catastrophe.threat}</span>
                  </div>
                </div>
              </div>

              {/* Game Settings */}
              <div className="glass rounded-2xl p-6">
                <div className="text-gray-400 text-sm mb-4 uppercase tracking-wider">Параметры</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Мест в бункере:</span>
                    <span className="text-yellow-500 font-black text-2xl">{room.settings.bunkerCapacity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Макс. игроков:</span>
                    <span className="text-white font-bold">{room.settings.maxPlayers}</span>
                  </div>
                </div>
              </div>

              {/* Start Game */}
              {isHost ? (
                <button onClick={handleStart} disabled={loading || room.players.length < 2} className="btn btn-accent w-full text-xl py-6">
                  <PlayIcon className="w-6 h-6" />
                  {loading ? 'Запуск...' : 'Начать игру'}
                </button>
              ) : (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-gray-400 mb-4">Ожидание ведущего...</p>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 bg-yellow-500 rounded-full pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
