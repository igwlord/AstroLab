/**
 * Utilidades de Sanitización para Favoritos
 * Previene XSS y contenido malicioso en campos de texto
 */

import DOMPurify from 'dompurify';

/**
 * Configuración de DOMPurify para diferentes contextos
 */
const SANITIZE_CONFIG = {
  // Configuración estricta: solo texto plano
  TEXT_ONLY: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  
  // Configuración moderada: permite formato básico
  BASIC_HTML: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
  },
};

/**
 * Sanitiza texto para prevenir XSS
 * Por defecto, elimina todo HTML y deja solo texto
 */
export function sanitizeText(text: string, allowBasicHTML = false): string {
  if (!text) return '';
  
  const config = allowBasicHTML ? SANITIZE_CONFIG.BASIC_HTML : SANITIZE_CONFIG.TEXT_ONLY;
  return DOMPurify.sanitize(text, config).trim();
}

/**
 * NOTA: sanitizePreview() eliminado en REFACTOR 6
 * Sistema v2 no usa previews complejos
 */

/**
 * Valida que una URL sea segura
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    // Solo permitir http, https y rutas relativas
    return ['http:', 'https:', ''].includes(parsed.protocol);
  } catch {
    // Si la URL es relativa o inválida, permitirla (será relativa al dominio)
    return !url.startsWith('javascript:') && !url.startsWith('data:');
  }
}

/**
 * Valida límites de texto
 */
export function validateTextLength(
  text: string,
  maxLength: number,
  fieldName = 'Texto'
): { valid: boolean; error?: string } {
  if (!text) return { valid: true };
  
  if (text.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} excede el límite de ${maxLength} caracteres (actual: ${text.length})`,
    };
  }
  
  return { valid: true };
}

/**
 * Límites recomendados para campos de texto
 */
export const TEXT_LIMITS = {
  SUMMARY: 500,
  TIP: 200,
  NOTES: 500,
  TITLE: 100,
} as const;
