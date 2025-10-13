/**
 * Reflexiones Constants
 * Mensajes motivadores, prompts y configuraciones
 */

export const REFLECTION_PROMPTS = [
  '¿Qué descubriste hoy sobre tu carta natal?',
  '¿Cómo se manifiesta tu Luna en tu vida diaria?',
  'Reflexiona sobre un aspecto importante en tu carta',
  '¿Qué planeta resuena más contigo últimamente?',
  'Escribe sobre una experiencia reciente y su conexión astrológica',
  '¿Qué casa está activa en tu vida ahora?',
  'Reflexiona sobre tu Ascendente y cómo te presentas al mundo',
  '¿Qué tránsitos planetarios estás sintiendo?',
];

export const EMPTY_STATE_MESSAGES = {
  noReflections: {
    title: 'Comienza tu viaje de reflexión',
    description: 'Crea tu primera reflexión y empieza a documentar tus descubrimientos astrológicos',
  },
  noResults: {
    title: 'No hay resultados',
    description: 'Intenta con otros términos de búsqueda o tags',
  },
  noFilteredReflections: {
    title: 'Sin reflexiones',
    description: 'No tienes reflexiones con estos filtros',
  },
};

export const REFLECTION_TAGS_SUGGESTIONS = [
  'Luna',
  'Sol',
  'Ascendente',
  'Tránsitos',
  'Aspectos',
  'Casas',
  'Planetas',
  'Emociones',
  'Insight',
  'Descubrimiento',
  'Práctica',
  'Meditación',
  'Sincronicidad',
  'Patrón',
  'Aprendizaje',
];

export const REFLECTION_LIMITS = {
  titleMaxLength: 200,
  contentMaxLength: 5000,
  tagsMaxCount: 10,
  titleMinLength: 3,
  contentMinLength: 10,
};

export const REFLECTION_MESSAGES = {
  createSuccess: '✨ Reflexión creada exitosamente',
  updateSuccess: '✅ Reflexión actualizada',
  deleteSuccess: '🗑️ Reflexión eliminada',
  createError: 'Error al crear la reflexión',
  updateError: 'Error al actualizar la reflexión',
  deleteError: 'Error al eliminar la reflexión',
  loadError: 'Error al cargar las reflexiones',
  validationTitle: 'El título es obligatorio',
  validationContent: 'El contenido es obligatorio',
  validationTitleTooShort: `El título debe tener al menos ${REFLECTION_LIMITS.titleMinLength} caracteres`,
  validationContentTooShort: `El contenido debe tener al menos ${REFLECTION_LIMITS.contentMinLength} caracteres`,
};
