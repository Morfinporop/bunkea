import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import { BunkerIcon, PlayIcon, ArrowRightIcon } from '../components/Icons';

export default function HomePage() {
  const navigate = useNavigate();
  const { createRoom, joinRoom, connected } = useGame();
  const [view, setView] = useState<'main' | 'create' | 'join'>('main');
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
    if (!connected) return setError('Нет подключения');
    if (!hostName.trim()) return setError('Введите имя');
    setLoading(true);
    setError('');
    const res = await createRoom(hostName.trim(), { roomName: roomName.trim() || `Комната ${hostName}`, maxPlayers });
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate('/lobby');
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return setError('Нет подключения');
    if (!joinCode.trim()) return setError('Введите код');
    if (!joinName.trim()) return setError('Введите имя');
    setLoading(true);
    setError('');
    const res = await joinRoom(joinCode.trim().toUpperCase(), joinName.trim());
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src="/bunker-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowRules(false)}>
          <div className="glass rounded-3xl p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h1 className="text-5xl font-black text-center mb-10">ПРАВИЛА ИГРЫ</h1>
            
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Сюжет</h2>
                <p className="text-lg leading-relaxed">Произошла глобальная катастрофа. Человечество на грани вымирания. Есть бункер, но мест ограничено. Вы должны убедить других, что достойны выжить.</p>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Характеристики</h2>
                <p className="text-lg mb-4">Каждый игрок получает 8 случайных характеристик:</p>
                <div className="grid grid-cols-2 gap-3 text-base">
                  <div className="glass-light rounded-xl p-4">Профессия</div>
                  <div className="glass-light rounded-xl p-4">Здоровье</div>
                  <div className="glass-light rounded-xl p-4">Хобби</div>
                  <div className="glass-light rounded-xl p-4">Багаж</div>
                  <div className="glass-light rounded-xl p-4">Фобия</div>
                  <div className="glass-light rounded-xl p-4">Навык</div>
                  <div className="glass-light rounded-xl p-4">Биология</div>
                  <div className="glass-light rounded-xl p-4">Доп. факт</div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Как играть</h2>
                <div className="space-y-4">
                  <div className="glass-light rounded-xl p-5">
                    <h3 className="font-bold text-xl text-white mb-2">1. Обсуждение</h3>
                    <p>Ведущий даёт время. Игроки рассказывают о себе.</p>
                  </div>
                  <div className="glass-light rounded-xl p-5">
                    <h3 className="font-bold text-xl text-white mb-2">2. Раскрытие</h3>
                    <p>Минимум: 1 профессия + 2 характеристики за раунд.</p>
                  </div>
                  <div className="glass-light rounded-xl p-5">
                    <h3 className="font-bold text-xl text-white mb-2">3. Аргументация</h3>
                    <p>Объясните, почему вы ценны для бункера.</p>
                  </div>
                  <div className="glass-light rounded-xl p-5">
                    <h3 className="font-bold text-xl text-white mb-2">4. Голосование</h3>
                    <p>Все голосуют за исключение одного игрока.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-white mb-4">Победа</h2>
                <p className="text-lg leading-relaxed">Игра продолжается, пока количество выживших не сравняется с количеством мест в бункере.</p>
              </section>
            </div>

            <button onClick={() => setShowRules(false)} className="btn btn-accent w-full mt-10 text-xl py-5">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md fade-in">
        {view === 'main' && (
          <>
            <div className="text-center mb-12">
              <BunkerIcon className="w-24 h-24 text-yellow-500 mx-auto mb-8" />
              <h1 className="text-7xl font-black mb-4">БУНКЕР</h1>
              <p className="text-gray-400 uppercase tracking-widest">Онлайн игра на выживание</p>
            </div>

            <div className="space-y-4">
              <button onClick={() => setView('create')} disabled={!connected} className="btn btn-accent w-full text-xl py-6">
                <PlayIcon className="w-6 h-6" />
                Создать комнату
              </button>
              
              <button onClick={() => setView('join')} disabled={!connected} className="btn btn-primary w-full text-xl py-6">
                <ArrowRightIcon className="w-6 h-6" />
                Войти в комнату
              </button>

              <button onClick={() => setShowRules(true)} className="w-full text-gray-500 hover:text-yellow-500 py-4 transition text-sm tracking-widest">
                ПРАВИЛА ИГРЫ
              </button>

              {!connected && <p className="text-center text-red-400 text-sm mt-4">Подключение к серверу...</p>}
            </div>
          </>
        )}

        {view === 'create' && (
          <div className="glass rounded-3xl p-8">
            <button onClick={() => setView('main')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              Назад
            </button>

            <h2 className="text-3xl font-bold mb-8">Создать комнату</h2>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Ваше имя</label>
                <input value={hostName} onChange={e => setHostName(e.target.value)} placeholder="Ведущий" className="input text-lg" maxLength={30} autoFocus />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm">Название комнаты</label>
                <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Моя комната" className="input" maxLength={40} />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm">Количество игроков</label>
                <select value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} className="input text-lg">
                  <option value={4}>4 игрока</option>
                  <option value={6}>6 игроков</option>
                  <option value={8}>8 игроков</option>
                  <option value={10}>10 игроков</option>
                  <option value={12}>12 игроков</option>
                </select>
              </div>

              <div className="glass-light rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Мест в бункере:</span><span className="text-yellow-500 font-bold">30-50% (случайно)</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Катастрофа:</span><span className="text-yellow-500 font-bold">Случайно</span></div>
              </div>

              {error && <div className="glass-light rounded-xl p-4 text-red-400 text-sm border border-red-500/20">{error}</div>}

              <button type="submit" disabled={loading || !connected} className="btn btn-accent w-full text-lg py-5">
                {loading ? 'Создание...' : 'Создать'}
              </button>
            </form>
          </div>
        )}

        {view === 'join' && (
          <div className="glass rounded-3xl p-8">
            <button onClick={() => setView('main')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              Назад
            </button>

            <h2 className="text-3xl font-bold mb-8">Войти в комнату</h2>

            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Код комнаты</label>
                <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" className="input text-3xl text-center tracking-[0.3em] font-bold" maxLength={6} autoFocus />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm">Ваше имя</label>
                <input value={joinName} onChange={e => setJoinName(e.target.value)} placeholder="Игрок" className="input text-lg" maxLength={30} />
              </div>

              {error && <div className="glass-light rounded-xl p-4 text-red-400 text-sm border border-red-500/20">{error}</div>}

              <button type="submit" disabled={loading || !connected} className="btn btn-accent w-full text-lg py-5">
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
