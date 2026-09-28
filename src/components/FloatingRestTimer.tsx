import React from 'react';
import { useApp } from '../context/AppContext';
import { Timer, X, Plus, Minus, Play, Pause } from 'lucide-react';

export const FloatingRestTimer: React.FC = () => {
  const { restTimer, stopRestTimer, adjustRestTimer } = useApp();

  if (!restTimer.active && restTimer.secondsRemaining === 0) {
    return null;
  }

  const mins = Math.floor(restTimer.secondsRemaining / 60);
  const secs = restTimer.secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = restTimer.totalSeconds > 0
    ? ((restTimer.totalSeconds - restTimer.secondsRemaining) / restTimer.totalSeconds) * 100
    : 0;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-zinc-900 border border-zinc-700/80 text-white rounded-2xl shadow-2xl p-3 flex items-center gap-3 backdrop-blur-xl ring-1 ring-white/10 min-w-[260px]">
        {/* Progress ring or icon */}
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400">
          <Timer className="w-5 h-5 animate-pulse" />
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-zinc-800"
            />
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={119}
              strokeDashoffset={119 - (119 * progressPercent) / 100}
              className="text-indigo-500 transition-all duration-300"
            />
          </svg>
        </div>

        {/* Timer info */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-zinc-400 truncate">
            {restTimer.label || 'Intervalo de descanso'}
          </div>
          <div className="font-mono text-xl font-bold tracking-tight text-white">
            {timeFormatted}
          </div>
        </div>

        {/* Adjust actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustRestTimer(15)}
            title="+15s"
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => adjustRestTimer(-15)}
            title="-15s"
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={stopRestTimer}
            title="Fechar cronômetro"
            className="p-1.5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
