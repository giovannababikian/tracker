export type DayOfWeek = '0' | '1' | '2' | '3' | '4' | '5' | '6'; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb

export interface ExerciseItem {
  id: string;
  phase: string; // "Aquecimento", "Core", "1", "2", "3", "Final", "Cardio", etc.
  name: string;
  setsReps: string; // "3 × 6–8", "15–20 min", etc.
  targetSets: number;
  rirRpe: string; // "2", "1–2", "RPE 4–5", etc.
  rest: string; // "2–3 min", "60 s", etc.
  restSeconds?: number;
  notes?: string;
}

export interface WorkoutSetLog {
  setNumber: number;
  weight: string; // kg
  reps: string;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  sets: WorkoutSetLog[];
  completed: boolean;
  notes?: string;
}

export interface WorkoutDefinition {
  id: string; // 'treino_a' | 'treino_quarta' | 'treino_b' | custom
  title: string;
  subtitle: string;
  dayName: string; // "terça", "quarta", "quinta", etc.
  dayNumber: DayOfWeek;
  estimatedMinutes: number;
  color: string;
  exercises: ExerciseItem[];
  instructions?: string;
  progressionNote?: string;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'times' | 'monthly';
  days: DayOfWeek[];
  times?: number;
  time: string; // HH:mm or ""
  duration: number; // minutes
  preferred: boolean;
  active: boolean;
  trainingId?: string | null;
  color?: string;
  icon?: string;
  notes?: string;
  subtasks?: SubTask[];
  createdAt: string;
  updatedAt?: string;
}

export interface UserCompletionRecord {
  // Key format: `${activityId}_${YYYY-MM-DD}`
  [key: string]: boolean;
}

export interface UserWorkoutLogs {
  // Key format: `${workoutId}_${YYYY-MM-DD}`
  [key: string]: {
    date: string;
    workoutId: string;
    exercises: {
      [exerciseId: string]: {
        completed: boolean;
        sets: { weight: string; reps: string; done: boolean }[];
        notes?: string;
      };
    };
    overallNotes?: string;
    completedAt?: string;
  };
}

export interface UserActivityNotes {
  // Key format: `${activityId}_${YYYY-MM-DD}` or `${activityId}` for general notes
  [key: string]: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  nativeViewMode?: boolean; // toggle React Native mobile viewport style
  theme?: 'dark' | 'light';
  createdAt: string;
}

export type ViewType = 'today' | 'week' | 'workouts' | 'activities' | 'settings';

export interface TabItem {
  id: string; // unique tab instance id, e.g. `workout_treino_a_2026-09-29` or `activity_leitura`
  type: 'workout' | 'activity_notes' | 'activity_edit';
  title: string;
  subtitle?: string;
  dateStr?: string; // YYYY-MM-DD
  activityId?: string;
  trainingId?: string;
  icon?: string;
}
