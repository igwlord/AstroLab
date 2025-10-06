import { logger } from '../utils/logger';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HouseSystem = 'placidus' | 'koch' | 'equal' | 'campanus' | 'regiomontanus' | 'whole-sign';
export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'es' | 'en';

export interface OrbSettings {
  conjunction: number;
  opposition: number;
  trine: number;
  square: number;
  sextile: number;
  quincunx: number;
}

export interface AstroSettings {
  houseSystem: HouseSystem;
  orbs: OrbSettings;
  showMinorAspects: boolean;
  showAsteroids: boolean;
  showFixedStars: boolean;
  coordinateSystem: 'tropical' | 'sidereal';
  // 🆕 Configuraciones avanzadas (FASE 1-4)
  showChiron: boolean;
  lilithType: 'mean' | 'true' | 'both';
  showLunarNodes: boolean;
  lunarNodesType: 'mean' | 'true';
  showQuincunx: boolean;
  showAllMinorAspects: boolean;
  // 🆕 FASE 5: Partes Árabes
  showArabicParts: boolean;
  // 🆕 FASE 6: Análisis de Hemisferios
  showHemispheres: boolean;
}

interface SettingsState {
  // UI Settings
  theme: Theme;
  language: Language;
  
  // Astrological Settings
  astro: AstroSettings;
  
  // App Settings
  autoSave: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setHouseSystem: (system: HouseSystem) => void;
  updateOrbs: (orbs: Partial<OrbSettings>) => void;
  setOrbValue: (aspect: keyof OrbSettings, value: number) => void;
  toggleMinorAspects: () => void;
  toggleAsteroids: () => void;
  toggleFixedStars: () => void;
  setCoordinateSystem: (system: 'tropical' | 'sidereal') => void;
  // 🆕 Acciones para configuraciones avanzadas
  toggleChiron: () => void;
  setLilithType: (type: 'mean' | 'true' | 'both') => void;
  toggleLunarNodes: () => void;
  setLunarNodesType: (type: 'mean' | 'true') => void;
  toggleQuincunx: () => void;
  toggleAllMinorAspects: () => void;
  toggleArabicParts: () => void; // 🆕 FASE 5
  toggleHemispheres: () => void; // 🆕 FASE 6
  enableAllAdvanced: () => void;
  disableAllAdvanced: () => void;
  toggleAutoSave: () => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => boolean;
}

const defaultOrbSettings: OrbSettings = {
  conjunction: 8,
  opposition: 8,
  trine: 6,
  square: 6,
  sextile: 4,
  quincunx: 3,
};

const defaultAstroSettings: AstroSettings = {
  houseSystem: 'placidus',
  orbs: defaultOrbSettings,
  showMinorAspects: false,
  showAsteroids: true, // 🆕 Activado por defecto
  showFixedStars: false,
  coordinateSystem: 'tropical',
  // 🆕 Configuraciones avanzadas por defecto
  showChiron: true,
  lilithType: 'mean',
  showLunarNodes: true,
  lunarNodesType: 'mean',
  showQuincunx: true,
  showAllMinorAspects: true,
  showArabicParts: true, // 🆕 FASE 5 activado por defecto
  showHemispheres: true, // 🆕 FASE 6 activado por defecto
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Default values
      theme: 'auto',
      language: 'es',
      astro: defaultAstroSettings,
      autoSave: true,
      notifications: true,
      soundEnabled: true,

      // Theme actions
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // Auto theme based on system preference
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.toggle('dark', isDark);
        }
      },

      setLanguage: (language) => {
        set({ language });
      },

      // Astro settings actions
      setHouseSystem: (system) => {
        set((state) => ({
          astro: { ...state.astro, houseSystem: system },
        }));
      },

      updateOrbs: (newOrbs) => {
        set((state) => ({
          astro: {
            ...state.astro,
            orbs: { ...state.astro.orbs, ...newOrbs },
          },
        }));
      },

      setOrbValue: (aspect, value) => {
        set((state) => ({
          astro: {
            ...state.astro,
            orbs: { ...state.astro.orbs, [aspect]: Math.max(0, Math.min(15, value)) },
          },
        }));
      },

      toggleMinorAspects: () => {
        set((state) => ({
          astro: { ...state.astro, showMinorAspects: !state.astro.showMinorAspects },
        }));
      },

      toggleAsteroids: () => {
        set((state) => ({
          astro: { ...state.astro, showAsteroids: !state.astro.showAsteroids },
        }));
      },

      toggleFixedStars: () => {
        set((state) => ({
          astro: { ...state.astro, showFixedStars: !state.astro.showFixedStars },
        }));
      },

      setCoordinateSystem: (system) => {
        set((state) => ({
          astro: { ...state.astro, coordinateSystem: system },
        }));
      },

      // 🆕 Acciones para configuraciones avanzadas
      toggleChiron: () => {
        set((state) => ({
          astro: { ...state.astro, showChiron: !state.astro.showChiron },
        }));
      },

      setLilithType: (type) => {
        set((state) => ({
          astro: { ...state.astro, lilithType: type },
        }));
      },

      toggleLunarNodes: () => {
        set((state) => ({
          astro: { ...state.astro, showLunarNodes: !state.astro.showLunarNodes },
        }));
      },

      setLunarNodesType: (type) => {
        set((state) => ({
          astro: { ...state.astro, lunarNodesType: type },
        }));
      },

      toggleQuincunx: () => {
        set((state) => ({
          astro: { ...state.astro, showQuincunx: !state.astro.showQuincunx },
        }));
      },

      toggleAllMinorAspects: () => {
        set((state) => ({
          astro: { ...state.astro, showAllMinorAspects: !state.astro.showAllMinorAspects },
        }));
      },

      toggleArabicParts: () => {
        set((state) => ({
          astro: { ...state.astro, showArabicParts: !state.astro.showArabicParts },
        }));
      },

      toggleHemispheres: () => {
        set((state) => ({
          astro: { ...state.astro, showHemispheres: !state.astro.showHemispheres },
        }));
      },

      enableAllAdvanced: () => {
        set((state) => ({
          astro: {
            ...state.astro,
            showAsteroids: true,
            showChiron: true,
            showLunarNodes: true,
            showQuincunx: true,
            showAllMinorAspects: true,
            showArabicParts: true, // 🆕 FASE 5
            showHemispheres: true, // 🆕 FASE 6
          },
        }));
      },

      disableAllAdvanced: () => {
        set((state) => ({
          astro: {
            ...state.astro,
            showAsteroids: false,
            showChiron: false,
            showLunarNodes: false,
            showQuincunx: false,
            showAllMinorAspects: false,
            showArabicParts: false, // 🆕 FASE 5
            showHemispheres: false, // 🆕 FASE 6
          },
        }));
      },

      // App settings actions
      toggleAutoSave: () => {
        set((state) => ({ autoSave: !state.autoSave }));
      },

      toggleNotifications: () => {
        set((state) => ({ notifications: !state.notifications }));
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      resetToDefaults: () => {
        set({
          theme: 'auto',
          language: 'es',
          astro: defaultAstroSettings,
          autoSave: true,
          notifications: true,
          soundEnabled: true,
        });
      },

      exportSettings: () => {
        const state = get();
        const exportData = {
          theme: state.theme,
          language: state.language,
          astro: state.astro,
          autoSave: state.autoSave,
          notifications: state.notifications,
          soundEnabled: state.soundEnabled,
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
        };
        return JSON.stringify(exportData, null, 2);
      },

      importSettings: (settingsJson) => {
        try {
          const importedSettings = JSON.parse(settingsJson);
          
          // Validate structure
          if (typeof importedSettings !== 'object') return false;
          
          set((state) => ({
            ...state,
            theme: importedSettings.theme || state.theme,
            language: importedSettings.language || state.language,
            astro: { ...state.astro, ...importedSettings.astro },
            autoSave: importedSettings.autoSave ?? state.autoSave,
            notifications: importedSettings.notifications ?? state.notifications,
            soundEnabled: importedSettings.soundEnabled ?? state.soundEnabled,
          }));
          
          return true;
        } catch (error) {
          logger.error('Error importing settings:', error);
          return false;
        }
      },
    }),
    {
      name: 'astrolab-settings',
    }
  )
);
