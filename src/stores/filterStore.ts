import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FilterState {
  status?: string[];
  priority?: string[];
  sprint?: string;
  tags?: string[];
  searchQuery?: string;

  // Actions
  setStatus: (status: string[] | undefined) => void;
  setPriority: (priority: string[] | undefined) => void;
  setSprint: (sprint: string | undefined) => void;
  setTags: (tags: string[] | undefined) => void;
  setSearchQuery: (query: string | undefined) => void;
  reset: () => void;
  getActive: () => boolean;
}

const initialState: Omit<FilterState, 'setStatus' | 'setPriority' | 'setSprint' | 'setTags' | 'setSearchQuery' | 'reset' | 'getActive'> = {
  status: undefined,
  priority: undefined,
  sprint: undefined,
  tags: undefined,
  searchQuery: undefined,
};

export const useFilterStore = create<FilterState>()(
  devtools((set, get) => ({
    ...initialState,

    setStatus: (status) => set({ status }),
    setPriority: (priority) => set({ priority }),
    setSprint: (sprint) => set({ sprint }),
    setTags: (tags) => set({ tags }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    reset: () => set(initialState),
    getActive: () => {
      const state = get();
      return !!(
        (state.status && state.status.length > 0) ||
        (state.priority && state.priority.length > 0) ||
        state.sprint ||
        (state.tags && state.tags.length > 0) ||
        state.searchQuery
      );
    },
  }))
);
