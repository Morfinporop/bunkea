import { useState } from 'react';
import { useGame } from '../../GameContext';
import { SettingsIcon, TimerIcon, PlayIcon, PauseIcon } from '../Icons';

export default function HostPanel() {
  const { room, startTimer, stopTimer, startVoting, setPhase, nextRound } = useGame();
  const [customTimer, setCustomTimer] = useState(60);

  if (!room) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-5 h-5 text-yellow-500" />
        <div className="text-white font-bold">Панель ведущего</div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-900/50 border border-gray-800 rounded p-3 text-center">
          <div className="text-gray-500 text-xs mb-1">Текущая фаза</div>
          <div className="text-white font-bold capitalize">{room.phase}</div>
        </div>

        <div>
          <div className="text-gray-400 text-xs mb-2">Таймер:</div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[15, 30, 60, 120].map(t => (
              <button
                key={t}
                onClick={() => setCustomTimer(t)}
                className={`py-2 text-xs rounded border transition ${
                  customTimer === t ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-800'
                }`}
              >
                {t}с
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => startTimer(customTimer)} className="btn-primary py-2 text-xs flex items-center justify-center gap-1">
              <PlayIcon className="w-3 h-3" /> Старт
            </button>
            <button onClick={stopTimer} className="btn-primary py-2 text-xs flex items-center justify-center gap-1">
              <PauseIcon className="w-3 h-3" /> Стоп
            </button>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3 space-y-2">
          <button onClick={() => setPhase('catastrophe')} className="w-full btn-primary py-2 text-sm">Катастрофа</button>
          <button onClick={() => setPhase('game')} className="w-full btn-primary py-2 text-sm">Игра</button>
          <button onClick={() => nextRound()} className="w-full btn-primary py-2 text-sm">След. раунд</button>
          <button onClick={() => startVoting()} className="w-full btn-accent py-2 text-sm">Голосование</button>
        </div>
      </div>
    </div>
  );
}
