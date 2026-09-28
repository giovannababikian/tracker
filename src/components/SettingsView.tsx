import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Download,
  Upload,
  RotateCcw,
  User,
  Shield,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Layers,
  Smartphone,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

interface SettingsViewProps {
  onOpenAuth: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAuth }) => {
  const { resetToDefaults, exportBackup, importBackup, workouts, activities, isNativeView, toggleNativeView } = useApp();
  const { user, theme, setTheme } = useAuth();
  const isLight = theme === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackup(content);
        if (ok) {
          alert('Backup restaurado com sucesso!');
        } else {
          alert('Erro ao importar backup. Arquivo inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Account & User Card */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white/80 border-slate-200 shadow-sm backdrop-blur-xl'
            : 'bg-zinc-900/60 border-zinc-800/80 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/20">
              {user?.name?.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{user?.name || 'Visitante'}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Conta Ativa
                </span>
              </div>
              <p className="text-xs text-zinc-400">@{user?.username || 'visitante'}</p>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Alternar Conta</span>
          </button>
        </div>
      </div>

      {/* Theme Appearance Card */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white/80 border-slate-200 shadow-sm backdrop-blur-xl'
            : 'bg-zinc-900/60 border-zinc-800/80 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {isLight ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              <h3 className={`text-sm sm:text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Aparência Visual & Tema
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Alterne entre o tema escuro futurista (cyberpunk glass) e o tema claro minimalista.
            </p>
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-2xl border self-start sm:self-auto ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tema Escuro</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Tema Claro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Viewport & React Native Interface Preference */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          isLight
            ? 'bg-white/80 border-slate-200 shadow-sm backdrop-blur-xl'
            : 'bg-zinc-900/60 border-zinc-800/80 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <h3 className={`text-sm sm:text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Interface Estilo React Native
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Alterna entre a visualização adaptável ampla e o frame móvel compacto que simula o aplicativo React Native nativo.
            </p>
          </div>

          <button
            onClick={toggleNativeView}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isNativeView
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : isLight
                ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            {isNativeView ? '📱 Modo Mobile Ativo' : '💻 Modo Split Desktop'}
          </button>
        </div>
      </div>

      {/* Workout Fichas Overview */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            Planos de Treino Integrados (PDF Oficial)
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Fichas completas com exercícios, séries, repetições, RIR e tempo de descanso. Ao clicar na atividade do dia (como Terça - Musculação A), o treino abre automaticamente em uma aba ao lado.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {Object.values(workouts).map((w) => (
            <div
              key={w.id}
              className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: w.color }}
                />
                <span className="text-[10px] font-mono text-zinc-400">{w.dayName}</span>
              </div>
              <div className="font-bold text-xs text-white truncate">{w.title}</div>
              <div className="text-[11px] text-zinc-400">{w.exercises.length} exercícios</div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup and Data Management */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-xl space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white">Dados & Backup</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Exporte ou importe todos os seus hábitos, registros de treinos e anotações.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={exportBackup}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Importar Backup</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => {
              if (
                confirm(
                  'Deseja restaurar as atividades e fichas para o padrão inicial do plano de treino? Isso substituirá seus dados atuais.'
                )
              ) {
                resetToDefaults();
              }
            }}
            className="px-4 py-2 bg-zinc-950 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Plano Padrão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
