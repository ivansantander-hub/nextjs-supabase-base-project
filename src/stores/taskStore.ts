import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'ready' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  sprint?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  enrichedContent?: Record<string, any>;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  selectTask: (task: Task | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>()(
  devtools((set) => ({
    tasks: [],
    selectedTask: null,
    isLoading: false,
    error: null,

    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updates) => set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      selectedTask: state.selectedTask?.id === id
        ? { ...state.selectedTask, ...updates }
        : state.selectedTask,
    })),
    deleteTask: (id) => set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    })),
    selectTask: (task) => set({ selectedTask: task }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }))
);
