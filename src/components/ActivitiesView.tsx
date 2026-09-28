import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Activity } from '../types';
import { DAYS_SHORT_PT } from '../data/defaultPlans';
import {
  Plus,
  Search,
  Dumbbell,
  Edit2,
  Copy,
  Trash2,
  Pause,
  Play,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ActivitiesViewProps {
  onOpenEdit: (activityId?: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ onOpenEdit }) => {
  const {
    activities,
    duplicateActivity,
    deleteActivity,
    toggleActivityActive,
    openWorkoutTab,
    openTaskNotesTab,
  } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  const categories = ['all', ...Array.from(new Set(activities.map((a) => a.category)))];

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.notes && act.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || act.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && act.active) ||
      (statusFilter === 'paused' && !act.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = activities.filter((a) => a.active).length;
  const pausedCount = activities.filter((a) => !a.active).length;

  const handleCardClick = (act: Activity) => {
    if (act.trainingId) {
      openWorkoutTab(act.trainingId, undefined, act.name);
    } else {
      openTaskNotesTab(act.id, undefined, act.name);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
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
                Hábitos & Rotinas
              </h2>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                {activities.length} cadastrados
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Personalize regras, periodicidades, treinos e notas para cada hábito
            </p>
          </div>

          <button
            onClick={() => onOpenEdit()}
            className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Atividade</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
              }`}
            />
          </div>

          {/* Status buttons */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border self-start sm:self-auto text-xs ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'bg-zinc-800 text-white shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({activities.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'active'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'bg-zinc-800 text-white shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ativos ({activeCount})
            </button>
            {pausedCount > 0 && (
              <button
                onClick={() => setStatusFilter('paused')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === 'paused'
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'bg-zinc-800 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-500 hover:text-slate-800'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Pausados ({pausedCount})
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-zinc-800/40 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? isLight
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                    : isLight
                    ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'all' ? 'Todas as Categorias' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activities Grid / List */}
      <div className="space-y-2.5">
        {filteredActivities.length === 0 ? (
          <div className={`p-8 text-center rounded-3xl border text-xs ${isLight ? 'bg-white/50 border-slate-200 text-slate-500' : 'bg-zinc-900/30 border-zinc-800/70 text-zinc-400'}`}>
            Nenhuma atividade encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isWorkout = !!act.trainingId;

            return (
              <div
                key={act.id}
                onClick={() => handleCardClick(act)}
                className={`rounded-2xl border p-3.5 sm:p-4 transition-all cursor-pointer group ${
                  act.active
                    ? isLight
                      ? 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-xs'
                      : 'bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 shadow-md'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        backgroundColor: `${act.color || '#3b82f6'}20`,
                        color: act.color || '#3b82f6',
                      }}
                    >
                      {isWorkout ? (
                        <Dumbbell className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm sm:text-base font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {act.name}
                        </h3>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${
                          isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                        }`}>
                          {act.category}
                        </span>
                        {!act.active && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Pausado
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          {act.frequency === 'daily'
                            ? 'Diário'
                            : act.frequency === 'weekly'
                            ? act.days.map((d) => DAYS_SHORT_PT[Number(d)]).join(', ')
                            : act.frequency === 'times'
                            ? `${act.times || 2}x por semana`
                            : 'Mensal'}
                        </span>
                        {act.time && (
                          <>
                            <span>·</span>
                            <span className={`flex items-center gap-1 font-mono ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {act.time}
                            </span>
                          </>
                        )}
                        {act.duration > 0 && (
                          <>
                            <span>·</span>
                            <span>{act.duration}m</span>
                          </>
                        )}
                      </div>

                      {act.notes && (
                        <p className="text-xs text-zinc-500 mt-1.5 line-clamp-1 italic">
                          "{act.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Tab Launchers */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60"
                  >
                    {isWorkout && (
                      <button
                        onClick={() => openWorkoutTab(act.trainingId!, undefined, act.name)}
                        className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Abrir ficha do treino ao lado"
                      >
                        <Dumbbell className="w-3 h-3" />
                        <span>Treino</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenEdit(act.id)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Editar regras e horários"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => duplicateActivity(act.id)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Duplicar atividade"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleActivityActive(act.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        act.active
                          ? 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800'
                          : 'text-amber-400 hover:text-white hover:bg-amber-500/20'
                      }`}
                      title={act.active ? 'Pausar atividade' : 'Reativar atividade'}
                    >
                      {act.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Excluir a atividade "${act.name}"?`)) {
                          deleteActivity(act.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
