import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Activity, DayOfWeek } from '../types';
import { DAYS_SHORT_PT } from '../data/defaultPlans';
import { X, Check, Dumbbell, Sparkles, Calendar, Clock } from 'lucide-react';

interface EditActivityModalProps {
  activityId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  activityId,
  isOpen,
  onClose,
}) => {
  const { activities, saveActivity, workouts } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'times' | 'monthly'>('weekly');
  const [days, setDays] = useState<DayOfWeek[]>(['1', '2', '3', '4', '5']);
  const [times, setTimes] = useState<number>(2);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [preferred, setPreferred] = useState(true);
  const [active, setActive] = useState(true);
  const [trainingId, setTrainingId] = useState<string>('');
  const [color, setColor] = useState('#3b82f6');
  const [notes, setNotes] = useState('');

  const currentActivity = activityId ? activities.find((a) => a.id === activityId) : null;

  useEffect(() => {
    if (currentActivity) {
      setName(currentActivity.name);
      setCategory(currentActivity.category);
      setFrequency(currentActivity.frequency);
      setDays(currentActivity.days || []);
      setTimes(currentActivity.times || 2);
      setTime(currentActivity.time || '');
      setDuration(currentActivity.duration || 30);
      setPreferred(!!currentActivity.preferred);
      setActive(currentActivity.active);
      setTrainingId(currentActivity.trainingId || '');
      setColor(currentActivity.color || '#3b82f6');
      setNotes(currentActivity.notes || '');
    } else {
      setName('');
      setCategory('Treinos');
      setFrequency('weekly');
      setDays(['1', '3', '5']);
      setTimes(3);
      setTime('06:00');
      setDuration(60);
      setPreferred(true);
      setActive(true);
      setTrainingId('');
      setColor('#06b6d4');
      setNotes('');
    }
  }, [currentActivity, isOpen]);

  if (!isOpen) return null;

  const handleToggleDay = (dayNum: DayOfWeek) => {
    if (days.includes(dayNum)) {
      setDays(days.filter((d) => d !== dayNum));
    } else {
      setDays([...days, dayNum]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveActivity({
      id: currentActivity?.id,
      name: name.trim(),
      category: category.trim() || 'Geral',
      frequency,
      days,
      times: Number(times),
      time: time || '',
      duration: Number(duration),
      preferred,
      active,
      trainingId: trainingId || null,
      color,
      notes,
    });

    onClose();
  };

  const presetColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className={`border rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'border-zinc-800 bg-zinc-950/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}25`, color }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {currentActivity ? 'Editar Atividade' : 'Nova Atividade'}
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Configure horários, dias e vínculo com fichas de treino
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Nome da Atividade *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Musculação A, Leitura, Corrida"
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
            <div>
              <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex.: Treinos, Bem-estar, Casa"
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
          </div>

          {/* Linked Workout */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/70 border-zinc-800'
          }`}>
            <label className={`block font-semibold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-zinc-300'}`}>
              <Dumbbell className="w-4 h-4 text-indigo-500" />
              <span>Vincular Ficha de Treino (Abre ao lado ao clicar):</span>
            </label>
            <select
              value={trainingId}
              onChange={(e) => setTrainingId(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900'
                  : 'bg-zinc-900 border-zinc-700/80 text-white'
              }`}
            >
              <option value="">Nenhuma (Apenas atividade / tarefa com anotações)</option>
              {Object.values(workouts).map((w) => (
                <option key={w.id} value={w.id}>
                  🏋️ {w.title} ({w.subtitle || w.dayName})
                </option>
              ))}
            </select>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Quando vinculada, clicar na atividade abre diretamente o treino detalhado com séries,
              cargas e cronômetro de descanso.
            </p>
          </div>

          {/* Frequency & Days */}
          <div>
            <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Periodicidade</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-zinc-950 border-zinc-800 text-white'
              }`}
            >
              <option value="weekly">Dias específicos da semana</option>
              <option value="daily">Todos os dias (Diário)</option>
              <option value="times">X vezes por semana</option>
              <option value="monthly">Mensal (1º dia do mês)</option>
            </select>
          </div>

          {(frequency === 'weekly' || frequency === 'times') && (
            <div>
              <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Dias da Semana</label>
              <div className="grid grid-cols-7 gap-1.5">
                {(['1', '2', '3', '4', '5', '6', '0'] as DayOfWeek[]).map((d) => {
                  const isSelected = days.includes(d);
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => handleToggleDay(d)}
                      className={`py-2 rounded-xl text-center text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isLight
                          ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                          : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                      }`}
                    >
                      {DAYS_SHORT_PT[Number(d)]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {frequency === 'times' && (
            <div>
              <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Vezes por Semana</label>
              <input
                type="number"
                min={1}
                max={7}
                value={times}
                onChange={(e) => setTimes(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-zinc-950 border-zinc-800 text-white'
                }`}
              />
            </div>
          )}

          {/* Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Horário Preferencial</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-zinc-950 border-zinc-800 text-white'
                }`}
              />
            </div>
            <div>
              <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Duração Estimada (min)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-zinc-950 border-zinc-800 text-white'
                }`}
              />
            </div>
          </div>

          {/* Color & Switches */}
          <div>
            <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Cor de Destaque</label>
            <div className="flex items-center gap-2">
              {presetColors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className={`pt-2 border-t space-y-2.5 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <label className={`flex items-center gap-2.5 cursor-pointer ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              <input
                type="checkbox"
                checked={preferred}
                onChange={(e) => setPreferred(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span>Tratar horário como preferencial (flexível)</span>
            </label>

            <label className={`flex items-center gap-2.5 cursor-pointer ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span>Atividade ativa no planejamento</span>
            </label>
          </div>

          {/* Notes description */}
          <div>
            <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Instruções ou Descrição</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruções gerais sobre o hábito..."
              className={`w-full border rounded-xl p-3 focus:outline-none focus:border-indigo-500 ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
              }`}
            />
          </div>

          {/* Footer Submit */}
          <div className={`pt-3 border-t flex items-center justify-end gap-2 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl transition-colors font-medium ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-semibold shadow-lg shadow-indigo-600/30"
            >
              {currentActivity ? 'Salvar Alterações' : 'Criar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
