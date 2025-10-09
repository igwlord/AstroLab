export interface Polarization {
  name: string;
  symbol: string;
  description: string;
  example: string;
  shadows: string;
  integration: string;
  color: string;
  chakra: string;
  frequency: number | string;
  category: 'type' | 'example';
  sacredGeometry?: string;
  geometryPurpose?: string;
}

export const POLARIZATIONS: Polarization[] = [
  {
    name: 'Polarización por Planeta',
    symbol: '🪐',
    description: 'Cuando un planeta recibe demasiada atención en la carta natal, ya sea por múltiples aspectos tensos o por ser un punto focal de la dinámica.',
    example: 'Neptuno fuertemente aspectado (oposiciones, cuadraturas) → polarización hacia la confusión, espiritualidad, sensibilidad extrema.',
    shadows: 'Dependencia del arquetipo (ej: Neptuno → evasión, Saturno → miedo paralizante, Marte → agresividad).',
    integration: 'Trabajar el opuesto complementario (ej: Virgo para Neptuno → orden y discernimiento; flexibilidad para Saturno).',
    color: 'Depende del planeta polarizado',
    chakra: 'Según el planeta regente',
    frequency: 'Variable (396-963 Hz)',
    category: 'type'
  },
  {
    name: 'Polarización por Signo',
    symbol: '♈',
    description: 'Cuando la mayoría de los planetas se acumulan en un mismo signo zodiacal, generando una concentración extrema de esa energía.',
    example: '4 planetas en Escorpio → vida marcada por intensidad, crisis y transformaciones constantes.',
    shadows: 'Quedarse atrapado en una sola forma de ver el mundo, rigidez en la perspectiva.',
    integration: 'Aprender del signo opuesto → Escorpio aprende de Tauro (estabilidad, simplicidad), Leo de Acuario (desapego, colectivo).',
    color: 'Color del signo polarizado',
    chakra: 'Según el signo',
    frequency: 528,
    category: 'type'
  },
  {
    name: 'Polarización por Elemento',
    symbol: '🔥',
    description: 'Cuando un elemento domina la carta natal (fuego, tierra, aire o agua), generando exceso en esa cualidad y carencia en los demás.',
    example: 'Polarización en agua → persona muy empática pero que se ahoga en emociones. Polarización en fuego → mucha acción pero falta de reflexión.',
    shadows: 'Fuego: impulsividad. Tierra: rigidez. Aire: dispersión mental. Agua: hipersensibilidad emocional.',
    integration: 'Equilibrar con actividades de los elementos faltantes (agua falta → meditar con agua; aire falta → estudiar, escribir; tierra falta → jardinería).',
    color: 'Rojo (fuego), Verde (tierra), Azul (aire), Violeta (agua)',
    chakra: 'Según el elemento dominante',
    frequency: 432,
    category: 'type'
  },
  {
    name: 'Polarización por Modalidad',
    symbol: '⚡',
    description: 'Cuando una modalidad (Cardinal, Fijo o Mutable) domina la carta natal, afectando la forma de actuar y responder ante la vida.',
    example: 'Polarización en mutable → persona multitasking, adaptable pero con poca estabilidad y dirección clara.',
    shadows: 'Cardinal: ansiedad, impaciencia. Fijo: terquedad, estancamiento. Mutable: dispersión, falta de rumbo.',
    integration: 'Equilibrar con cualidades de las otras modalidades (Fijo necesita Mutable para flexibilidad; Cardinal necesita Fijo para constancia).',
    color: 'Amarillo (cardinal), Naranja (fijo), Verde (mutable)',
    chakra: 'Plexo Solar (modalidad)',
    frequency: 528,
    category: 'type'
  },
  {
    name: 'Neptuno Polarizado',
    symbol: '♆',
    description: 'Neptuno recibe múltiples aspectos tensos o se convierte en punto focal. Genera tendencia a la evasión, confusión espiritual y sensibilidad extrema.',
    example: 'Neptuno en cuadratura con Sol, Luna y Marte → dificultad para ver la realidad claramente, adicciones, espiritualidad confusa.',
    shadows: 'Evasión de la realidad, adicciones, victimismo, falta de límites.',
    integration: 'Trabajar con rutina, estructura terrenal (energía de Virgo/Saturno). Discernimiento claro.',
    color: 'Violeta',
    chakra: 'Corona',
    frequency: 963,
    category: 'example'
  },
  {
    name: 'Saturno Polarizado',
    symbol: '♄',
    description: 'Saturno recibe múltiples aspectos tensos o domina la carta. Genera rigidez, miedo, bloqueo y exceso de responsabilidad.',
    example: 'Saturno en cuadratura con varios planetas personales → vida marcada por limitaciones, exigencia extrema, miedo al fracaso.',
    shadows: 'Rigidez, miedo paralizante, pesimismo, autoexigencia destructiva.',
    integration: 'Integrar flexibilidad, humor, juego (energía de Júpiter/Sagitario). Aprender a soltar control.',
    color: 'Negro y marrón',
    chakra: 'Raíz',
    frequency: 417,
    category: 'example'
  },
  {
    name: 'Marte Polarizado',
    symbol: '♂',
    description: 'Marte recibe múltiples aspectos tensos o se convierte en punto focal. Genera impulsividad, agresividad y exceso de acción sin reflexión.',
    example: 'Marte en T-cuadrada → vida llena de conflictos, impaciencia, tendencia a la confrontación constante.',
    shadows: 'Impulsividad, agresividad, falta de paciencia, autodestrucción por exceso de acción.',
    integration: 'Integrar disciplina, paciencia y reflexión (energía de Saturno/Libra). Canalizar la acción conscientemente.',
    color: 'Rojo intenso',
    chakra: 'Raíz',
    frequency: 396,
    category: 'example'
  },
  {
    name: 'Venus Polarizado',
    symbol: '♀',
    description: 'Venus recibe múltiples aspectos tensos o domina excesivamente. Genera búsqueda excesiva de placer, aprobación externa y dependencia afectiva.',
    example: 'Venus en múltiples aspectos difíciles → necesidad constante de validación, relaciones codependientes, búsqueda de placer sin límites.',
    shadows: 'Búsqueda excesiva de aprobación, codependencia, hedonismo, dificultad para estar solo/a.',
    integration: 'Integrar amor propio, autosuficiencia emocional (energía de Marte/Aries). Desarrollar independencia afectiva.',
    color: 'Rosa y verde',
    chakra: 'Corazón',
    frequency: 639,
    category: 'example'
  }
];

// Ejercicio holístico de integración
export const INTEGRATION_EXERCISE = {
  title: 'Ejercicio Holístico de Integración',
  steps: [
    'Identifica el área polarizada (planeta/signo/elemento)',
    'Reconoce la sombra (ej. Neptuno polarizado → evasión)',
    'Trabaja el opuesto complementario: Aries ↔ Libra, Tauro ↔ Escorpio, Géminis ↔ Sagitario, Cáncer ↔ Capricornio, Leo ↔ Acuario, Virgo ↔ Piscis',
    'Práctica de respiración balanceadora: Inhala visualizando el color del planeta polarizado, exhala visualizando el color del signo opuesto. Repite 7 veces.'
  ]
};
