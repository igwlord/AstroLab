export interface Aspect {
  name: string;
  angle: string;
  symbol: string;
  description: string;
  manifestation: string;
  polarity: string;
  orb: string;
  color: string;
  chakra: string;
  frequency: number;
  exercise: string;
  category: 'major' | 'minor' | 'creative';
}

export const ASPECTS: Aspect[] = [
  {
    name: 'Conjunción',
    angle: '0°',
    symbol: '☌',
    description: 'La conjunción ocurre cuando dos planetas están juntos en el mismo grado o muy cercanos. Sus energías se fusionan y trabajan como una sola fuerza. Puede ser poderosa y amplificadora, pero también confusa si los planetas son de naturaleza opuesta.',
    manifestation: 'Sentir que una cualidad domina la personalidad (ej. Sol + Mercurio → mente brillante y comunicativa).',
    polarity: 'Neutra (depende de los planetas)',
    orb: '8° (más cerrado con planetas rápidos)',
    color: 'Dorado',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Meditar visualizando dos colores que se mezclan en uno solo, aceptando la unión de energías internas.',
    category: 'major'
  },
  {
    name: 'Oposición',
    angle: '180°',
    symbol: '☍',
    description: 'La oposición enfrenta dos planetas en lados opuestos de la carta. Representa polaridad, tensión, el espejo del otro. Genera confrontación y necesidad de equilibrio.',
    manifestation: 'Conflictos en relaciones o situaciones de "todo o nada". Ejemplo: Sol opuesto a Luna → dificultad en equilibrar vida personal y social.',
    polarity: 'Aspecto duro',
    orb: '8°',
    color: 'Azul y rojo (dualidad)',
    chakra: 'Corazón (equilibrio)',
    frequency: 639,
    exercise: 'Escribir dos cualidades opuestas tuyas y diseñar una acción práctica para integrarlas en armonía.',
    category: 'major'
  },
  {
    name: 'Cuadratura',
    angle: '90°',
    symbol: '□',
    description: 'La cuadratura genera tensión, fricción y bloqueos. Representa desafíos que requieren esfuerzo para desbloquear la energía.',
    manifestation: 'Sentir obstáculos constantes. Ejemplo: Marte cuadratura Saturno → dificultad para accionar por miedo o límites externos.',
    polarity: 'Aspecto duro',
    orb: '6°',
    color: 'Rojo intenso',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Hacer 10 minutos de ejercicio físico liberando la tensión y repitiendo: "Transformo el bloqueo en acción consciente".',
    category: 'major'
  },
  {
    name: 'Trígono',
    angle: '120°',
    symbol: '△',
    description: 'El trígono fluye con naturalidad. Representa talento, facilidad, dones innatos y armonía entre energías. Aporta confianza y estabilidad. El riesgo es caer en la comodidad.',
    manifestation: 'Facilidad en áreas de vida sin demasiado esfuerzo. Ejemplo: Venus trígono Júpiter → encanto natural en relaciones.',
    polarity: 'Aspecto blando',
    orb: '6°',
    color: 'Verde',
    chakra: 'Corazón',
    frequency: 528,
    exercise: 'Hacer respiración profunda visualizando luz verde expandiéndose desde el pecho.',
    category: 'major'
  },
  {
    name: 'Sextil',
    angle: '60°',
    symbol: '⚹',
    description: 'El sextil representa oportunidades, cooperación y apertura. No es tan poderoso como el trígono, pero facilita el aprendizaje y la colaboración. Requiere acción consciente para manifestarse.',
    manifestation: 'Facilidad para cooperar o aprender nuevas habilidades. Ejemplo: Sol sextil Marte → motivación natural para actuar.',
    polarity: 'Aspecto blando',
    orb: '4°',
    color: 'Amarillo',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Escribir una idea pendiente y dar un primer paso para materializarla.',
    category: 'major'
  },
  {
    name: 'Quincuncio',
    angle: '150°',
    symbol: '⚻',
    description: 'El quincuncio es un aspecto de ajuste. Representa incomodidad, energías que no se entienden y necesitan integración a través de esfuerzo.',
    manifestation: 'Sentir contradicciones internas. Ejemplo: Luna quincuncio Marte → emociones y acciones no coordinadas.',
    polarity: 'Aspecto de tensión menor',
    orb: '3°',
    color: 'Violeta',
    chakra: 'Corona',
    frequency: 963,
    exercise: 'Hacer 5 min de respiración alterna por fosas nasales para equilibrar hemisferios.',
    category: 'minor'
  },
  {
    name: 'Quintil',
    angle: '72°',
    symbol: 'Q',
    description: 'Son aspectos creativos que revelan talentos especiales o formas únicas de expresar energía. Están ligados a dones artísticos o inventivos.',
    manifestation: 'Talentos poco comunes. Ejemplo: Venus quintil Neptuno → sensibilidad estética especial.',
    polarity: 'Aspecto creativo',
    orb: '2°',
    color: 'Dorado',
    chakra: 'Tercer Ojo',
    frequency: 852,
    exercise: 'Dedicar 15 minutos diarios a una actividad creativa espontánea (pintar, improvisar música).',
    category: 'creative'
  },
  {
    name: 'Biquintil',
    angle: '144°',
    symbol: 'bQ',
    description: 'Son aspectos creativos que revelan talentos especiales o formas únicas de expresar energía. Están ligados a dones artísticos o inventivos.',
    manifestation: 'Talentos poco comunes con expresión dual o compleja.',
    polarity: 'Aspecto creativo',
    orb: '2°',
    color: 'Dorado brillante',
    chakra: 'Tercer Ojo',
    frequency: 852,
    exercise: 'Dedicar 15 minutos diarios a una actividad creativa espontánea (pintar, improvisar música).',
    category: 'creative'
  },
  {
    name: 'Semisextil',
    angle: '30°',
    symbol: '⚺',
    description: 'El semisextil une signos vecinos, que suelen no comprenderse bien. Representa aprendizajes sutiles y pequeños ajustes.',
    manifestation: 'Experiencias incómodas que generan crecimiento lento.',
    polarity: 'Aspecto menor',
    orb: '2°',
    color: 'Azul claro',
    chakra: 'Garganta',
    frequency: 741,
    exercise: 'Elegir un pequeño hábito incómodo y sostenerlo 7 días para integrar el aprendizaje.',
    category: 'minor'
  },
  {
    name: 'Semicuadratura',
    angle: '45°',
    symbol: '∠',
    description: 'La semicuadratura es una tensión suave, como un roce constante que incomoda. Representa irritaciones que obligan a ajustes.',
    manifestation: 'Conflictos menores que desgastan si no se resuelven. Ejemplo: Mercurio semicuadratura Saturno → dificultades leves para expresarse.',
    polarity: 'Aspecto menor duro',
    orb: '2°',
    color: 'Naranja oscuro',
    chakra: 'Sacro',
    frequency: 417,
    exercise: 'Practicar 10 minutos de meditación con enfoque en soltar irritaciones pequeñas del día.',
    category: 'minor'
  }
];
