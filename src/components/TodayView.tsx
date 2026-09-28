import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DAYS_PT, isActivityScheduledForDate, getFormattedDateKey } from '../data/defaultPlans';
import {
  CheckCircle2,
  Circle,
  Dumbbell,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    activities,
    selectedDate,
    setSelectedDate,
    toggleCompletion,
    isCompleted,
    openWorkoutTab,
    openTaskNotesTab,
    openActivityEditTab,
    getWorkoutProgress,
  } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Parse current date object
  const currentDate = new Date(`${selectedDate}T12:00:00`);
  const isToday = selectedDate === getFormattedDateKey(new Date());

  // Filter activities scheduled for this date
  const scheduledActivities = activities.filter((a) =>
    isActivityScheduledForDate(a, currentDate)
  );

  const categories = [
    'all',
    ...Array.from(new Set(scheduledActivities.map((a) => a.category))),
  ];

  const filtered =
    categoryFilter === 'all'
      ? scheduledActivities
      : scheduledActivities.filter((a) => a.category === categoryFilter);

  const completedCount = scheduledActivities.filter((a) =>
    isCompleted(a.id, selectedDate)
  ).length;

  const totalCount = scheduledActivities.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Date navigation handlers
  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(getFormattedDateKey(d));
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(getFormattedDateKey(d));
  };

  const handleJumpToday = () => {
    setSelectedDate(getFormattedDateKey(new Date()));
  };

  const dayOfWeekIndex = currentDate.getDay();
  const dayNamePt = DAYS_PT[dayOfWeekIndex];
  const capitalizedDay = dayNamePt.charAt(0).toUpperCase() + dayNamePt.slice(1);
  const formattedDateBR = currentDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleCardClick = (activity: (typeof activities)[0]) => {
    if (activity.trainingId) {
      openWorkoutTab(activity.trainingId, selectedDate, activity.name);
    } else {
      openTaskNotesTab(activity.id, selectedDate, activity.name);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Date Header & Quick Navigation */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white/80 border-slate-200/90 shadow-sm backdrop-blur-xl'
            : 'bg-zinc-900/60 border-zinc-800/80 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {capitalizedDay}
              </h2>
              {isToday && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Hoje
                </span>
              )}
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {formattedDateBR}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={handlePrevDay}
              className={`p-2 rounded-xl border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
              title="Dia anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {!isToday && (
              <button
                onClick={handleJumpToday}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                }`}
              >
                Voltar p/ Hoje
              </button>
            )}
            <button
              onClick={handleNextDay}
              className={`p-2 rounded-xl border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
              title="Próximo dia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar and Summary */}
        <div className="mt-4 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              {completedCount} de {totalCount} atividades concluídas
            </span>
            <span className="font-mono font-bold text-indigo-400 text-sm">
              {progressPercent}%
            </span>
          </div>

          <div className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800/80'}`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-zinc-800/40 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? isLight
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                    : isLight
                    ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activity Cards List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className={`p-8 text-center rounded-3xl border text-xs ${isLight ? 'bg-white/50 border-slate-200 text-slate-500' : 'bg-zinc-900/30 border-zinc-800/70 text-zinc-400'} space-y-3`}>
            <p>Nenhuma atividade programada para este dia.</p>
            <button
              onClick={() => openActivityEditTab()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Criar Nova Atividade
            </button>
          </div>
        ) : (
          filtered.map((activity) => {
            const completed = isCompleted(activity.id, selectedDate);
            const isWorkout = !!activity.trainingId;
            const workoutProgress = isWorkout
              ? getWorkoutProgress(activity.trainingId!, selectedDate)
              : null;

            return (
              <div
                key={activity.id}
                onClick={() => handleCardClick(activity)}
                className={`group rounded-2xl border transition-all duration-200 p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none ${
                  completed
                    ? isLight
                      ? 'bg-slate-50 border-emerald-300/40 opacity-70'
                      : 'bg-zinc-950/40 border-emerald-900/20 opacity-70'
                    : isLight
                    ? 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 shadow-lg'
                }`}
              >
                {/* Left check & info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompletion(activity.id, selectedDate);
                    }}
                    className="text-zinc-500 hover:text-emerald-400 transition-colors p-0.5"
                    title={completed ? 'Desmarcar' : 'Concluir atividade'}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-5 sm:h-5 text-emerald-400" />
                    ) : (
                      <Circle className={`w-5 h-5 sm:w-5 sm:h-5 ${isLight ? 'text-slate-300 hover:text-slate-500' : 'text-zinc-700 hover:text-zinc-400'}`} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm sm:text-base font-semibold tracking-tight transition-colors ${
                          completed
                            ? 'text-zinc-500 line-through'
                            : isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {activity.name}
                      </h3>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${
                        isLight ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50'
                      }`}>
                        {activity.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-zinc-400">
                      {activity.time && (
                        <span className={`inline-flex items-center gap-1 font-mono ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {activity.time}
                        </span>
                      )}
                      {activity.duration > 0 && <span>{activity.duration}m</span>}
                      <span>·</span>
                      <span className="text-[11px] text-zinc-500">
                        {activity.preferred ? 'Preferencial' : 'Flexível'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Tag */}
                <div className="flex items-center gap-2 shrink-0">
                  {isWorkout ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Treino</span>
                      {workoutProgress && workoutProgress.completedCount > 0 && (
                        <span className="font-mono text-[10px]">
                          {workoutProgress.completedCount}/{workoutProgress.totalCount}
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      <span className="text-[11px] hidden sm:inline">Abrir notas</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

