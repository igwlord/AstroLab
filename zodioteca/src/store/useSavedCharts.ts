import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NatalChart } from '../services/realAstroCalculator';

export interface SavedChart {
  id: string;
  name: string;
  chart: NatalChart;
  savedAt: string;
  notes?: string;
}

interface SavedChartsState {
  charts: SavedChart[];
  saveChart: (name: string, chart: NatalChart, notes?: string) => void;
  deleteChart: (id: string) => void;
  updateChart: (id: string, updates: Partial<SavedChart>) => void;
  getChart: (id: string) => SavedChart | undefined;
}

export const useSavedCharts = create<SavedChartsState>()(
  persist(
    (set, get) => ({
      charts: [],
      
      saveChart: (name: string, chart: NatalChart, notes?: string) => {
        const newChart: SavedChart = {
          id: `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          chart,
          savedAt: new Date().toISOString(),
          notes,
        };
        
        set((state) => ({
          charts: [newChart, ...state.charts],
        }));
        
        return newChart.id;
      },
      
      deleteChart: (id: string) => {
        set((state) => ({
          charts: state.charts.filter((chart) => chart.id !== id),
        }));
      },
      
      updateChart: (id: string, updates: Partial<SavedChart>) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id ? { ...chart, ...updates } : chart
          ),
        }));
      },
      
      getChart: (id: string) => {
        return get().charts.find((chart) => chart.id === id);
      },
    }),
    {
      name: 'zodioteca-saved-charts',
    }
  )
);
