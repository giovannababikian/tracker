import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_WORKOUTS } from '../data/defaultPlans';
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Timer,
  Info,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Check,
  Zap,
} from 'lucide-react';

export const WorkoutsPlanView: React.FC = () => {
  const { workouts, workoutLogs, toggleExerciseDone, startRestTimer, openWorkoutTab, selectedDate } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [selectedWorkoutKey, setSelectedWorkoutKey] = useState<string>('treino_a');

  const workoutList = Object.values(workouts);
  const currentWorkout = workouts[selectedWorkoutKey] || DEFAULT_WORKOUTS[selectedWorkoutKey] || workoutList[0];

  const logKey = `${currentWorkout.id}_${selectedDate}`;
  const currentLog = workoutLogs[logKey] || { exercises: {} };

  // Calculate completed exercises count in this workout for the selected date
  const completedCount = currentWorkout.exercises.filter(
    (ex) => currentLog.exercises?.[ex.id]?.completed
  ).length;
  const totalCount = currentWorkout.exercises.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4 pb-24">
      {/* Futuristic Hero / Header */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white/80 border-slate-200/80 shadow-sm backdrop-blur-xl'
            : 'bg-zinc-900/60 border-zinc-800/80 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Plano de Treino Transcrito
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Oficial · 1 Página
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Transcreve fielmente a rotina: Seg CrossFit • Ter Musc A • Qua Comp • Qui Musc B • Sex CrossFit
                </p>
              </div>
            </div>
          </div>

          {/* Open interactive set tracker in side tab */}
          <button
            onClick={() => openWorkoutTab(currentWorkout.id, selectedDate, currentWorkout.title)}
            className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4" />
            <span>Abrir Painel Interativo de Séries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekly Split Schedule Bar */}
        <div className="mt-5 pt-4 border-t border-zinc-800/60 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
          <div className={`p-2.5 rounded-xl border text-center ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'}`}>
            <span className="text-[10px] text-zinc-500 font-mono block">Segunda</span>
            <span className="font-bold text-rose-400 text-xs">CrossFit</span>
          </div>
          <button
            onClick={() => setSelectedWorkoutKey('treino_a')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              selectedWorkoutKey === 'treino_a'
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 ring-1 ring-cyan-500/30 font-bold scale-[1.02]'
                : isLight ? 'bg-slate-100/70 border-slate-200 hover:border-slate-300' : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] text-zinc-500 font-mono block">Terça</span>
            <span className="text-xs">Musculação A</span>
          </button>
          <button
            onClick={() => setSelectedWorkoutKey('treino_quarta')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              selectedWorkoutKey === 'treino_quarta'
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/30 font-bold scale-[1.02]'
                : isLight ? 'bg-slate-100/70 border-slate-200 hover:border-slate-300' : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] text-zinc-500 font-mono block">Quarta</span>
            <span className="text-xs">Complementar</span>
          </button>
          <button
            onClick={() => setSelectedWorkoutKey('treino_b')}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              selectedWorkoutKey === 'treino_b'
                ? 'bg-violet-500/20 border-violet-500/60 text-violet-300 ring-1 ring-violet-500/30 font-bold scale-[1.02]'
                : isLight ? 'bg-slate-100/70 border-slate-200 hover:border-slate-300' : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] text-zinc-500 font-mono block">Quinta</span>
            <span className="text-xs">Musculação B</span>
          </button>
          <div className={`p-2.5 rounded-xl border text-center ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'}`}>
            <span className="text-[10px] text-zinc-500 font-mono block">Sexta</span>
            <span className="font-bold text-rose-400 text-xs">CrossFit</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'}`}>
            <span className="text-[10px] text-zinc-500 font-mono block">Sáb / Dom</span>
            <span className="text-zinc-400 text-xs">Descanso</span>
          </div>
        </div>
      </div>

      {/* Active Workout Sheet */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white/90 border-slate-200 shadow-md backdrop-blur-xl'
            : 'bg-zinc-900/80 border-zinc-800/80 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentWorkout.color }}
              />
              <h3 className="text-lg sm:text-xl font-black tracking-tight">{currentWorkout.title}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-300">
                {currentWorkout.dayName} · {currentWorkout.estimatedMinutes} min
              </span>
            </div>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {currentWorkout.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-medium text-zinc-400">Progresso do dia ({selectedDate})</div>
              <div className="text-sm font-mono font-bold text-cyan-400">
                {completedCount}/{totalCount} concluídos ({progressPercent}%)
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className={isLight ? 'text-slate-200' : 'text-zinc-800'}
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke={currentWorkout.color || '#06b6d4'}
                  strokeWidth="3.5"
                  strokeDasharray={126}
                  strokeDashoffset={126 - (126 * progressPercent) / 100}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute text-[11px] font-bold font-mono">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Instructions & Progression Note */}
        {currentWorkout.instructions && (
          <div className="mt-4 p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Aquecimento e Finalização:</span>
              <span className="text-zinc-400 leading-relaxed">{currentWorkout.instructions}</span>
            </div>
          </div>
        )}

        {currentWorkout.progressionNote && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-300 flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-200 block">Regra de Dupla Progressão:</span>
              <span className="text-indigo-300/80 leading-relaxed">{currentWorkout.progressionNote}</span>
            </div>
          </div>
        )}

        {/* Transcribed Table of Exercises with Checkbox */}
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[620px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-800/80">
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center">Fase</div>
              <div className="col-span-4">Exercício</div>
              <div className="col-span-2 text-center">Séries × reps</div>
              <div className="col-span-2 text-center">RIR / Esforço</div>
              <div className="col-span-2 text-center">Descanso</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-800/50">
              {currentWorkout.exercises.map((ex) => {
                const isDone = !!currentLog.exercises?.[ex.id]?.completed;

                return (
                  <div
                    key={ex.id}
                    onClick={() => toggleExerciseDone(currentWorkout.id, selectedDate, ex.id, ex.targetSets || 3)}
                    className={`grid grid-cols-12 gap-2 py-3 px-3 items-center rounded-xl transition-all cursor-pointer select-none ${
                      isDone
                        ? isLight
                          ? 'bg-emerald-50/80 text-slate-500'
                          : 'bg-emerald-950/15 text-zinc-400'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-900'
                        : 'hover:bg-zinc-800/50 text-white'
                    }`}
                  >
                    {/* Checkbox Column */}
                    <div className="col-span-1 flex items-center justify-center">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 hover:text-cyan-400 transition-colors" />
                      )}
                    </div>

                    {/* Phase Column */}
                    <div className="col-span-1 text-center">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800/70 text-zinc-400 border border-zinc-700/40">
                        {ex.phase}
                      </span>
                    </div>

                    {/* Exercise Name */}
                    <div className="col-span-4 font-semibold text-xs sm:text-sm">
                      <span className={isDone ? 'line-through text-zinc-500' : ''}>
                        {ex.name}
                      </span>
                    </div>

                    {/* Sets x Reps */}
                    <div className="col-span-2 text-center font-mono text-xs font-medium text-cyan-300">
                      {ex.setsReps}
                    </div>

                    {/* RIR */}
                    <div className="col-span-2 text-center text-xs">
                      {ex.rirRpe && ex.rirRpe !== '—' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                          {ex.rirRpe}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>

                    {/* Rest with Timer Button */}
                    <div className="col-span-2 text-center text-xs">
                      {ex.rest && ex.rest !== '—' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRestTimer(ex.restSeconds || 60, `Descanso: ${ex.name}`);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium transition-colors"
                          title="Iniciar cronômetro de descanso"
                        >
                          <Timer className="w-3 h-3 text-indigo-400" />
                          <span>{ex.rest}</span>
                        </button>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="mt-5 pt-4 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Dica: clique em qualquer exercício para alternar o checkbox de conclusão.</span>
          </div>
          <button
            onClick={() => openWorkoutTab(currentWorkout.id, selectedDate, currentWorkout.title)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Ver séries, cargas (kg) e repetições em painel lateral</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
