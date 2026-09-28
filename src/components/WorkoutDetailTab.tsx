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
  X,
  Maximize2,
  Minimize2,
  Save,
  Check,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';

interface WorkoutDetailTabProps {
  trainingId: string;
  dateStr?: string;
  tabId: string;
  onClose?: () => void;
}

export const WorkoutDetailTab: React.FC<WorkoutDetailTabProps> = ({
  trainingId,
  dateStr = new Date().toISOString().slice(0, 10),
  tabId,
  onClose,
}) => {
  const {
    workouts,
    workoutLogs,
    updateWorkoutLogSet,
    toggleExerciseDone,
    saveWorkoutNotes,
    getWorkoutProgress,
    startRestTimer,
    closeTab,
    toggleCompletion,
    activities,
    isCompleted,
  } = useApp();

  const { theme } = useAuth();
  const isLight = theme === 'light';

  const workoutDef = workouts[trainingId] || DEFAULT_WORKOUTS[trainingId];
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('all');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  if (!workoutDef) {
    return (
      <div className="p-6 text-center text-zinc-400">
        <p>Ficha de treino não encontrada.</p>
        <button
          onClick={() => closeTab(tabId)}
          className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700"
        >
          Fechar aba
        </button>
      </div>
    );
  }

  const logKey = `${trainingId}_${dateStr}`;
  const currentLog = workoutLogs[logKey] || {
    date: dateStr,
    workoutId: trainingId,
    exercises: {},
    overallNotes: '',
  };

  const progress = getWorkoutProgress(trainingId, dateStr);

  // Find linked habit activity if any (e.g. musca_ter for treino_a)
  const linkedActivity = activities.find((a) => a.trainingId === trainingId);
  const isHabitChecked = linkedActivity ? isCompleted(linkedActivity.id, dateStr) : false;

  const handleFinishWorkout = () => {
    // If not checked in today's habits, mark it completed!
    if (linkedActivity && !isHabitChecked) {
      toggleCompletion(linkedActivity.id, dateStr);
    }
  };

  // Unique phases for filter tabs
  const phases = ['all', ...Array.from(new Set(workoutDef.exercises.map((e) => e.phase)))];

  const filteredExercises =
    activePhaseFilter === 'all'
      ? workoutDef.exercises
      : workoutDef.exercises.filter((e) => e.phase === activePhaseFilter);

  return (
    <div className={`flex flex-col h-full border-l transition-colors ${
      isLight
        ? 'bg-slate-50 text-slate-900 border-slate-200'
        : 'bg-zinc-900/90 text-zinc-100 border-zinc-800/80 backdrop-blur-xl'
    }`}>
      {/* Top sticky header */}
      <div className={`p-4 sm:p-5 border-b sticky top-0 z-20 backdrop-blur-md ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-950/70 border-zinc-800'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${workoutDef.color}25`, color: workoutDef.color }}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {workoutDef.title}
                </h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                }`}>
                  {workoutDef.dayName}
                </span>
              </div>
              <p className={`text-xs mt-0.5 line-clamp-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {workoutDef.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => closeTab(tabId)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Fechar aba"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Actions */}
        <div className={`mt-4 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
          isLight ? 'border-slate-200' : 'border-zinc-800/80'
        }`}>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className={`flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                Progresso: {progress.completedCount} de {progress.totalCount} exercícios
              </span>
              <span className="font-mono font-bold text-indigo-400">{progress.percent}%</span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`}>
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          {linkedActivity && (
            <button
              onClick={handleFinishWorkout}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                isHabitChecked
                  ? isLight
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {isHabitChecked ? 'Treino concluído no dia' : 'Marcar dia como feito'}
            </button>
          )}
        </div>

        {/* Phase Filter Tabs */}
        {phases.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
            {phases.map((ph) => (
              <button
                key={ph}
                onClick={() => setActivePhaseFilter(ph)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  activePhaseFilter === ph
                    ? isLight
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'bg-zinc-200 text-zinc-950 font-semibold shadow-sm'
                    : isLight
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {ph === 'all' ? 'Todos os Blocos' : `Bloco: ${ph}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Instructions & Progression Alert */}
        {workoutDef.instructions && (
          <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
            isLight ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
          }`}>
            <div className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
              <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Instruções da Sessão:</span>
            </div>
            <p className={`leading-relaxed pl-5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {workoutDef.instructions}
            </p>
          </div>
        )}

        {workoutDef.progressionNote && (
          <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
            isLight
              ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
              : 'bg-indigo-950/30 border-indigo-900/40 text-indigo-200'
          }`}>
            <div className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-indigo-900' : 'text-indigo-300'}`}>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Regra de Dupla Progressão:</span>
            </div>
            <p className={`leading-relaxed pl-5 ${isLight ? 'text-indigo-700' : 'text-indigo-200/80'}`}>
              {workoutDef.progressionNote}
            </p>
          </div>
        )}

        {/* Exercise List */}
        <div className="space-y-3">
          {filteredExercises.map((exercise, idx) => {
            const exLog = currentLog.exercises?.[exercise.id] || {
              completed: false,
              sets: [],
            };
            const isCompleted = !!exLog.completed;
            const targetSetsCount = exercise.targetSets || 3;

            return (
              <div
                key={exercise.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isCompleted
                    ? isLight
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-zinc-950/40 border-emerald-900/30'
                    : isLight
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    : 'bg-zinc-950/80 border-zinc-800/80 shadow-md hover:border-zinc-700'
                }`}
              >
                {/* Exercise Header */}
                <div className="p-3.5 sm:p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() =>
                        toggleExerciseDone(trainingId, dateStr, exercise.id, targetSetsCount)
                      }
                      className={`mt-0.5 transition-colors ${
                        isCompleted
                          ? 'text-emerald-500'
                          : isLight ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      title={isCompleted ? 'Desmarcar' : 'Concluir exercício'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          isLight
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-zinc-800/90 text-zinc-400 border-zinc-700/50'
                        }`}>
                          {exercise.phase}
                        </span>
                        <h3
                          className={`text-sm sm:text-base font-semibold tracking-tight ${
                            isCompleted
                              ? isLight ? 'text-slate-400 line-through' : 'text-zinc-400 line-through'
                              : isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {exercise.name}
                        </h3>
                      </div>

                      {/* Meta Tags: Sets, RIR, Rest */}
                      <div className={`flex flex-wrap items-center gap-2 mt-1.5 text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                        <span className={`font-medium px-2 py-0.5 rounded-md border ${
                          isLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                        }`}>
                          {exercise.setsReps}
                        </span>
                        {exercise.rirRpe && exercise.rirRpe !== '—' && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-md border ${
                            isLight
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'text-amber-300/90 bg-amber-950/30 border-amber-900/30'
                          }`}>
                            RIR: {exercise.rirRpe}
                          </span>
                        )}
                        {exercise.rest && exercise.rest !== '—' && (
                          <button
                            onClick={() =>
                              startRestTimer(
                                exercise.restSeconds || 60,
                                `Descanso: ${exercise.name}`
                              )
                            }
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                              isLight
                                ? 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                                : 'text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 hover:bg-indigo-900/50 border-indigo-800/40'
                            }`}
                            title="Iniciar cronômetro de descanso"
                          >
                            <Timer className="w-3 h-3 text-indigo-400" />
                            {exercise.rest}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Sets Logger */}
                {targetSetsCount > 0 && exercise.phase !== 'Aquecimento' && exercise.phase !== 'Final' && (
                  <div className={`px-3.5 pb-3.5 pt-1 border-t ${
                    isLight ? 'border-slate-100 bg-slate-50/60' : 'border-zinc-900/80 bg-zinc-900/30'
                  }`}>
                    <div className="text-[11px] font-medium mb-2 flex items-center justify-between">
                      <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>Registro de Séries & Cargas:</span>
                      <span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>Salva automaticamente</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {Array.from({ length: targetSetsCount }).map((_, setIdx) => {
                        const setLog = exLog.sets?.[setIdx] || {
                          weight: '',
                          reps: '',
                          done: false,
                        };

                        return (
                          <div
                            key={setIdx}
                            className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-xs transition-colors ${
                              setLog.done
                                ? isLight
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                                  : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                                : isLight
                                ? 'bg-white border-slate-200 text-slate-800'
                                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                            }`}
                          >
                            <span className={`font-mono font-semibold w-5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                              #{setIdx + 1}
                            </span>

                            {/* Weight input */}
                            <div className="flex items-center gap-1 flex-1">
                              <input
                                type="text"
                                placeholder="kg"
                                value={setLog.weight || ''}
                                onChange={(e) =>
                                  updateWorkoutLogSet(
                                    trainingId,
                                    dateStr,
                                    exercise.id,
                                    setIdx,
                                    'weight',
                                    e.target.value
                                  )
                                }
                                className={`w-full rounded px-1.5 py-1 text-center font-mono text-xs focus:outline-none ${
                                  isLight
                                    ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500'
                                    : 'bg-zinc-950 border border-zinc-800 text-white focus:border-indigo-500'
                                }`}
                              />
                            </div>

                            {/* Reps input */}
                            <div className="flex items-center gap-1 flex-1">
                              <input
                                type="text"
                                placeholder="reps"
                                value={setLog.reps || ''}
                                onChange={(e) =>
                                  updateWorkoutLogSet(
                                    trainingId,
                                    dateStr,
                                    exercise.id,
                                    setIdx,
                                    'reps',
                                    e.target.value
                                  )
                                }
                                className={`w-full rounded px-1.5 py-1 text-center font-mono text-xs focus:outline-none ${
                                  isLight
                                    ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500'
                                    : 'bg-zinc-950 border border-zinc-800 text-white focus:border-indigo-500'
                                }`}
                              />
                            </div>

                            {/* Set Done Checkbox */}
                            <button
                              onClick={() => {
                                const newDone = !setLog.done;
                                updateWorkoutLogSet(
                                  trainingId,
                                  dateStr,
                                  exercise.id,
                                  setIdx,
                                  'done',
                                  newDone
                                );
                                if (newDone && exercise.restSeconds) {
                                  startRestTimer(
                                    exercise.restSeconds,
                                    `Descanso Série ${setIdx + 1}`
                                  );
                                }
                              }}
                              className={`p-1 rounded transition-colors ${
                                setLog.done
                                  ? 'bg-emerald-500 text-white'
                                  : isLight
                                  ? 'bg-slate-200 text-slate-500 hover:text-slate-800'
                                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                              title={setLog.done ? 'Concluída' : 'Marcar série feita'}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Workout Notes */}
        <div className="pt-2">
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Notas da Sessão de Treino ({dateStr}):
              </span>
              <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Salvo automaticamente</span>
            </div>
            <textarea
              rows={3}
              value={currentLog.overallNotes || ''}
              onChange={(e) => saveWorkoutNotes(trainingId, dateStr, e.target.value)}
              placeholder="Ex: Como se sentiu hoje? Cargas que progrediu, dores ou ajustes para a próxima sessão..."
              className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
