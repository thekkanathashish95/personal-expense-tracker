import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DateRange } from '../types';

// Define the state interface
interface AppState {
  // Date filtering state
  selectedMonth: Date;
  dateRange: DateRange | null;
  
  // UI state
  activeTab: 'dashboard' | 'expenses';
  
  // Actions
  setSelectedMonth: (month: Date) => void;
  setDateRange: (range: DateRange | null) => void;
  setActiveTab: (tab: 'dashboard' | 'expenses') => void;
  
  // Helper actions
  resetDateFilter: () => void;
  goToCurrentMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedMonth: new Date(),
      dateRange: null,
      activeTab: 'dashboard',

      // Date filtering actions
      setSelectedMonth: (month: Date) => {
        set({ selectedMonth: month, dateRange: null });
      },

      setDateRange: (range: DateRange | null) => {
        set({ dateRange: range });
      },

      setActiveTab: (tab: 'dashboard' | 'expenses') => {
        set({ activeTab: tab });
      },

      // Helper actions
      resetDateFilter: () => {
        set({ 
          selectedMonth: new Date(), 
          dateRange: null 
        });
      },

      goToCurrentMonth: () => {
        set({ 
          selectedMonth: new Date(), 
          dateRange: null 
        });
      },

      goToPreviousMonth: () => {
        const currentMonth = get().selectedMonth;
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        set({ 
          selectedMonth: newMonth, 
          dateRange: null 
        });
      },

      goToNextMonth: () => {
        const currentMonth = get().selectedMonth;
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        set({ 
          selectedMonth: newMonth, 
          dateRange: null 
        });
      },
    }),
    {
      name: 'expense-tracker-store', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist certain parts of the state
        selectedMonth: state.selectedMonth.toISOString(),
        activeTab: state.activeTab,
        // Don't persist dateRange as it's temporary
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO string back to Date object
          state.selectedMonth = new Date(state.selectedMonth);
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useSelectedMonth = () => useAppStore((state) => state.selectedMonth);
export const useDateRange = () => useAppStore((state) => state.dateRange);
export const useActiveTab = () => useAppStore((state) => state.activeTab);

// Action hooks - use individual selectors to avoid object recreation
export const useSetSelectedMonth = () => useAppStore((state) => state.setSelectedMonth);
export const useSetDateRange = () => useAppStore((state) => state.setDateRange);
export const useResetDateFilter = () => useAppStore((state) => state.resetDateFilter);
export const useGoToCurrentMonth = () => useAppStore((state) => state.goToCurrentMonth);
export const useGoToPreviousMonth = () => useAppStore((state) => state.goToPreviousMonth);
export const useGoToNextMonth = () => useAppStore((state) => state.goToNextMonth);
export const useSetActiveTab = () => useAppStore((state) => state.setActiveTab);
