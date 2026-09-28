import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, CalendarDays, ListChecks, Settings, Dumbbell } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, openTabs } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const navItems: {
    id: 'today' | 'week' | 'workouts' | 'activities' | 'settings';
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'today',
      label: 'Hoje',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'week',
      label: 'Semana',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'workouts',
      label: 'Treinos',
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      id: 'activities',
      label: 'Hábitos',
      icon: <ListChecks className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Ajustes',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] sm:hidden transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
          : 'bg-zinc-950/95 border-zinc-800/80 shadow-[0_-4px_25px_rgba(0,0,0,0.6)]'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : isLight
                  ? 'text-slate-400 hover:text-slate-700'
                  : 'text-zinc-500 hover:text-zinc-300 font-medium'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.id === 'workouts' && openTabs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950" />
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
