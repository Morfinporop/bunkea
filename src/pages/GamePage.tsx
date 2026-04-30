/**
 * Game Page - Main game screen
 * Shows different views based on game phase
 */
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/3 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-4"
          style={{ backgroundImage: 'linear-gradient(#00ff4420 1px, transparent 1px), linear-gradient(90deg, #00ff4420 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Phase indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500/70 text-xs font-mono tracking-widest uppercase">
              {room.phase === 'catastrophe' && 'Катастрофа'}
              {room.phase === 'game' && `Раунд ${room.round}`}
              {room.phase === 'voting' && 'Голосование'}
              {room.phase === 'results' && 'Итоги'}
            </span>
            {room.phase === 'game' && (
              <span className="text-gray-600 text-xs font-mono">
                Выживших: {room.players.filter(p => !p.isEliminated).length} / Бункер: {room.settings.bunkerCapacity}
              </span>
            )}
          </div>
          <div className="text-gray-600 text-xs font-mono">#{room.code}</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main content */}
          <div className={isHost ? 'xl:col-span-2' : 'xl:col-span-3'}>
            {renderPhase()}
          </div>

          {/* Host panel */}
          {isHost && (
            <div className="xl:col-span-1">
              <HostPanel />
            </div>
          )}

          {/* Chat */}
          <div className="xl:col-span-1">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
