import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Plus,
  Smartphone,
  Monitor,
  Flame,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenNewActivity: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenNewActivity }) => {
  const { user, theme, toggleTheme } = useAuth();
  const { isNativeView, toggleNativeView } = useApp();
  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-2xl border-b transition-colors px-4 sm:px-6 pt-[max(0.65rem,env(safe-area-inset-top))] pb-2.5 ${
        isLight
          ? 'bg-white/80 border-slate-200/80 shadow-xs'
          : 'bg-zinc-950/80 border-zinc-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Minimalist Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
              <span>Habit Tracker</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </h1>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border text-xs transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-amber-300'
            }`}
            title={isLight ? 'Ativar Tema Escuro (Futurista)' : 'Ativar Tema Claro'}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Mobile / Desktop view toggle */}
          <button
            onClick={toggleNativeView}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isNativeView
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 font-semibold'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={isNativeView ? 'Alternar para visão desktop split' : 'Alternar para viewport React Native'}
          >
            {isNativeView ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            <span className="hidden md:inline">{isNativeView ? 'Mobile View' : 'Split View'}</span>
          </button>

          {/* New Activity button */}
          <button
            onClick={onOpenNewActivity}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova Atividade</span>
          </button>

          {/* User Account Button */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 border rounded-xl transition-colors text-left ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
            }`}
            title="Gerenciar conta / Trocar usuário"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-[10px]">
              {user?.name?.slice(0, 2).toUpperCase() || 'GB'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight">
                {user?.name || 'GB Costa'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
