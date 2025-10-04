import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NatalChart {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
  // Datos calculados de la carta
  planets?: any;
  houses?: any;
  aspects?: any;
  summary?: string[];
}

interface ChartsState {
  charts: NatalChart[];
  currentChart: NatalChart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addChart: (chart: Omit<NatalChart, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChart: (id: string, updates: Partial<NatalChart>) => void;
  deleteChart: (id: string) => void;
  setCurrentChart: (chart: NatalChart | null) => void;
  toggleFavorite: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  getChartsByTag: (tag: string) => NatalChart[];
  getFavoriteCharts: () => NatalChart[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChartsStore = create<ChartsState>()(
  persist(
    (set, get) => ({
      charts: [],
      currentChart: null,
      isLoading: false,
      error: null,

      addChart: (chartData) => {
        const newChart: NatalChart = {
          ...chartData,
          id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          charts: [...state.charts, newChart],
          error: null,
        }));
      },

      updateChart: (id, updates) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id
              ? { ...chart, ...updates, updatedAt: new Date().toISOString() }
              : chart
          ),
          currentChart:
            state.currentChart?.id === id
              ? { ...state.currentChart, ...updates, updatedAt: new Date().toISOString() }
              : state.currentChart,
          error: null,
        }));
      },

      deleteChart: (id) => {
        set((state) => ({
          charts: state.charts.filter((chart) => chart.id !== id),
          currentChart: state.currentChart?.id === id ? null : state.currentChart,
          error: null,
        }));
      },

      setCurrentChart: (chart) => {
        set({ currentChart: chart });
      },

      toggleFavorite: (id) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id
              ? { ...chart, isFavorite: !chart.isFavorite, updatedAt: new Date().toISOString() }
              : chart
          ),
        }));
      },

      addTag: (id, tag) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id && !chart.tags.includes(tag)
              ? { ...chart, tags: [...chart.tags, tag], updatedAt: new Date().toISOString() }
              : chart
          ),
        }));
      },

      removeTag: (id, tag) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id
              ? { ...chart, tags: chart.tags.filter(t => t !== tag), updatedAt: new Date().toISOString() }
              : chart
          ),
        }));
      },

      getChartsByTag: (tag) => {
        return get().charts.filter((chart) => chart.tags.includes(tag));
      },

      getFavoriteCharts: () => {
        return get().charts.filter((chart) => chart.isFavorite);
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'astrolab-charts',
      partialize: (state) => ({
        charts: state.charts,
        currentChart: state.currentChart,
      }),
    }
  )
);