import toast from 'react-hot-toast';

type ToastOptions = Record<string, unknown>;
import { PLANET_COLORS, SEMANTIC_COLORS } from '../constants/designTokens';

/**
 * Tipos de toast astrológicos
 */
export type AstrologicalToastType = 'success' | 'error' | 'warning' | 'info' | 'planetary';

/**
 * Configuración de toasts por planeta
 */
const PLANET_TOAST_CONFIGS = {
  sun: {
    icon: '☉',
    color: PLANET_COLORS.sun.primary,
    bgColor: PLANET_COLORS.sun.light,
    borderColor: PLANET_COLORS.sun.secondary,
  },
  moon: {
    icon: '☽',
    color: PLANET_COLORS.moon.primary,
    bgColor: PLANET_COLORS.moon.light,
    borderColor: PLANET_COLORS.moon.secondary,
  },
  mercury: {
    icon: '☿',
    color: PLANET_COLORS.mercury.primary,
    bgColor: PLANET_COLORS.mercury.light,
    borderColor: PLANET_COLORS.mercury.secondary,
  },
  venus: {
    icon: '♀',
    color: PLANET_COLORS.venus.primary,
    bgColor: PLANET_COLORS.venus.light,
    borderColor: PLANET_COLORS.venus.secondary,
  },
  mars: {
    icon: '♂',
    color: PLANET_COLORS.mars.primary,
    bgColor: PLANET_COLORS.mars.light,
    borderColor: PLANET_COLORS.mars.secondary,
  },
  jupiter: {
    icon: '♃',
    color: PLANET_COLORS.jupiter.primary,
    bgColor: PLANET_COLORS.jupiter.light,
    borderColor: PLANET_COLORS.jupiter.secondary,
  },
  saturn: {
    icon: '♄',
    color: PLANET_COLORS.saturn.primary,
    bgColor: PLANET_COLORS.saturn.light,
    borderColor: PLANET_COLORS.saturn.secondary,
  },
  uranus: {
    icon: '♅',
    color: PLANET_COLORS.uranus.primary,
    bgColor: PLANET_COLORS.uranus.light,
    borderColor: PLANET_COLORS.uranus.secondary,
  },
  neptune: {
    icon: '♆',
    color: PLANET_COLORS.neptune.primary,
    bgColor: PLANET_COLORS.neptune.light,
    borderColor: PLANET_COLORS.neptune.secondary,
  },
  pluto: {
    icon: '♇',
    color: PLANET_COLORS.pluto.primary,
    bgColor: PLANET_COLORS.pluto.light,
    borderColor: PLANET_COLORS.pluto.secondary,
  },
} as const;

/**
 * Configuración de toasts semánticos
 */
const SEMANTIC_TOAST_CONFIGS = {
  success: {
    icon: '✅',
    color: SEMANTIC_COLORS.success,
    bgColor: '#F0FFF4',
    borderColor: '#68D391',
  },
  error: {
    icon: '❌',
    color: SEMANTIC_COLORS.error,
    bgColor: '#FFF5F5',
    borderColor: '#FC8181',
  },
  warning: {
    icon: '⚠️',
    color: SEMANTIC_COLORS.warning,
    bgColor: '#FFFBEB',
    borderColor: '#F6AD55',
  },
  info: {
    icon: 'ℹ️',
    color: SEMANTIC_COLORS.info,
    bgColor: '#EBF8FF',
    borderColor: '#63B3ED',
  },
} as const;

/**
 * Toast astrológico personalizado
 */
export const astrologicalToast = {
  /**
   * Toast de éxito (Júpiter - expansión)
   */
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      icon: SEMANTIC_TOAST_CONFIGS.success.icon,
      style: {
        background: SEMANTIC_TOAST_CONFIGS.success.bgColor,
        color: SEMANTIC_TOAST_CONFIGS.success.color,
        border: `1px solid ${SEMANTIC_TOAST_CONFIGS.success.borderColor}`,
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: `0 4px 12px rgba(104, 211, 145, 0.15)`,
      },
      ...options,
    });
  },

  /**
   * Toast de error (Marte - conflicto)
   */
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      icon: SEMANTIC_TOAST_CONFIGS.error.icon,
      style: {
        background: SEMANTIC_TOAST_CONFIGS.error.bgColor,
        color: SEMANTIC_TOAST_CONFIGS.error.color,
        border: `1px solid ${SEMANTIC_TOAST_CONFIGS.error.borderColor}`,
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: `0 4px 12px rgba(252, 129, 129, 0.15)`,
      },
      ...options,
    });
  },

  /**
   * Toast de advertencia (Saturno - precaución)
   */
  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      icon: SEMANTIC_TOAST_CONFIGS.warning.icon,
      style: {
        background: SEMANTIC_TOAST_CONFIGS.warning.bgColor,
        color: SEMANTIC_TOAST_CONFIGS.warning.color,
        border: `1px solid ${SEMANTIC_TOAST_CONFIGS.warning.borderColor}`,
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: `0 4px 12px rgba(246, 173, 85, 0.15)`,
      },
      ...options,
    });
  },

  /**
   * Toast informativo (Mercurio - comunicación)
   */
  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      icon: SEMANTIC_TOAST_CONFIGS.info.icon,
      style: {
        background: SEMANTIC_TOAST_CONFIGS.info.bgColor,
        color: SEMANTIC_TOAST_CONFIGS.info.color,
        border: `1px solid ${SEMANTIC_TOAST_CONFIGS.info.borderColor}`,
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: `0 4px 12px rgba(99, 179, 237, 0.15)`,
      },
      ...options,
    });
  },

  /**
   * Toast planetario personalizado
   */
  planetary: (planet: keyof typeof PLANET_TOAST_CONFIGS, message: string, options?: ToastOptions) => {
    const config = PLANET_TOAST_CONFIGS[planet];
    return toast(message, {
      icon: config.icon,
      style: {
        background: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: `0 4px 12px ${config.color}20`,
      },
      ...options,
    });
  },

  /**
   * Toast de loading con spinner astrológico
   */
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      style: {
        background: '#F3F4F6',
        color: '#374151',
        border: '1px solid #D1D5DB',
        borderRadius: '12px',
        fontWeight: '600',
      },
      ...options,
    });
  },

  /**
   * Toast de celebración (para logros, milestones)
   */
  celebration: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      icon: '🎉',
      style: {
        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
        color: '#8B4513',
        border: '2px solid #FFD700',
        borderRadius: '16px',
        fontWeight: '700',
        fontSize: '16px',
        boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
      },
      duration: 5000,
      ...options,
    });
  },

  /**
   * Dismiss all toasts
   */
  dismiss: () => toast.dismiss(),

  /**
   * Remove specific toast
   */
  remove: (toastId: string) => toast.remove(toastId),
};

/**
 * Hook personalizado para toasts astrológicos
 */
export const useAstrologicalToast = () => {
  return astrologicalToast;
};