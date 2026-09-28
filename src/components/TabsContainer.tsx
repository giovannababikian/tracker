import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { WorkoutDetailTab } from './WorkoutDetailTab';
import { TaskDetailTab } from './TaskDetailTab';
import {
  Dumbbell,
  FileText,
  Settings,
  X,
  Plus,
} from 'lucide-react';

interface TabsContainerProps {
  isMobileModal?: boolean;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ isMobileModal = false }) => {
  const { openTabs, activeTabId, setActiveTabId, closeTab, openActivityEditTab } = useApp();
  const { theme } = useAuth();
  const isLight = theme === 'light';

  if (openTabs.length === 0) {
    return null;
  }

  const activeTab = openTabs.find((t) => t.id === activeTabId) || openTabs[0];

  return (
    <div
      className={`flex flex-col h-full ${
        isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-zinc-950/95 text-zinc-100 border-zinc-800'
      } ${
        isMobileModal
          ? 'w-full'
          : 'border-l shadow-2xl'
      }`}
    >
      {/* Tab bar header */}
      <div className={`flex items-center justify-between border-b px-2 sm:px-3 pt-2 gap-2 overflow-x-auto scrollbar-none select-none ${
        isLight ? 'border-slate-200 bg-slate-50/90' : 'border-zinc-800 bg-zinc-950/80'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1 pb-2">
          {openTabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border shrink-0 ${
                  isActive
                    ? isLight
                      ? 'bg-white text-slate-950 border-slate-300 shadow-sm ring-1 ring-slate-200'
                      : 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                    : isLight
                    ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:bg-zinc-850 hover:text-zinc-200'
                }`}
              >
                {tab.type === 'workout' ? (
                  <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                ) : tab.type === 'activity_notes' ? (
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Settings className="w-3.5 h-3.5 text-indigo-400" />
                )}

                <span className="max-w-[140px] truncate">{tab.title}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className={`p-0.5 rounded-md transition-colors ${
                    isLight ? 'hover:bg-slate-200 text-slate-400 hover:text-slate-800' : 'hover:bg-zinc-700 text-zinc-500 hover:text-white'
                  }`}
                  title="Fechar aba"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Global tab controls */}
        <div className="flex items-center gap-1 pb-2">
          <button
            onClick={() => openActivityEditTab()}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
            title="Nova Atividade"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {activeTab.type === 'workout' && activeTab.trainingId && (
          <WorkoutDetailTab
            trainingId={activeTab.trainingId}
            dateStr={activeTab.dateStr}
            tabId={activeTab.id}
          />
        )}

        {activeTab.type === 'activity_notes' && activeTab.activityId && (
          <TaskDetailTab
            activityId={activeTab.activityId}
            dateStr={activeTab.dateStr}
            tabId={activeTab.id}
          />
        )}
      </div>
    </div>
  );
};
