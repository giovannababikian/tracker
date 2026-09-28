import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  X,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Tag,
  Check,
  Edit3,
} from 'lucide-react';
import { DAYS_SHORT_PT } from '../data/defaultPlans';

interface TaskDetailTabProps {
  activityId: string;
  dateStr?: string;
  tabId: string;
}

export const TaskDetailTab: React.FC<TaskDetailTabProps> = ({
  activityId,
  dateStr = new Date().toISOString().slice(0, 10),
  tabId,
}) => {
  const {
    activities,
    saveActivity,
    closeTab,
    toggleCompletion,
    isCompleted,
    saveActivityNotes,
    getActivityNotes,
    toggleSubTask,
    openActivityEditTab,
  } = useApp();

  const { theme } = useAuth();
  const isLight = theme === 'light';

  const activity = activities.find((a) => a.id === activityId);

  // Local state for notes to make typing instant
  const [noteText, setNoteText] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Task timer (e.g. 30 min reading)
  const [timerRunning, setTimerRunning] = useState(false);
  const [taskSecondsRemaining, setTaskSecondsRemaining] = useState(
    (activity?.duration || 30) * 60
  );

  useEffect(() => {
    if (activity) {
      setNoteText(getActivityNotes(activity.id, dateStr));
      setTaskSecondsRemaining((activity.duration || 30) * 60);
    }
  }, [activityId, dateStr]);

  // Focus timer interval
  useEffect(() => {
    let int: any = null;
    if (timerRunning && taskSecondsRemaining > 0) {
      int = setInterval(() => {
        setTaskSecondsRemaining((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(int);
  }, [timerRunning, taskSecondsRemaining]);

  if (!activity) {
    return (
      <div className={`p-6 text-center ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
        <p>Atividade não encontrada.</p>
        <button
          onClick={() => closeTab(tabId)}
          className={`mt-4 px-4 py-2 rounded-lg text-white ${isLight ? 'bg-slate-900' : 'bg-zinc-800'}`}
        >
          Fechar aba
        </button>
      </div>
    );
  }

  const completed = isCompleted(activity.id, dateStr);

  const handleNotesChange = (val: string) => {
    setNoteText(val);
    saveActivityNotes(activity.id, dateStr, val);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const newSt = {
      id: `st_${Date.now()}`,
      text: newSubtaskText.trim(),
      completed: false,
    };
    const updatedSubtasks = [...(activity.subtasks || []), newSt];
    saveActivity({ ...activity, subtasks: updatedSubtasks });
    setNewSubtaskText('');
  };

  const handleDeleteSubtask = (stId: string) => {
    const updatedSubtasks = (activity.subtasks || []).filter((s) => s.id !== stId);
    saveActivity({ ...activity, subtasks: updatedSubtasks });
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col h-full border-l transition-colors ${
      isLight
        ? 'bg-slate-50 text-slate-900 border-slate-200'
        : 'bg-zinc-900/90 text-zinc-100 border-zinc-800/80 backdrop-blur-xl'
    }`}>
      {/* Header */}
      <div className={`p-4 sm:p-5 border-b sticky top-0 z-20 backdrop-blur-md ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-950/70 border-zinc-800'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${activity.color || '#3b82f6'}25`,
                color: activity.color || '#3b82f6',
              }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {activity.name}
                </h2>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                }`}>
                  {activity.category}
                </span>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-2 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                <span>{activity.time ? `Às ${activity.time}` : 'Sem horário fixo'}</span>
                <span>·</span>
                <span>{activity.duration} min</span>
                <span>·</span>
                <span>{activity.preferred ? 'Preferencial' : 'Flexível'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => openActivityEditTab(activity.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Configurar atividade"
            >
              <Edit3 className="w-4 h-4" />
            </button>
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

        {/* Completion status bar */}
        <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-3 ${
          isLight ? 'border-slate-200' : 'border-zinc-800/80'
        }`}>
          <button
            onClick={() => toggleCompletion(activity.id, dateStr)}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow-sm ${
              completed
                ? isLight
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
            }`}
          >
            {completed ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Concluído no dia ({dateStr})
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-zinc-400" />
                Marcar como concluído hoje
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* Focus Timer Card */}
        {activity.duration > 0 && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Cronômetro de Foco</div>
                <div className={`font-mono text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {formatTimer(taskSecondsRemaining)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  timerRunning
                    ? isLight
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timerRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTaskSecondsRemaining((activity.duration || 30) * 60);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title="Resetar tempo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Subtasks Checklist */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              Etapas & Checklist:
            </span>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
              {(activity.subtasks || []).filter((s) => s.completed).length} de{' '}
              {(activity.subtasks || []).length} concluídos
            </span>
          </div>

          <div className="space-y-1.5">
            {(activity.subtasks || []).map((st) => (
              <div
                key={st.id}
                className={`flex items-center justify-between gap-2 p-2 rounded-xl border group transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80'
                }`}
              >
                <button
                  onClick={() => toggleSubTask(activity.id, st.id)}
                  className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                >
                  {st.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-400 shrink-0 group-hover:text-zinc-600" />
                  )}
                  <span
                    className={`text-xs ${
                      st.completed
                        ? isLight ? 'text-slate-400 line-through' : 'text-zinc-500 line-through'
                        : isLight ? 'text-slate-800' : 'text-zinc-300'
                    }`}
                  >
                    {st.text}
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteSubtask(st.id)}
                  className="text-zinc-400 hover:text-rose-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover etapa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Input */}
          <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="+ Adicionar etapa ou passo..."
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              className={`flex-1 border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
              }`}
            />
            <button
              type="submit"
              className={`p-2 rounded-xl transition-colors ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
              title="Adicionar"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Rich Notes Editor */}
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Anotações, Orientações & Diário:
            </span>
            <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Salva automaticamente</span>
          </div>

          <textarea
            rows={8}
            value={noteText}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Escreva anotações, detalhes da rotina, observações, livros lidos, ideias ou orientações para esta atividade..."
            className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
            }`}
          />
        </div>

        {/* Schedule & Rules details */}
        <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <div className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Regra de Programação:</span>
          </div>
          <div className={`grid grid-cols-2 gap-2 pt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            <div className={`p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <div className={`text-[10px] uppercase ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Frequência</div>
              <div className={`font-medium capitalize mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                {activity.frequency === 'daily'
                  ? 'Todos os dias'
                  : activity.frequency === 'weekly'
                  ? 'Dias da semana'
                  : activity.frequency === 'times'
                  ? `${activity.times || 2}x por semana`
                  : 'Mensal'}
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <div className={`text-[10px] uppercase ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Dias Ativos</div>
              <div className={`font-medium mt-0.5 ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                {activity.frequency === 'daily'
                  ? 'Todos'
                  : activity.days.map((d) => DAYS_SHORT_PT[Number(d)]).join(', ') || 'Nenhum'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
