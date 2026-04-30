import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { BunkerIcon, PlayIcon, ArrowRightIcon } from '../components/Icons';

type View = 'main' | 'create' | 'join';

export default function HomePage() {
  const navigate = useNavigate();
  const { createRoom, joinRoom, connected } = useGame();
  const [view, setView] = useState<View>('main');
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);
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
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src="/bunker-bg.jpg" alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 overlay-blur flex items-center justify-center p-6" onClick={() => setShowRules(false)}>
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto scroll-smooth" onClick={(e) => e.stopPropagation()}>
            <div className="glass rounded-2xl p-10">
              <h1 className="text-4xl font-black text-center mb-8 text-white">ПРАВИЛА ИГРЫ</h1>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-3">Сюжет</h2>
                  <p>Произошла глобальная катастрофа. Человечество на грани вымирания. Есть бункер, но мест ограничено. Вы должны убедить других, что достойны выжить.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-3">Характеристики</h2>
                  <p className="mb-2">Каждый игрок получает 8 случайных характеристик:</p>
                  <ul className="space-y-1 ml-6 list-disc text-gray-400">
                    <li>Профессия</li>
                    <li>Состояние здоровья</li>
                    <li>Хобби</li>
                    <li>Багаж</li>
                    <li>Фобия</li>
                    <li>Специальный навык</li>
                    <li>Биология (пол, возраст)</li>
                    <li>Дополнительный факт</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-3">Как играть</h2>
                  <div className="space-y-3">
                    <div className="glass rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">1. Обсуждение</h3>
                      <p className="text-sm text-gray-400">Ведущий даёт время. Игроки рассказывают о себе и раскрывают карточки.</p>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">2. Раскрытие карт</h3>
                      <p className="text-sm text-gray-400">Минимум: 1 профессия + 2 другие характеристики за раунд.</p>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">3. Аргументация</h3>
                      <p className="text-sm text-gray-400">Объясните, почему вы ценны для бункера.</p>
                    </div>
                    <div className="glass rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">4. Голосование</h3>
                      <p className="text-sm text-gray-400">Все голосуют за исключение одного игрока.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-3">Победа</h2>
                  <p>Игра продолжается, пока количество выживших не сравняется с количеством мест в бункере.</p>
                </section>
              </div>

              <button onClick={() => setShowRules(false)} className="btn btn-accent w-full mt-8 text-lg">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-12 fade-in">
          <BunkerIcon className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-7xl md:text-8xl font-black mb-4 text-white">БУНКЕР</h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">Онлайн игра на выживание</p>
        </div>

        {view === 'main' && (
          <div className="w-full max-w-md space-y-4 fade-in">
            <button onClick={() => setView('create')} disabled={!connected} className="btn btn-accent w-full text-xl py-6">
              <PlayIcon className="w-6 h-6" />
              <span>Создать комнату</span>
            </button>
            <button onClick={() => setView('join')} disabled={!connected} className="btn btn-primary w-full text-xl py-6">
              <ArrowRightIcon className="w-6 h-6" />
              <span>Войти в комнату</span>
            </button>
            <button onClick={() => setShowRules(true)} className="w-full text-gray-500 hover:text-yellow-500 py-4 transition-colors text-sm tracking-wider">
              ПРАВИЛА
            </button>
            {!connected && <p className="text-center text-red-500 text-sm mt-4">Подключение...</p>}
          </div>
        )}

        {view === 'create' && (
          <div className="w-full max-w-lg fade-in">
            <div className="glass rounded-2xl p-8">
              <button onClick={() => setView('main')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2">
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
                <span>Назад</span>
              </button>
              
              <h2 className="text-3xl font-bold mb-6 text-white">Создать комнату</h2>
              
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ваше имя</label>
                  <input value={hostName} onChange={e => setHostName(e.target.value)} placeholder="Ведущий" className="input" maxLength={30} autoFocus />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Название комнаты</label>
                  <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Моя комната" className="input" maxLength={40} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Максимум игроков</label>
                  <select value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} className="input">
                    <option value={4}>4 игрока</option>
                    <option value={6}>6 игроков</option>
                    <option value={8}>8 игроков</option>
                    <option value={10}>10 игроков</option>
                    <option value={12}>12 игроков</option>
                  </select>
                </div>
                <div className="glass rounded-lg p-4 text-sm space-y-2 text-gray-400">
                  <div className="flex justify-between"><span>Мест в бункере:</span><span className="text-yellow-500">Случайно (30-50%)</span></div>
                  <div className="flex justify-between"><span>Катастрофа:</span><span className="text-yellow-500">Случайно</span></div>
                </div>
                {error && <div className="glass border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
                <button type="submit" disabled={loading || !connected} className="btn btn-accent w-full text-lg py-5">
                  {loading ? 'Создание...' : 'Создать'}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'join' && (
          <div className="w-full max-w-md fade-in">
            <div className="glass rounded-2xl p-8">
              <button onClick={() => setView('main')} className="text-gray-500 hover:text-white mb-6 flex items-center gap-2">
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
                <span>Назад</span>
              </button>
              
              <h2 className="text-3xl font-bold mb-6 text-white">Войти в комнату</h2>
              
              <form onSubmit={handleJoin} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Код комнаты</label>
                  <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" className="input text-center text-3xl tracking-[0.5em] font-bold" maxLength={6} autoFocus />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Ваше имя</label>
                  <input value={joinName} onChange={e => setJoinName(e.target.value)} placeholder="Игрок" className="input" maxLength={30} />
                </div>
                {error && <div className="glass border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
                <button type="submit" disabled={loading || !connected} className="btn btn-accent w-full text-lg py-5">
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
