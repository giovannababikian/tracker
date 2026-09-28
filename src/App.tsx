import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayView } from './components/TodayView';
import { WeekView } from './components/WeekView';
import { WorkoutsPlanView } from './components/WorkoutsPlanView';
import { ActivitiesView } from './components/ActivitiesView';
import { SettingsView } from './components/SettingsView';
import { TabsContainer } from './components/TabsContainer';
import { EditActivityModal } from './components/EditActivityModal';
import { AuthModal } from './components/AuthModal';
import { FloatingRestTimer } from './components/FloatingRestTimer';
import {
  Calendar,
  CalendarDays,
  ListChecks,
  Settings,
  Dumbbell,
  Sparkles,
  Layers,
  X,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, openTabs, activeTabId, isNativeView, closeTab } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEdit = (actId?: string) => {
    setEditingActivityId(actId);
    setIsEditModalOpen(true);
  };

  const navTabs: {
    id: 'today' | 'week' | 'workouts' | 'activities' | 'settings';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'today', label: 'Hoje', icon: <Calendar className="w-4 h-4" /> },
    { id: 'week', label: 'Semana', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'workouts', label: 'Plano de Treinos', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'activities', label: 'Hábitos & Rotinas', icon: <ListChecks className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ];

  const hasOpenTabs = openTabs.length > 0;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-zinc-100'
      } ${
        isNativeView ? 'py-4 sm:py-8 flex items-center justify-center bg-zinc-900' : ''
      }`}
    >
      {/* Device wrapper if React Native mobile preview mode is active */}
      <div
        className={`w-full flex-1 flex flex-col transition-all duration-300 ${
          isNativeView
            ? isLight
              ? 'max-w-[420px] max-h-[880px] h-[880px] bg-white border-[6px] border-slate-300 rounded-[48px] shadow-2xl overflow-hidden relative'
              : 'max-w-[420px] max-h-[880px] h-[880px] bg-zinc-950 border-[6px] border-zinc-700/80 rounded-[48px] shadow-2xl overflow-hidden relative'
            : ''
        }`}
      >
        {/* iOS Dynamic Island simulation for React Native mode */}
        {isNativeView && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 pointer-events-none flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 absolute right-3" />
          </div>
        )}

        <Header
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenNewActivity={() => handleOpenEdit(undefined)}
        />

        {/* Desktop Top Navigation Tabs Bar */}
        <div
          className={`hidden sm:block border-b backdrop-blur-md px-6 py-2 transition-colors ${
            isLight
              ? 'border-slate-200/80 bg-white/70 shadow-xs'
              : 'border-zinc-800/80 bg-zinc-950/60'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div
              className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              {navTabs.map((tab) => {
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? isLight
                          ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 font-bold'
                          : 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                        : isLight
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {hasOpenTabs && !isNativeView && (
              <div className="text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{openTabs.length} aba(s) lateral(is) ativa(s)</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-hidden flex flex-col">
          {/* Layout Split: Left = Main Views; Right = Open Tabs Container */}
          <div
            className={`flex-1 flex gap-6 min-h-0 ${
              hasOpenTabs && !isNativeView ? 'flex-col lg:flex-row' : 'flex-col'
            }`}
          >
            {/* Left Primary View Container */}
            <div
              className={`flex-1 overflow-y-auto pr-0 ${
                hasOpenTabs && !isNativeView ? 'lg:w-[52%] xl:w-[50%]' : 'w-full max-w-4xl mx-auto'
              }`}
            >
              {activeView === 'today' && <TodayView />}
              {activeView === 'week' && <WeekView />}
              {activeView === 'workouts' && <WorkoutsPlanView />}
              {activeView === 'activities' && (
                <ActivitiesView onOpenEdit={(id) => handleOpenEdit(id)} />
              )}
              {activeView === 'settings' && (
                <SettingsView onOpenAuth={() => setIsAuthOpen(true)} />
              )}
            </div>

            {/* Right Side Tabs Container (Desktop Split) */}
            {hasOpenTabs && !isNativeView && (
              <div
                className={`hidden lg:flex flex-1 lg:w-[48%] xl:w-[50%] rounded-3xl border overflow-hidden shadow-2xl h-[calc(100vh-140px)] sticky top-4 ${
                  isLight
                    ? 'border-slate-200 bg-white/95'
                    : 'border-zinc-800 bg-zinc-900/90'
                }`}
              >
                <TabsContainer />
              </div>
            )}
          </div>
        </main>

        {/* Mobile Slide-Up / Bottom-Sheet Modal for Tabs */}
        {hasOpenTabs && (!isNativeView ? true : true) && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-in fade-in"
            onClick={() => closeTab(activeTabId || openTabs[0]?.id)}
          >
            <div
              className={`w-full h-[90dvh] max-h-[92dvh] rounded-t-[32px] border-t overflow-hidden flex flex-col shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile grab handle */}
              <div className="w-12 h-1.5 rounded-full bg-zinc-500/40 mx-auto my-2 shrink-0 cursor-grab" />
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <TabsContainer isMobileModal={true} />
              </div>
            </div>
          </div>
        )}

        {/* Floating Workout Rest Timer */}
        <FloatingRestTimer />

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Global Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <EditActivityModal
        activityId={editingActivityId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingActivityId(undefined);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
