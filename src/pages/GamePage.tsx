import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import CatastropheScreen from '../components/game/CatastropheScreen';
import GameScreen from '../components/game/GameScreen';
import VotingScreen from '../components/game/VotingScreen';
import ResultsScreen from '../components/game/ResultsScreen';
import HostPanel from '../components/game/HostPanel';
import ChatPanel from '../components/game/ChatPanel';

export default function GamePage() {
  const navigate = useNavigate();
  const { room, isHost } = useGame();

  useEffect(() => {
    if (!room) {
      navigate('/');
    } else if (room.phase === 'lobby') {
      navigate('/lobby');
    }
  }, [room, navigate]);

  if (!room || room.phase === 'lobby') return null;

  const renderPhase = () => {
    switch (room.phase) {
      case 'catastrophe':
        return <CatastropheScreen />;
      case 'game':
        return <GameScreen />;
      case 'voting':
        return <VotingScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src="/bunker-bg.jpg" alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6 glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Код: <span className="text-yellow-500 font-bold">{room.code}</span>
                </div>
                <div className="h-4 w-px bg-gray-800"></div>
                <div className="text-sm text-gray-500">
                  Фаза: <span className="text-white font-bold capitalize">
                    {room.phase === 'catastrophe' ? 'Катастрофа' :
                     room.phase === 'game' ? `Раунд ${room.round}` :
                     room.phase === 'voting' ? 'Голосование' : 'Итоги'}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Выживших: <span className="text-white font-bold">{room.players.filter(p => !p.isEliminated).length}</span> / 
                Мест: <span className="text-yellow-500 font-bold">{room.settings.bunkerCapacity}</span>
              </div>
            </div>
          </div>

          {/* Main Content - Vertical scroll */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left: Host Panel (if host) */}
            {isHost && (
              <div className="xl:col-span-3">
                <div className="xl:sticky xl:top-6">
                  <HostPanel />
                </div>
              </div>
            )}

            {/* Center: Main Game */}
            <div className={isHost ? 'xl:col-span-6' : 'xl:col-span-9'}>
              <div className="space-y-6">
                {renderPhase()}
              </div>
            </div>

            {/* Right: Chat */}
            <div className="xl:col-span-3">
              <div className="xl:sticky xl:top-6">
                <ChatPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
