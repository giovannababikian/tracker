import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  DAYS_PT,
  getMondayOfWeek,
  getWeekDays,
  getFormattedDateKey,
  isActivityScheduledForDate,
} from '../data/defaultPlans';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const WeekView: React.FC = () => {
  const {
    activities,
    selectedDate,
    setSelectedDate,
    toggleCompletion,
    isCompleted,
    openWorkoutTab,
    openTaskNotesTab,
    getWorkoutProgress,
  } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  // Week navigation base date
  const [weekBaseDate, setWeekBaseDate] = useState<Date>(
    getMondayOfWeek(new Date(`${selectedDate}T12:00:00`))
  );

  const weekDays = getWeekDays(weekBaseDate);
  const todayKey = getFormattedDateKey(new Date());

  const handlePrevWeek = () => {
    const next = new Date(weekBaseDate);
    next.setDate(next.getDate() - 7);
    setWeekBaseDate(next);
  };

  const handleNextWeek = () => {
    const next = new Date(weekBaseDate);
    next.setDate(next.getDate() + 7);
    setWeekBaseDate(next);
  };

  const handleCurrentWeek = () => {
    setWeekBaseDate(getMondayOfWeek(new Date()));
  };

  // Calculate overall weekly stats
  let totalScheduledWeek = 0;
  let totalDoneWeek = 0;

  weekDays.forEach((day) => {
    const dayKey = getFormattedDateKey(day);
    const dayActivities = activities.filter((a) => isActivityScheduledForDate(a, day));
    totalScheduledWeek += dayActivities.length;
    dayActivities.forEach((a) => {
      if (isCompleted(a.id, dayKey)) {
        totalDoneWeek++;
      }
    });
  });

  const weekProgressPercent =
    totalScheduledWeek > 0 ? Math.round((totalDoneWeek / totalScheduledWeek) * 100) : 0;

  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
  const weekRangeLabel = `${firstDay.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
  })} a ${lastDay.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  const handleRowClick = (activity: (typeof activities)[0], dateKey: string) => {
    if (activity.trainingId) {
      openWorkoutTab(activity.trainingId, dateKey, activity.name);
    } else {
      openTaskNotesTab(activity.id, dateKey, activity.name);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Week Header & Stats Card */}
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
                Visão Semanal
              </h2>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                7 Dias
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {weekRangeLabel}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={handlePrevWeek}
              className={`p-2 rounded-xl border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
              title="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleCurrentWeek}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={handleNextWeek}
              className={`p-2 rounded-xl border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
              title="Próxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mt-4 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {totalDoneWeek} de {totalScheduledWeek} hábitos concluídos na semana
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {weekProgressPercent}%
            </span>
          </div>

          <div className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800/80'}`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${weekProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week Days List */}
      <div className="space-y-3">
        {weekDays.map((day) => {
          const dateKey = getFormattedDateKey(day);
          const isCurrentToday = dateKey === todayKey;
          const dayIndex = day.getDay();
          const dayName = DAYS_PT[dayIndex];
          const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);

          const dayActivities = activities.filter((a) => isActivityScheduledForDate(a, day));
          const dayDoneCount = dayActivities.filter((a) => isCompleted(a.id, dateKey)).length;
          const dayTotalCount = dayActivities.length;
          const dayPct = dayTotalCount > 0 ? Math.round((dayDoneCount / dayTotalCount) * 100) : 0;

          return (
            <div
              key={dateKey}
              className={`rounded-2xl sm:rounded-3xl border transition-all p-3.5 sm:p-5 ${
                isCurrentToday
                  ? isLight
                    ? 'bg-white border-indigo-300 shadow-md ring-1 ring-indigo-200'
                    : 'bg-zinc-900/80 border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-xl'
                  : isLight
                  ? 'bg-white/70 border-slate-200/80'
                  : 'bg-zinc-900/40 border-zinc-800/70'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDate(dateKey)}
                    className="text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm sm:text-base font-bold transition-colors ${isLight ? 'text-slate-900 group-hover:text-indigo-600' : 'text-white group-hover:text-indigo-400'}`}>
                        {capitalized}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        {day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </span>
                      {isCurrentToday && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Hoje
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-zinc-500 text-[11px]">
                    {dayDoneCount}/{dayTotalCount}
                  </span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      dayPct === 100
                        ? 'text-emerald-400'
                        : dayPct > 0
                        ? 'text-indigo-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {dayPct}%
                  </span>
                </div>
              </div>

              {/* Day's Activities List */}
              <div className="divide-y divide-zinc-800/40 mt-1">
                {dayActivities.length === 0 ? (
                  <div className="py-3 text-center text-xs text-zinc-500">
                    Nenhuma atividade nesta data (Descanso).
                  </div>
                ) : (
                  dayActivities.map((activity) => {
                    const completed = isCompleted(activity.id, dateKey);
                    const isWorkout = !!activity.trainingId;
                    const workoutProgress = isWorkout
                      ? getWorkoutProgress(activity.trainingId!, dateKey)
                      : null;

                    return (
                      <div
                        key={activity.id}
                        onClick={() => handleRowClick(activity, dateKey)}
                        className={`py-2 px-1.5 flex items-center justify-between gap-3 group cursor-pointer rounded-xl transition-all ${
                          isLight ? 'hover:bg-slate-100/60' : 'hover:bg-zinc-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompletion(activity.id, dateKey);
                            }}
                            className="text-zinc-500 hover:text-emerald-400 transition-colors p-0.5"
                          >
                            {completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className={`w-4 h-4 ${isLight ? 'text-slate-300 hover:text-slate-500' : 'text-zinc-700 hover:text-zinc-400'}`} />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-xs sm:text-sm font-semibold block truncate ${
                                completed
                                  ? 'text-zinc-500 line-through'
                                  : isLight ? 'text-slate-900' : 'text-zinc-200'
                              }`}
                            >
                              {activity.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                              <span>{activity.category}</span>
                              {activity.time && (
                                <>
                                  <span>·</span>
                                  <span className="font-mono">{activity.time}</span>
                                </>
                              )}
                              {activity.duration > 0 && (
                                <>
                                  <span>·</span>
                                  <span>{activity.duration}m</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Direct Tab Indicator */}
                        <div className="flex items-center gap-1.5">
                          {isWorkout ? (
                            <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md text-[11px] font-semibold flex items-center gap-1">
                              <Dumbbell className="w-3 h-3" />
                              <span className="hidden sm:inline">Treino</span>
                              {workoutProgress && workoutProgress.completedCount > 0 && (
                                <span className="text-[10px] font-mono">
                                  ({workoutProgress.completedCount}/{workoutProgress.totalCount})
                                </span>
                              )}
                            </div>
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

