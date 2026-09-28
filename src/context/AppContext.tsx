import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  Activity,
  WorkoutDefinition,
  TabItem,
  UserCompletionRecord,
  UserWorkoutLogs,
  UserActivityNotes,
} from '../types';
import {
  DEFAULT_WORKOUTS,
  INITIAL_DEFAULT_ACTIVITIES,
  getFormattedDateKey,
} from '../data/defaultPlans';
import { useAuth } from './AuthContext';

interface AppContextType {
  activities: Activity[];
  workouts: Record<string, WorkoutDefinition>;
  completions: UserCompletionRecord;
  workoutLogs: UserWorkoutLogs;
  activityNotes: UserActivityNotes;
  openTabs: TabItem[];
  activeTabId: string | null;
  activeView: 'today' | 'week' | 'workouts' | 'activities' | 'settings';
  selectedDate: string; // YYYY-MM-DD
  isNativeView: boolean;
  restTimer: {
    active: boolean;
    secondsRemaining: number;
    totalSeconds: number;
    label: string;
  };

  // Navigation & View Actions
  setActiveView: (view: 'today' | 'week' | 'workouts' | 'activities' | 'settings') => void;
  setSelectedDate: (dateStr: string) => void;
  toggleNativeView: () => void;

  // Tabs Actions
  openWorkoutTab: (trainingId: string, dateStr?: string, activityName?: string) => void;
  openTaskNotesTab: (activityId: string, dateStr?: string, activityName?: string) => void;
  openActivityEditTab: (activityId?: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTabId: (tabId: string | null) => void;

  // Activities CRUD
  toggleCompletion: (activityId: string, dateStr?: string) => void;
  isCompleted: (activityId: string, dateStr?: string) => boolean;
  saveActivity: (activity: Partial<Activity>) => void;
  deleteActivity: (activityId: string) => void;
  duplicateActivity: (activityId: string) => void;
  toggleActivityActive: (activityId: string) => void;
  toggleSubTask: (activityId: string, subtaskId: string) => void;

  // Workouts Actions
  saveWorkoutDefinition: (workout: WorkoutDefinition) => void;
  updateWorkoutLogSet: (
    workoutId: string,
    dateStr: string,
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps' | 'done',
    val: any
  ) => void;
  toggleExerciseDone: (
    workoutId: string,
    dateStr: string,
    exerciseId: string,
    targetSetsCount?: number
  ) => void;
  saveWorkoutNotes: (workoutId: string, dateStr: string, notes: string) => void;
  getWorkoutProgress: (
    workoutId: string,
    dateStr: string
  ) => { completedCount: number; totalCount: number; percent: number };

  // Notes Actions
  saveActivityNotes: (activityId: string, dateStr: string, text: string) => void;
  getActivityNotes: (activityId: string, dateStr?: string) => string;

  // Timer Actions
  startRestTimer: (seconds: number, label?: string) => void;
  stopRestTimer: () => void;
  adjustRestTimer: (secondsDelta: number) => void;

  // Data & Backup
  resetToDefaults: () => void;
  exportBackup: () => void;
  importBackup: (jsonContent: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const currentUserId = user?.id || 'guest';

  // State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [workouts, setWorkouts] = useState<Record<string, WorkoutDefinition>>(DEFAULT_WORKOUTS);
  const [completions, setCompletions] = useState<UserCompletionRecord>({});
  const [workoutLogs, setWorkoutLogs] = useState<UserWorkoutLogs>({});
  const [activityNotes, setActivityNotes] = useState<UserActivityNotes>({});

  // Tabs & Views
  const [openTabs, setOpenTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'today' | 'week' | 'workouts' | 'activities' | 'settings'>('today');
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDateKey(new Date()));
  const [isNativeView, setIsNativeView] = useState<boolean>(false);

  // Rest Timer
  const [restTimer, setRestTimer] = useState<{
    active: boolean;
    secondsRemaining: number;
    totalSeconds: number;
    label: string;
  }>({
    active: false,
    secondsRemaining: 0,
    totalSeconds: 0,
    label: '',
  });

  // Local storage keys scoped to user
  const getStorageKey = useCallback(
    (prefix: string) => `ht_${prefix}_${currentUserId}`,
    [currentUserId]
  );

  // Load user data on user switch or mount
  useEffect(() => {
    if (!currentUserId) return;

    // Load from localStorage first
    const savedActivities = localStorage.getItem(getStorageKey('activities'));
    const savedWorkouts = localStorage.getItem(getStorageKey('workouts'));
    const savedCompletions = localStorage.getItem(getStorageKey('completions'));
    const savedWorkoutLogs = localStorage.getItem(getStorageKey('workoutLogs'));
    const savedNotes = localStorage.getItem(getStorageKey('notes'));

    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (e) {
        console.error('Failed to parse cached activities', e);
      }
    } else {
      // First time for this user: initialize with default routine
      const initialUserActivities: Activity[] = INITIAL_DEFAULT_ACTIVITIES.map((act) => ({
        ...act,
        userId: currentUserId,
      }));
      setActivities(initialUserActivities);
      localStorage.setItem(getStorageKey('activities'), JSON.stringify(initialUserActivities));
    }

    if (savedWorkouts) {
      try {
        setWorkouts(JSON.parse(savedWorkouts));
      } catch (e) {
        setWorkouts(DEFAULT_WORKOUTS);
      }
    } else {
      setWorkouts(DEFAULT_WORKOUTS);
    }

    if (savedCompletions) {
      try {
        setCompletions(JSON.parse(savedCompletions));
      } catch (e) {}
    } else {
      setCompletions({});
    }

    if (savedWorkoutLogs) {
      try {
        setWorkoutLogs(JSON.parse(savedWorkoutLogs));
      } catch (e) {}
    } else {
      setWorkoutLogs({});
    }

    if (savedNotes) {
      try {
        setActivityNotes(JSON.parse(savedNotes));
      } catch (e) {}
    } else {
      setActivityNotes({});
    }

    // Attempt backend sync
    if (token) {
      fetch('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((resData) => {
          if (resData?.data) {
            const d = resData.data;
            if (Array.isArray(d.activities) && d.activities.length > 0) {
              setActivities(d.activities);
              localStorage.setItem(getStorageKey('activities'), JSON.stringify(d.activities));
            }
            if (d.workouts && Object.keys(d.workouts).length > 0) {
              setWorkouts(d.workouts);
              localStorage.setItem(getStorageKey('workouts'), JSON.stringify(d.workouts));
            }
            if (d.completions) {
              setCompletions(d.completions);
              localStorage.setItem(getStorageKey('completions'), JSON.stringify(d.completions));
            }
            if (d.workoutLogs) {
              setWorkoutLogs(d.workoutLogs);
              localStorage.setItem(getStorageKey('workoutLogs'), JSON.stringify(d.workoutLogs));
            }
            if (d.activityNotes) {
              setActivityNotes(d.activityNotes);
              localStorage.setItem(getStorageKey('notes'), JSON.stringify(d.activityNotes));
            }
          }
        })
        .catch(() => {});
    }
  }, [currentUserId, token, getStorageKey]);

  // Sync to Backend and localStorage whenever data updates
  const syncToStorageAndServer = useCallback(
    (
      newActivities?: Activity[],
      newWorkouts?: Record<string, WorkoutDefinition>,
      newCompletions?: UserCompletionRecord,
      newLogs?: UserWorkoutLogs,
      newNotes?: UserActivityNotes
    ) => {
      const acts = newActivities !== undefined ? newActivities : activities;
      const wks = newWorkouts !== undefined ? newWorkouts : workouts;
      const comps = newCompletions !== undefined ? newCompletions : completions;
      const logs = newLogs !== undefined ? newLogs : workoutLogs;
      const nts = newNotes !== undefined ? newNotes : activityNotes;

      localStorage.setItem(getStorageKey('activities'), JSON.stringify(acts));
      localStorage.setItem(getStorageKey('workouts'), JSON.stringify(wks));
      localStorage.setItem(getStorageKey('completions'), JSON.stringify(comps));
      localStorage.setItem(getStorageKey('workoutLogs'), JSON.stringify(logs));
      localStorage.setItem(getStorageKey('notes'), JSON.stringify(nts));

      if (token) {
        fetch('/api/user/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            activities: acts,
            workouts: wks,
            completions: comps,
            workoutLogs: logs,
            activityNotes: nts,
          }),
        }).catch(() => {});
      }
    },
    [activities, workouts, completions, workoutLogs, activityNotes, getStorageKey, token]
  );

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (restTimer.active && restTimer.secondsRemaining > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev.secondsRemaining <= 1) {
            // Beep alert or vibration if supported
            try {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
              }
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.value = 880; // A5 note
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.6);
            } catch (e) {}

            return { ...prev, active: false, secondsRemaining: 0 };
          }
          return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer.active, restTimer.secondsRemaining]);

  const startRestTimer = (seconds: number, label: string = 'Descanso') => {
    setRestTimer({
      active: true,
      secondsRemaining: seconds,
      totalSeconds: seconds,
      label,
    });
  };

  const stopRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, active: false, secondsRemaining: 0 }));
  };

  const adjustRestTimer = (delta: number) => {
    setRestTimer((prev) => {
      const nextSec = Math.max(0, prev.secondsRemaining + delta);
      return {
        ...prev,
        secondsRemaining: nextSec,
        totalSeconds: Math.max(prev.totalSeconds, nextSec),
        active: nextSec > 0,
      };
    });
  };

  // Tab management: opens new tab beside or in drawer
  const openWorkoutTab = (
    trainingId: string,
    dateStr: string = selectedDate,
    activityName?: string
  ) => {
    const workoutDef = workouts[trainingId] || DEFAULT_WORKOUTS[trainingId];
    const title = activityName || workoutDef?.title || 'Ficha de Treino';
    const tabId = `workout_${trainingId}_${dateStr}`;

    setOpenTabs((prev) => {
      const exists = prev.find((t) => t.id === tabId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: tabId,
          type: 'workout',
          title,
          subtitle: workoutDef?.subtitle || 'Exercícios e cargas',
          dateStr,
          trainingId,
          icon: 'dumbbell',
        },
      ];
    });
    setActiveTabId(tabId);
  };

  const openTaskNotesTab = (
    activityId: string,
    dateStr: string = selectedDate,
    activityName?: string
  ) => {
    const act = activities.find((a) => a.id === activityId);
    const title = activityName || act?.name || 'Anotações & Detalhes';
    const tabId = `notes_${activityId}_${dateStr}`;

    setOpenTabs((prev) => {
      const exists = prev.find((t) => t.id === tabId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: tabId,
          type: 'activity_notes',
          title,
          subtitle: act?.category || 'Notas e sub-tarefas',
          dateStr,
          activityId,
          icon: 'file-text',
        },
      ];
    });
    setActiveTabId(tabId);
  };

  const openActivityEditTab = (activityId?: string) => {
    const act = activityId ? activities.find((a) => a.id === activityId) : null;
    const tabId = activityId ? `edit_${activityId}` : 'new_activity';

    setOpenTabs((prev) => {
      const exists = prev.find((t) => t.id === tabId);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: tabId,
          type: 'activity_edit',
          title: act ? `Editar: ${act.name}` : 'Nova Atividade',
          subtitle: act ? act.category : 'Configurar frequência e horário',
          activityId,
          icon: 'settings',
        },
      ];
    });
    setActiveTabId(tabId);
  };

  const closeTab = (tabId: string) => {
    setOpenTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        setActiveTabId(filtered.length > 0 ? filtered[filtered.length - 1].id : null);
      }
      return filtered;
    });
  };

  // Completion Toggling
  const toggleCompletion = (activityId: string, dateStr: string = selectedDate) => {
    const key = `${activityId}_${dateStr}`;
    setCompletions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      syncToStorageAndServer(undefined, undefined, next);
      return next;
    });
  };

  const isCompleted = (activityId: string, dateStr: string = selectedDate): boolean => {
    const key = `${activityId}_${dateStr}`;
    return !!completions[key];
  };

  // Activities CRUD
  const saveActivity = (activityData: Partial<Activity>) => {
    const isNew = !activityData.id;
    const id = activityData.id || `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const newActivity: Activity = {
      id,
      userId: currentUserId,
      name: activityData.name || 'Nova Atividade',
      category: activityData.category || 'Geral',
      frequency: activityData.frequency || 'weekly',
      days: activityData.days || ['1', '2', '3', '4', '5'],
      times: activityData.times || 2,
      time: activityData.time || '',
      duration: activityData.duration || 30,
      preferred: !!activityData.preferred,
      active: activityData.active !== undefined ? activityData.active : true,
      trainingId: activityData.trainingId || null,
      color: activityData.color || '#3b82f6',
      icon: activityData.icon || 'check-circle',
      notes: activityData.notes || '',
      subtasks: activityData.subtasks || [],
      createdAt: activityData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActivities((prev) => {
      let updated: Activity[];
      if (isNew) {
        updated = [...prev, newActivity];
      } else {
        updated = prev.map((a) => (a.id === id ? newActivity : a));
      }
      syncToStorageAndServer(updated);
      return updated;
    });

    // Close any edit tab for this activity
    closeTab(`edit_${id}`);
    closeTab('new_activity');
  };

  const deleteActivity = (activityId: string) => {
    setActivities((prev) => {
      const updated = prev.filter((a) => a.id !== activityId);
      syncToStorageAndServer(updated);
      return updated;
    });
    // Close related tabs
    setOpenTabs((prev) => prev.filter((t) => t.activityId !== activityId));
  };

  const duplicateActivity = (activityId: string) => {
    const existing = activities.find((a) => a.id === activityId);
    if (!existing) return;
    const copy: Activity = {
      ...existing,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: `${existing.name} (Cópia)`,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => {
      const updated = [...prev, copy];
      syncToStorageAndServer(updated);
      return updated;
    });
  };

  const toggleActivityActive = (activityId: string) => {
    setActivities((prev) => {
      const updated = prev.map((a) => (a.id === activityId ? { ...a, active: !a.active } : a));
      syncToStorageAndServer(updated);
      return updated;
    });
  };

  const toggleSubTask = (activityId: string, subtaskId: string) => {
    setActivities((prev) => {
      const updated = prev.map((act) => {
        if (act.id !== activityId || !act.subtasks) return act;
        const newSubtasks = act.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...act, subtasks: newSubtasks };
      });
      syncToStorageAndServer(updated);
      return updated;
    });
  };

  // Workout definition saving
  const saveWorkoutDefinition = (workout: WorkoutDefinition) => {
    setWorkouts((prev) => {
      const updated = { ...prev, [workout.id]: workout };
      syncToStorageAndServer(undefined, updated);
      return updated;
    });
  };

  // Workout log updating (interactive weight/reps/completion)
  const updateWorkoutLogSet = (
    workoutId: string,
    dateStr: string,
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps' | 'done',
    val: any
  ) => {
    const key = `${workoutId}_${dateStr}`;
    setWorkoutLogs((prev) => {
      const log = prev[key] || {
        date: dateStr,
        workoutId,
        exercises: {},
      };

      const exLog = log.exercises[exerciseId] || {
        completed: false,
        sets: [],
      };

      const sets = [...(exLog.sets || [])];
      while (sets.length <= setIndex) {
        sets.push({ weight: '', reps: '', done: false });
      }

      sets[setIndex] = {
        ...sets[setIndex],
        [field]: val,
      };

      const allSetsDone = sets.length > 0 && sets.every((s) => s.done);

      const nextLogs: UserWorkoutLogs = {
        ...prev,
        [key]: {
          ...log,
          exercises: {
            ...log.exercises,
            [exerciseId]: {
              ...exLog,
              sets,
              completed: allSetsDone,
            },
          },
        },
      };

      syncToStorageAndServer(undefined, undefined, undefined, nextLogs);
      return nextLogs;
    });
  };

  const toggleExerciseDone = (
    workoutId: string,
    dateStr: string,
    exerciseId: string,
    targetSetsCount: number = 3
  ) => {
    const key = `${workoutId}_${dateStr}`;
    setWorkoutLogs((prev) => {
      const log = prev[key] || {
        date: dateStr,
        workoutId,
        exercises: {},
      };

      const exLog = log.exercises[exerciseId] || {
        completed: false,
        sets: [],
      };

      const newCompleted = !exLog.completed;
      const sets = [...(exLog.sets || [])];
      while (sets.length < targetSetsCount) {
        sets.push({ weight: '', reps: '', done: false });
      }

      const updatedSets = sets.map((s) => ({ ...s, done: newCompleted }));

      const nextLogs: UserWorkoutLogs = {
        ...prev,
        [key]: {
          ...log,
          exercises: {
            ...log.exercises,
            [exerciseId]: {
              ...exLog,
              sets: updatedSets,
              completed: newCompleted,
            },
          },
        },
      };

      syncToStorageAndServer(undefined, undefined, undefined, nextLogs);
      return nextLogs;
    });
  };

  const saveWorkoutNotes = (workoutId: string, dateStr: string, notes: string) => {
    const key = `${workoutId}_${dateStr}`;
    setWorkoutLogs((prev) => {
      const log = prev[key] || {
        date: dateStr,
        workoutId,
        exercises: {},
      };
      const nextLogs = {
        ...prev,
        [key]: {
          ...log,
          overallNotes: notes,
        },
      };
      syncToStorageAndServer(undefined, undefined, undefined, nextLogs);
      return nextLogs;
    });
  };

  const getWorkoutProgress = (
    workoutId: string,
    dateStr: string
  ): { completedCount: number; totalCount: number; percent: number } => {
    const def = workouts[workoutId] || DEFAULT_WORKOUTS[workoutId];
    if (!def) return { completedCount: 0, totalCount: 0, percent: 0 };

    const key = `${workoutId}_${dateStr}`;
    const log = workoutLogs[key];
    const totalCount = def.exercises.length;
    if (!log || !log.exercises) return { completedCount: 0, totalCount, percent: 0 };

    let completedCount = 0;
    def.exercises.forEach((ex) => {
      if (log.exercises[ex.id]?.completed) {
        completedCount++;
      }
    });

    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { completedCount, totalCount, percent };
  };

  // Notes actions
  const saveActivityNotes = (activityId: string, dateStr: string, text: string) => {
    const key = `${activityId}_${dateStr}`;
    setActivityNotes((prev) => {
      const next = { ...prev, [key]: text, [activityId]: text };
      syncToStorageAndServer(undefined, undefined, undefined, undefined, next);
      return next;
    });
  };

  const getActivityNotes = (activityId: string, dateStr?: string): string => {
    if (dateStr) {
      const key = `${activityId}_${dateStr}`;
      if (activityNotes[key] !== undefined) return activityNotes[key];
    }
    return (
      activityNotes[activityId] ||
      activities.find((a) => a.id === activityId)?.notes ||
      ''
    );
  };

  const resetToDefaults = () => {
    const defaultActs: Activity[] = INITIAL_DEFAULT_ACTIVITIES.map((act) => ({
      ...act,
      userId: currentUserId,
    }));
    setActivities(defaultActs);
    setWorkouts(DEFAULT_WORKOUTS);
    setCompletions({});
    setWorkoutLogs({});
    setActivityNotes({});
    syncToStorageAndServer(defaultActs, DEFAULT_WORKOUTS, {}, {}, {});
  };

  const exportBackup = () => {
    const backupData = {
      user: { id: user?.id, username: user?.username },
      activities,
      workouts,
      completions,
      workoutLogs,
      activityNotes,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker_backup_${user?.username || 'user'}_${getFormattedDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonContent: string): boolean => {
    try {
      const data = JSON.parse(jsonContent);
      if (data.activities && Array.isArray(data.activities)) {
        setActivities(data.activities);
      }
      if (data.workouts) {
        setWorkouts(data.workouts);
      }
      if (data.completions) {
        setCompletions(data.completions);
      }
      if (data.workoutLogs) {
        setWorkoutLogs(data.workoutLogs);
      }
      if (data.activityNotes) {
        setActivityNotes(data.activityNotes);
      }
      syncToStorageAndServer(
        data.activities || activities,
        data.workouts || workouts,
        data.completions || completions,
        data.workoutLogs || workoutLogs,
        data.activityNotes || activityNotes
      );
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  };

  const toggleNativeView = () => {
    setIsNativeView((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        activities,
        workouts,
        completions,
        workoutLogs,
        activityNotes,
        openTabs,
        activeTabId,
        activeView,
        selectedDate,
        isNativeView,
        restTimer,
        setActiveView,
        setSelectedDate,
        toggleNativeView,
        openWorkoutTab,
        openTaskNotesTab,
        openActivityEditTab,
        closeTab,
        setActiveTabId,
        toggleCompletion,
        isCompleted,
        saveActivity,
        deleteActivity,
        duplicateActivity,
        toggleActivityActive,
        toggleSubTask,
        saveWorkoutDefinition,
        updateWorkoutLogSet,
        toggleExerciseDone,
        saveWorkoutNotes,
        getWorkoutProgress,
        saveActivityNotes,
        getActivityNotes,
        startRestTimer,
        stopRestTimer,
        adjustRestTimer,
        resetToDefaults,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
