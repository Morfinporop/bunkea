import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../GameContext';
import CatastropheScreen from '../components/game/CatastropheScreen';
import GameScreen from '../components/game/GameScreen';
import VotingScreen from '../components/game/VotingScreen';
import ResultsScreen from '../components/game/ResultsScreen';
import HostPanel from '../components/game/HostPanel';

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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src="/bunker-bg.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="overlay"></div>
      </div>

      <div className="content-layer" style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="glass" style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ color: '#aaa' }}>
                  Код: <span style={{ color: '#d4af37', fontWeight: 700 }}>{room.code}</span>
                </div>
                <div style={{ height: '16px', width: '1px', background: '#333' }}></div>
                <div style={{ color: '#aaa' }}>
                  Фаза: <span style={{ color: '#fff', fontWeight: 700 }}>
                    {room.phase === 'catastrophe' ? 'Катастрофа' :
                     room.phase === 'game' ? `Раунд ${room.round}` :
                     room.phase === 'voting' ? 'Голосование' : 'Итоги'}
                  </span>
                </div>
              </div>
              <div style={{ color: '#aaa' }}>
                Выживших: <span style={{ color: '#fff', fontWeight: 700 }}>{room.players.filter(p => !p.isEliminated).length}</span>
                {' / '}
                Мест: <span style={{ color: '#d4af37', fontWeight: 700 }}>{room.settings.bunkerCapacity}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isHost ? '300px 1fr' : '1fr', gap: '24px' }}>
            {isHost && (
              <div>
                <HostPanel />
              </div>
            )}

            <div>
              {renderPhase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
