/**
 * Home Page - Simple and Clean
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { BunkerIcon, PlayIcon, ArrowRightIcon, LockIcon } from '../components/Icons';

type View = 'main' | 'create' | 'join';

export default function HomePage() {
  const navigate = useNavigate();
  const { createRoom, joinRoom, connected } = useGame();
  const [view, setView] = useState<View>('main');
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Create room state
  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);

  // Join room state
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return setError('Нет подключения к серверу');
    if (!hostName.trim()) return setError('Введите ваше имя');
    setLoading(true);
    setError('');
    const res = await createRoom(hostName.trim(), {
      roomName: roomName.trim() || `Комната ${hostName}`,
      maxPlayers
    });
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate('/lobby');
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return setError('Нет подключения к серверу');
    if (!joinCode.trim()) return setError('Введите код комнаты');
    if (!joinName.trim()) return setError('Введите ваше имя');
    setLoading(true);
    setError('');
    const res = await joinRoom(joinCode.trim().toUpperCase(), joinName.trim());
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Rules Modal */}
      {showRules && (
        <div 
          className="fixed inset-0 z-50 blur-overlay flex items-center justify-center p-4"
          onClick={() => setShowRules(false)}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/90 border border-gray-800 rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">ПРАВИЛА ИГРЫ</h2>
              
              <div className="space-y-6 text-gray-300 text-base leading-relaxed">
                <div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-3">Сценарий</h3>
                  <p>Произошла глобальная катастрофа. Человечество на грани вымирания. Есть бункер с ограниченным количеством мест. Вам нужно убедить других, что именно вы достойны попасть в убежище.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-3">Подготовка</h3>
                  <p>Каждый игрок получает случайный набор из 8 характеристик:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400 ml-4">
                    <li>Профессия</li>
                    <li>Здоровье</li>
                    <li>Хобби</li>
                    <li>Багаж</li>
                    <li>Фобия</li>
                    <li>Навык</li>
                    <li>Биология (пол, возраст)</li>
                    <li>Дополнительный факт</li>
                  </ul>
                  <p className="mt-2">Все характеристики скрыты и раскрываются постепенно в ходе игры.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-3">Как играть</h3>
                  <p className="mb-3">Игра проходит в голосовом чате Discord, а браузер используется для визуальной части:</p>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                      <h4 className="font-bold text-white mb-2">1. Раунд обсуждения</h4>
                      <p className="text-sm text-gray-400">Ведущий даёт время (обычно 1-2 минуты). Игроки по очереди рассказывают о себе и раскрывают карточки.</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                      <h4 className="font-bold text-white mb-2">2. Раскрытие карт</h4>
                      <p className="text-sm text-gray-400">Каждый раунд игрок ОБЯЗАН открыть минимум 1 профессию и 2 другие характеристики. Ведущий следит за этим.</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                      <h4 className="font-bold text-white mb-2">3. Аргументация</h4>
                      <p className="text-sm text-gray-400">Объясните, почему вы ценны для бункера. Убедите других в своей полезности.</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                      <h4 className="font-bold text-white mb-2">4. Голосование</h4>
                      <p className="text-sm text-gray-400">После обсуждения все голосуют за того, кого хотят исключить. Нельзя голосовать за себя.</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                      <h4 className="font-bold text-white mb-2">5. Исключение</h4>
                      <p className="text-sm text-gray-400">Игрок с наибольшим количеством голосов покидает бункер и становится наблюдателем.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-3">Победа</h3>
                  <p>Игра продолжается до тех пор, пока количество выживших не сравняется с количеством мест в бункере. Оставшиеся игроки побеждают и получают шанс на выживание.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-3">Роль ведущего</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                    <li>Управляет ходом игры и временем</li>
                    <li>Следит за раскрытием карточек</li>
                    <li>Запускает голосования</li>
                    <li>Может изменять характеристики игроков</li>
                    <li>Разрешает спорные ситуации</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="mt-8 w-full btn-accent"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BunkerIcon className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-4">
            <span className="text-white">БУНКЕР</span>
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Онлайн игра на выживание</p>
        </div>

        {/* Main view */}
        {view === 'main' && (
          <div className="w-full max-w-md space-y-4 animate-fade-in">
            <button
              onClick={() => { setView('create'); setError(''); }}
              disabled={!connected}
              className="w-full btn-accent text-lg py-5"
            >
              <div className="flex items-center justify-center gap-3">
                <PlayIcon className="w-6 h-6" />
                <span>Создать комнату</span>
              </div>
            </button>

            <button
              onClick={() => { setView('join'); setError(''); }}
              disabled={!connected}
              className="w-full btn-primary text-lg py-5"
            >
              <div className="flex items-center justify-center gap-3">
                <ArrowRightIcon className="w-6 h-6" />
                <span>Войти в комнату</span>
              </div>
            </button>

            <button
              onClick={() => setShowRules(true)}
              className="w-full text-gray-500 hover:text-yellow-500 text-sm py-3 transition-colors"
            >
              ПРАВИЛА ИГРЫ
            </button>

            {!connected && (
              <div className="text-center text-red-500 text-sm">
                Подключение к серверу...
              </div>
            )}
          </div>
        )}

        {/* Create Room view */}
        {view === 'create' && (
          <div className="w-full max-w-lg animate-fade-in">
            <div className="card p-8">
              <button 
                onClick={() => { setView('main'); setError(''); }} 
                className="text-gray-500 hover:text-white mb-6 flex items-center gap-2"
              >
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
                <span>Назад</span>
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Создать комнату</h2>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ваше имя</label>
                  <input
                    value={hostName}
                    onChange={e => setHostName(e.target.value)}
                    placeholder="Ведущий"
                    className="input-field"
                    maxLength={30}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Название комнаты (необязательно)</label>
                  <input
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    placeholder="Моя комната"
                    className="input-field"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Максимум игроков</label>
                  <select
                    value={maxPlayers}
                    onChange={e => setMaxPlayers(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={4}>4 игрока</option>
                    <option value={6}>6 игроков</option>
                    <option value={8}>8 игроков</option>
                    <option value={10}>10 игроков</option>
                    <option value={12}>12 игроков</option>
                  </select>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Мест в бункере:</span>
                      <span className="text-yellow-500">Случайно</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Катастрофа:</span>
                      <span className="text-yellow-500">Случайно</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ресурсы:</span>
                      <span className="text-yellow-500">Случайно</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !connected}
                  className="btn-accent w-full py-4 text-lg"
                >
                  {loading ? 'Создание...' : 'Создать'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Join Room view */}
        {view === 'join' && (
          <div className="w-full max-w-md animate-fade-in">
            <div className="card p-8">
              <button 
                onClick={() => { setView('main'); setError(''); }} 
                className="text-gray-500 hover:text-white mb-6 flex items-center gap-2"
              >
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
                <span>Назад</span>
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Войти в комнату</h2>

              <form onSubmit={handleJoin} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Код комнаты</label>
                  <input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="input-field text-center text-3xl tracking-[0.5em] font-bold"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ваше имя</label>
                  <input
                    value={joinName}
                    onChange={e => setJoinName(e.target.value)}
                    placeholder="Игрок"
                    className="input-field"
                    maxLength={30}
                  />
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !connected}
                  className="btn-accent w-full py-4 text-lg"
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
