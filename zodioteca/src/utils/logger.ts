/**
 * Logger utility para desarrollo
 * En producción, los logs se deshabilitan automáticamente
 */

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV !== false;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
  
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  
  error: (...args: unknown[]) => {
    // Errors siempre se muestran, incluso en producción
    console.error(...args);
  },
  
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  }
};
