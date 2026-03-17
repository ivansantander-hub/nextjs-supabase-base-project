import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ReviewItem {
  taskId: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface ReviewState {
  reviews: ReviewItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addReview: (review: ReviewItem) => void;
  updateReview: (taskId: string, updates: Partial<ReviewItem>) => void;
  getReview: (taskId: string) => ReviewItem | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getPending: () => ReviewItem[];
}

export const useReviewStore = create<ReviewState>()(
  devtools((set, get) => ({
    reviews: [],
    isLoading: false,
    error: null,

    addReview: (review) => set((state) => ({
      reviews: state.reviews.some((r) => r.taskId === review.taskId)
        ? state.reviews.map((r) => (r.taskId === review.taskId ? review : r))
        : [...state.reviews, review],
    })),
    updateReview: (taskId, updates) => set((state) => ({
      reviews: state.reviews.map((r) =>
        r.taskId === taskId ? { ...r, ...updates } : r
      ),
    })),
    getReview: (taskId) => get().reviews.find((r) => r.taskId === taskId),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    getPending: () => get().reviews.filter((r) => r.status === 'pending'),
  }))
);
