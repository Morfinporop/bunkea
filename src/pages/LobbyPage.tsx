/**
 * Lobby Page - Simple and clear waiting room
 */
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

  if (!room) return null;

  if (room.phase !== 'lobby') {
    navigate('/game');
    return null;
  }

  const copyCode = () => {
    navigator.clipboard.writeText(room.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStartGame = async () => {
    setLoading(true);
    setError('');
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{room.settings.roomName}</h1>
            <p className="text-gray-500 text-sm mt-1">Ожидание игроков...</p>
          </div>
          <button onClick={handleLeave} className="text-gray-500 hover:text-white flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Room code and players */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Code */}
            <div className="card p-6">
              <div className="text-gray-400 text-sm mb-3">Код комнаты</div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black text-yellow-500 tracking-[0.2em]">
                  {room.code}
                </div>
                <button
                  onClick={copyCode}
                  className="btn-primary px-6"
                >
                  {copied ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
            </div>

            {/* Players */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white font-bold">
                  Игроки: {room.players.length}/{room.settings.maxPlayers}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      player.id === myPlayerId
                        ? 'border-yellow-500/50 bg-yellow-500/5'
                        : 'border-gray-800 bg-gray-900/30'
                    }`}
                  >
                    <UserIcon className="w-8 h-8 text-gray-500" />
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {player.name}
                        {player.id === myPlayerId && <span className="text-yellow-500 ml-2">(вы)</span>}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {player.isHost ? 'Ведущий' : 'Игрок'}
                      </div>
                    </div>
                    {isHost && !player.isHost && (
                      <button
                        onClick={() => kickPlayer(player.id)}
                        className="text-gray-600 hover:text-red-500 text-sm"
                      >
                        Выгнать
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3 text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Right: Game info and start */}
          <div className="space-y-6">
            {/* Catastrophe */}
            <div className="card p-6">
              <div className="text-gray-400 text-sm mb-3">Катастрофа</div>
              <div className="flex items-start gap-3 mb-4">
                <RadioactiveIcon className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold mb-1">{room.catastrophe.name}</div>
                  <div className="text-gray-500 text-sm">{room.catastrophe.description}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Срок:</span>
                  <span className="text-white">{room.catastrophe.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Угроза:</span>
                  <span className="text-white">{room.catastrophe.threat}</span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="card p-6">
              <div className="text-gray-400 text-sm mb-3">Настройки</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Мест в бункере:</span>
                  <span className="text-yellow-500 font-bold">{room.settings.bunkerCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Макс. игроков:</span>
                  <span className="text-white">{room.settings.maxPlayers}</span>
                </div>
              </div>
            </div>

            {/* Start button */}
            {isHost ? (
              <button
                onClick={handleStartGame}
                disabled={loading || room.players.length < 2}
                className="btn-accent w-full py-4 text-lg"
              >
                <div className="flex items-center justify-center gap-3">
                  <PlayIcon className="w-6 h-6" />
                  <span>{loading ? 'Запуск...' : 'Начать игру'}</span>
                </div>
              </button>
            ) : (
              <div className="card p-6 text-center">
                <div className="text-gray-500 text-sm">Ожидание ведущего...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
