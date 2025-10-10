import type { NatalChart } from '../services/realAstroCalculator';

/**
 * Tipos de polarización detectables
 */
export type PolarizationType = 'planet' | 'sign' | 'element' | 'modality';

/**
 * Polarización detectada en la carta natal
 */
export interface DetectedPolarization {
  type: PolarizationType;
  subject: string; // "Plutón", "Escorpio", "Fuego", "Cardinal"
  intensity: number; // 0-100
  reasons: string[]; // ["Sol cuadratura Plutón", "Plutón en Casa X"]
  affectedHouses: number[];
  involvedPlanets: string[];
  integrationKey: string;
  chakra: string;
  color: string;
  gradient: string;
  icon: string;
  shadow: string;
  integration: string;
  sacredGeometry: string;
  geometryPurpose: string;
  frequency: number; // Frecuencia Solfeggio en Hz
}

/**
 * Aspectos considerados tensos/desafiantes
 */
const HARD_ASPECTS = [
  'Cuadratura', 'Oposición', 'Semicuadratura', 'Sesquicuadratura',
  'Square', 'Opposition', 'Semisquare', 'Sesquiquadrate'
];

/**
 * Configuración de planetas transpersonales y su información
 */
const TRANSPERSONAL_PLANETS = {
  'Plutón': {
    chakra: 'Corona y Raíz',
    color: '#8B00FF',
    gradient: 'from-purple-900 to-indigo-950',
    icon: '♇',
    shadow: 'Control, obsesión, miedo al poder, manipulación',
    integration: 'Aceptar el poder personal sin dominar. Transformación consciente y renacimiento evolutivo.',
    sacredGeometry: 'Dodecaedro (Éter)',
    geometryPurpose: 'Facilita la alquimia interior. Muerte y renacimiento del ego hacia la conciencia pura.',
    frequency: 741 // Expresión y soluciones, liberación de toxinas emocionales
  },
  'Neptuno': {
    chakra: 'Corona y Tercer Ojo',
    color: '#4169E1',
    gradient: 'from-violet-600 to-blue-500',
    icon: '♆',
    shadow: 'Evasión, confusión, victimismo, adicciones, escapismo espiritual',
    integration: 'Conexión espiritual con discernimiento. Estructura y límites claros (energía de Virgo/Saturno).',
    sacredGeometry: 'Icosaedro (Agua)',
    geometryPurpose: 'Purifica emociones, conecta con la intuición y la empatía desde la realidad.',
    frequency: 963 // Conexión espiritual, glándula pineal
  },
  'Urano': {
    chakra: 'Corona y Garganta',
    color: '#00CED1',
    gradient: 'from-cyan-500 to-blue-600',
    icon: '♅',
    shadow: 'Rebeldía destructiva, desapego extremo, caos sin propósito',
    integration: 'Innovación consciente. Balance entre libertad e integración social.',
    sacredGeometry: 'Octaedro (Aire)',
    geometryPurpose: 'Integra cielo y tierra. Favorece la claridad y la libertad con propósito.',
    frequency: 852 // Intuición, retorno al orden espiritual
  },
  'Saturno': {
    chakra: 'Raíz',
    color: '#2F4F4F',
    gradient: 'from-gray-800 to-black',
    icon: '♄',
    shadow: 'Rigidez, miedo paralizante, pesimismo, autoexigencia destructiva',
    integration: 'Disciplina con flexibilidad. Soltar control, integrar juego y humor (energía de Júpiter).',
    sacredGeometry: 'Cubo o Hexaedro (Tierra)',
    geometryPurpose: 'Estabiliza; enseña estructura flexible. Transforma el límite en sostén.',
    frequency: 417 // Cambio, liberación de patrones negativos
  },
  'Marte': {
    chakra: 'Raíz y Plexo Solar',
    color: '#DC143C',
    gradient: 'from-red-600 to-rose-700',
    icon: '♂',
    shadow: 'Impulsividad, agresividad, impaciencia, autodestrucción por acción irreflexiva',
    integration: 'Canalizar la acción conscientemente. Paciencia y reflexión (energía de Saturno/Libra).',
    sacredGeometry: 'Tetraedro Estrellado (Merkaba)',
    geometryPurpose: 'Canaliza la fuerza vital desde el corazón; acción consciente y no reactiva.',
    frequency: 396 // Liberación de culpa y miedo, chakra raíz
  },
  'Venus': {
    chakra: 'Corazón',
    color: '#FF69B4',
    gradient: 'from-pink-500 to-rose-600',
    icon: '♀',
    shadow: 'Dependencia afectiva, búsqueda externa de validación, superficialidad',
    integration: 'Amor propio independiente. Autovalidación y valores internos sólidos.',
    sacredGeometry: 'Flor de la Vida',
    geometryPurpose: 'Abre el corazón al amor universal; ayuda a integrar placer y espiritualidad.',
    frequency: 639 // Conexión y relaciones, chakra corazón
  },
  'Sol': {
    chakra: 'Plexo Solar',
    color: '#FFD700',
    gradient: 'from-yellow-500 to-orange-600',
    icon: '☉',
    shadow: 'Ego inflado, necesidad de reconocimiento, orgullo destructivo',
    integration: 'Equilibrar el poder personal con la humildad. Alinear el yo interno con el propósito del alma.',
    sacredGeometry: 'Tetraedro (Fuego)',
    geometryPurpose: 'Equilibra el poder personal con la humildad. Alinea el yo interno con el propósito del alma.',
    frequency: 528 // Transformación y milagros, reparación ADN
  },
  'Luna': {
    chakra: 'Sacro',
    color: '#C0C0C0',
    gradient: 'from-gray-300 to-slate-400',
    icon: '☽',
    shadow: 'Dependencia emocional, apego al pasado, reactividad emocional',
    integration: 'Seguridad emocional interna. Nutrir sin depender, sentir sin reaccionar.',
    sacredGeometry: 'Vesica Piscis',
    geometryPurpose: 'Restaura la armonía emocional y la receptividad sin apego. Favorece la contención amorosa.',
    frequency: 417 // Cambio facilitador, liberación de trauma
  },
  'Mercurio': {
    chakra: 'Garganta',
    color: '#FFA500',
    gradient: 'from-orange-400 to-yellow-500',
    icon: '☿',
    shadow: 'Dispersión mental, racionalización excesiva, comunicación manipuladora',
    integration: 'Comunicación clara y consciente. Mente enfocada al servicio del corazón.',
    sacredGeometry: 'Cubo de Metatrón',
    geometryPurpose: 'Ordena pensamientos, unifica hemisferios, clarifica la comunicación interior y exterior.',
    frequency: 741 // Expresión y soluciones
  },
  'Júpiter': {
    chakra: 'Tercer Ojo',
    color: '#9370DB',
    gradient: 'from-purple-500 to-indigo-600',
    icon: '♃',
    shadow: 'Exceso, dogmatismo, expansión sin raíz, irresponsabilidad',
    integration: 'Sabiduría con humildad. Expansión consciente con enraizamiento.',
    sacredGeometry: 'Toroide (Campo Unificado)',
    geometryPurpose: 'Centra la expansión; equilibrio entre abundancia y sabiduría interior.',
    frequency: 852 // Intuición, retorno al orden espiritual
  }
};

/**
 * Configuración de elementos
 */
const ELEMENTS_INFO = {
  'Fuego': {
    signs: ['Aries', 'Leo', 'Sagitario'],
    chakra: 'Plexo Solar',
    color: '#FF4500',
    gradient: 'from-red-500 to-orange-600',
    icon: '🔥',
    shadow: 'Impulsividad extrema, falta de reflexión, agotamiento por exceso de acción',
    integration: 'Incorporar reflexión (Aire) y sensibilidad emocional (Agua). Pausas conscientes.',
    sacredGeometry: 'Tetraedro (Fuego)',
    geometryPurpose: 'Acción consciente, voluntad creadora alineada con el corazón.',
    frequency: 528
  },
  'Tierra': {
    signs: ['Tauro', 'Virgo', 'Capricornio'],
    chakra: 'Raíz',
    color: '#228B22',
    gradient: 'from-green-700 to-emerald-900',
    icon: '🌍',
    shadow: 'Rigidez, materialismo excesivo, falta de espontaneidad',
    integration: 'Incorporar fluidez (Agua) y visión (Fuego). Soltar el control.',
    sacredGeometry: 'Cubo o Hexaedro (Tierra)',
    geometryPurpose: 'Estructura, estabilidad, límites saludables y flexibles.',
    frequency: 396
  },
  'Aire': {
    signs: ['Géminis', 'Libra', 'Acuario'],
    chakra: 'Garganta y Tercer Ojo',
    color: '#87CEEB',
    gradient: 'from-sky-400 to-blue-600',
    icon: '🌬️',
    shadow: 'Dispersión mental, desconexión emocional, racionalización excesiva',
    integration: 'Incorporar enraizamiento (Tierra) y conexión emocional (Agua).',
    sacredGeometry: 'Octaedro (Aire)',
    geometryPurpose: 'Expansión mental, comunicación clara, libertad con propósito.',
    frequency: 741
  },
  'Agua': {
    signs: ['Cáncer', 'Escorpio', 'Piscis'],
    chakra: 'Sacro y Corazón',
    color: '#4682B4',
    gradient: 'from-blue-500 to-purple-600',
    icon: '💧',
    shadow: 'Hipersensibilidad, ahogarse en emociones, victimismo',
    integration: 'Incorporar límites (Tierra) y perspectiva mental (Aire).',
    sacredGeometry: 'Icosaedro (Agua)',
    geometryPurpose: 'Emoción purificada, conexión empática desde la claridad.',
    frequency: 417
  }
};

/**
 * Configuración de modalidades
 */
const MODALITIES_INFO = {
  'Cardinal': {
    signs: ['Aries', 'Cáncer', 'Libra', 'Capricornio'],
    chakra: 'Plexo Solar',
    color: '#FFD700',
    gradient: 'from-yellow-500 to-amber-600',
    icon: '⚡',
    shadow: 'Ansiedad, impaciencia extrema, iniciar sin terminar',
    integration: 'Incorporar constancia (Fijo) y adaptabilidad (Mutable).',
    sacredGeometry: 'Tetraedro (Cardinal)',
    geometryPurpose: 'Impulso inicial consciente, liderazgo desde el corazón.',
    frequency: 528
  },
  'Fijo': {
    signs: ['Tauro', 'Leo', 'Escorpio', 'Acuario'],
    chakra: 'Raíz',
    color: '#FF8C00',
    gradient: 'from-orange-600 to-red-700',
    icon: '🔒',
    shadow: 'Terquedad, resistencia al cambio, estancamiento',
    integration: 'Incorporar flexibilidad (Mutable) y empuje (Cardinal).',
    sacredGeometry: 'Cubo (Fijo)',
    geometryPurpose: 'Estabilidad flexible, sostén sin rigidez.',
    frequency: 396
  },
  'Mutable': {
    signs: ['Géminis', 'Virgo', 'Sagitario', 'Piscis'],
    chakra: 'Garganta',
    color: '#32CD32',
    gradient: 'from-green-500 to-teal-600',
    icon: '🔄',
    shadow: 'Dispersión, falta de dirección clara, indecisión crónica',
    integration: 'Incorporar estabilidad (Fijo) y dirección (Cardinal).',
    sacredGeometry: 'Esfera o Toroide (Mutable)',
    geometryPurpose: 'Adaptabilidad con centro, fluidez consciente.',
    frequency: 639
  }
};

/**
 * Configuración de signos
 */
const SIGNS_INFO: Record<string, { 
  chakra: string; 
  color: string; 
  gradient: string; 
  icon: string;
  shadow: string;
  integration: string;
  sacredGeometry: string;
  geometryPurpose: string;
  frequency: number;
}> = {
  'Aries': { chakra: 'Plexo Solar', color: '#FF0000', gradient: 'from-red-600 to-rose-700', icon: '♈', shadow: 'Impulsividad, agresividad', integration: 'Balance con Libra: diplomacia y colaboración', sacredGeometry: 'Tetraedro (Fuego)', geometryPurpose: 'Acción consciente desde el corazón', frequency: 528 },
  'Tauro': { chakra: 'Garganta', color: '#50C878', gradient: 'from-green-600 to-emerald-700', icon: '♉', shadow: 'Terquedad, apego material', integration: 'Balance con Escorpio: transformación y soltar', sacredGeometry: 'Cubo (Tierra)', geometryPurpose: 'Estabilidad flexible y generosa', frequency: 396 },
  'Géminis': { chakra: 'Garganta', color: '#FFFF00', gradient: 'from-yellow-400 to-amber-500', icon: '♊', shadow: 'Dispersión, superficialidad', integration: 'Balance con Sagitario: visión profunda y dirección', sacredGeometry: 'Octaedro (Aire)', geometryPurpose: 'Comunicación clara con propósito', frequency: 741 },
  'Cáncer': { chakra: 'Sacro', color: '#C0C0C0', gradient: 'from-gray-300 to-slate-400', icon: '♋', shadow: 'Apego emocional, dependencia', integration: 'Balance con Capricornio: autonomía y estructura', sacredGeometry: 'Icosaedro (Agua)', geometryPurpose: 'Nutrir sin apego, contener con amor', frequency: 417 },
  'Leo': { chakra: 'Corazón', color: '#FFD700', gradient: 'from-yellow-500 to-orange-600', icon: '♌', shadow: 'Ego, necesidad de reconocimiento', integration: 'Balance con Acuario: servicio al colectivo', sacredGeometry: 'Tetraedro (Fuego)', geometryPurpose: 'Liderazgo desde el corazón', frequency: 528 },
  'Virgo': { chakra: 'Plexo Solar', color: '#8B4513', gradient: 'from-amber-700 to-yellow-800', icon: '♍', shadow: 'Perfeccionismo, crítica excesiva', integration: 'Balance con Piscis: aceptación y fluidez', sacredGeometry: 'Cubo (Tierra)', geometryPurpose: 'Servicio organizado con compasión', frequency: 396 },
  'Libra': { chakra: 'Corazón', color: '#FF69B4', gradient: 'from-pink-400 to-rose-500', icon: '♎', shadow: 'Indecisión, dependencia de otros', integration: 'Balance con Aries: autonomía y acción', sacredGeometry: 'Octaedro (Aire)', geometryPurpose: 'Equilibrio dinámico consciente', frequency: 741 },
  'Escorpio': { chakra: 'Sacro', color: '#800020', gradient: 'from-red-900 to-purple-900', icon: '♏', shadow: 'Obsesión, control, intensidad destructiva', integration: 'Balance con Tauro: simplicidad y estabilidad', sacredGeometry: 'Icosaedro (Agua)', geometryPurpose: 'Transformación profunda con amor', frequency: 417 },
  'Sagitario': { chakra: 'Tercer Ojo', color: '#9370DB', gradient: 'from-purple-500 to-indigo-600', icon: '♐', shadow: 'Exceso de expansión, irresponsabilidad', integration: 'Balance con Géminis: atención al detalle', sacredGeometry: 'Tetraedro (Fuego)', geometryPurpose: 'Expansión consciente enraizada', frequency: 852 },
  'Capricornio': { chakra: 'Raíz', color: '#2F4F4F', gradient: 'from-gray-700 to-slate-900', icon: '♑', shadow: 'Rigidez, frialdad emocional', integration: 'Balance con Cáncer: calidez y empatía', sacredGeometry: 'Cubo (Tierra)', geometryPurpose: 'Estructura con corazón abierto', frequency: 396 },
  'Acuario': { chakra: 'Corona', color: '#00CED1', gradient: 'from-cyan-400 to-blue-600', icon: '♒', shadow: 'Desapego extremo, rebeldía sin causa', integration: 'Balance con Leo: calor humano y corazón', sacredGeometry: 'Octaedro (Aire)', geometryPurpose: 'Visión innovadora humanizada', frequency: 852 },
  'Piscis': { chakra: 'Corona', color: '#7FFFD4', gradient: 'from-teal-400 to-blue-500', icon: '♓', shadow: 'Confusión, evasión de la realidad', integration: 'Balance con Virgo: discernimiento y orden', sacredGeometry: 'Icosaedro (Agua)', geometryPurpose: 'Compasión universal con límites claros', frequency: 963 }
};

/**
 * Detecta polarizaciones planetarias
 */
function detectPlanetaryPolarizations(chart: NatalChart): DetectedPolarization[] {
  const polarizations: DetectedPolarization[] = [];
  
  // Contar aspectos tensos por planeta
  const aspectCount: Record<string, { count: number; aspects: string[]; partners: Set<string> }> = {};
  
  chart.aspects?.forEach(aspect => {
    const isHard = HARD_ASPECTS.some(ha => 
      aspect.type.toLowerCase().includes(ha.toLowerCase())
    );
    
    if (isHard) {
      [aspect.planet1, aspect.planet2].forEach(planet => {
        if (!aspectCount[planet]) {
          aspectCount[planet] = { count: 0, aspects: [], partners: new Set() };
        }
        aspectCount[planet].count++;
        aspectCount[planet].aspects.push(`${aspect.type} con ${planet === aspect.planet1 ? aspect.planet2 : aspect.planet1}`);
        aspectCount[planet].partners.add(planet === aspect.planet1 ? aspect.planet2 : aspect.planet1);
      });
    }
  });

  // Detectar planetas polarizados (3+ aspectos tensos)
  Object.entries(aspectCount).forEach(([planet, data]) => {
    if (data.count >= 3 && TRANSPERSONAL_PLANETS[planet as keyof typeof TRANSPERSONAL_PLANETS]) {
      const info = TRANSPERSONAL_PLANETS[planet as keyof typeof TRANSPERSONAL_PLANETS];
      const planetData = chart.planets.find(p => p.name === planet);
      
      const intensity = Math.min(100, (data.count / 6) * 100); // 6+ aspectos = 100%
      
      polarizations.push({
        type: 'planet',
        subject: planet,
        intensity,
        reasons: [
          `${data.count} aspectos tensos detectados`,
          ...data.aspects.slice(0, 3),
          `Conecta con: ${Array.from(data.partners).join(', ')}`
        ],
        affectedHouses: planetData ? [planetData.house] : [],
        involvedPlanets: Array.from(data.partners),
        integrationKey: info.integration,
        chakra: info.chakra,
        color: info.color,
        gradient: info.gradient,
        icon: info.icon,
        shadow: info.shadow,
        integration: info.integration,
        sacredGeometry: info.sacredGeometry,
        geometryPurpose: info.geometryPurpose,
        frequency: info.frequency
      });
    }
  });

  return polarizations;
}

/**
 * Detecta polarizaciones por signo (stellium)
 */
function detectSignPolarizations(chart: NatalChart): DetectedPolarization[] {
  const polarizations: DetectedPolarization[] = [];
  
  // Contar planetas por signo
  const signCount: Record<string, { count: number; planets: string[] }> = {};
  
  chart.planets.forEach(planet => {
    if (!signCount[planet.sign]) {
      signCount[planet.sign] = { count: 0, planets: [] };
    }
    signCount[planet.sign].count++;
    signCount[planet.sign].planets.push(planet.name);
  });

  // Detectar stelliums (4+ planetas en un signo)
  Object.entries(signCount).forEach(([sign, data]) => {
    if (data.count >= 4 && SIGNS_INFO[sign]) {
      const info = SIGNS_INFO[sign];
      const intensity = Math.min(100, ((data.count - 3) / 4) * 100); // 4 = 25%, 7+ = 100%
      
      // Encontrar casas afectadas
      const affectedHouses = chart.planets
        .filter(p => p.sign === sign)
        .map(p => p.house);
      
      polarizations.push({
        type: 'sign',
        subject: sign,
        intensity,
        reasons: [
          `${data.count} planetas concentrados en ${sign}`,
          `Planetas: ${data.planets.join(', ')}`,
          `Casas afectadas: ${[...new Set(affectedHouses)].join(', ')}`
        ],
        affectedHouses: [...new Set(affectedHouses)],
        involvedPlanets: data.planets,
        integrationKey: info.integration,
        chakra: info.chakra,
        color: info.color,
        gradient: info.gradient,
        icon: info.icon,
        shadow: info.shadow,
        integration: info.integration,
        sacredGeometry: info.sacredGeometry,
        geometryPurpose: info.geometryPurpose,
        frequency: info.frequency
      });
    }
  });

  return polarizations;
}

/**
 * Detecta polarizaciones por elemento
 */
function detectElementPolarizations(chart: NatalChart): DetectedPolarization[] {
  const polarizations: DetectedPolarization[] = [];
  
  // Contar planetas por elemento
  const elementCount: Record<string, { count: number; planets: string[]; signs: Set<string> }> = {
    'Fuego': { count: 0, planets: [], signs: new Set() },
    'Tierra': { count: 0, planets: [], signs: new Set() },
    'Aire': { count: 0, planets: [], signs: new Set() },
    'Agua': { count: 0, planets: [], signs: new Set() }
  };
  
  chart.planets.forEach(planet => {
    Object.entries(ELEMENTS_INFO).forEach(([element, info]) => {
      if (info.signs.includes(planet.sign)) {
        elementCount[element].count++;
        elementCount[element].planets.push(planet.name);
        elementCount[element].signs.add(planet.sign);
      }
    });
  });

  // Detectar polarización por elemento (6+ planetas)
  Object.entries(elementCount).forEach(([element, data]) => {
    if (data.count >= 6) {
      const info = ELEMENTS_INFO[element as keyof typeof ELEMENTS_INFO];
      const intensity = Math.min(100, ((data.count - 5) / 4) * 100); // 6 = 25%, 9+ = 100%
      
      polarizations.push({
        type: 'element',
        subject: element,
        intensity,
        reasons: [
          `${data.count} planetas en elemento ${element}`,
          `Signos: ${Array.from(data.signs).join(', ')}`,
          `Planetas: ${data.planets.slice(0, 5).join(', ')}${data.planets.length > 5 ? '...' : ''}`
        ],
        affectedHouses: [],
        involvedPlanets: data.planets,
        integrationKey: info.integration,
        chakra: info.chakra,
        color: info.color,
        gradient: info.gradient,
        icon: info.icon,
        shadow: info.shadow,
        integration: info.integration,
        sacredGeometry: info.sacredGeometry,
        geometryPurpose: info.geometryPurpose,
        frequency: info.frequency
      });
    }
  });

  return polarizations;
}

/**
 * Detecta polarizaciones por modalidad
 */
function detectModalityPolarizations(chart: NatalChart): DetectedPolarization[] {
  const polarizations: DetectedPolarization[] = [];
  
  // Contar planetas por modalidad
  const modalityCount: Record<string, { count: number; planets: string[]; signs: Set<string> }> = {
    'Cardinal': { count: 0, planets: [], signs: new Set() },
    'Fijo': { count: 0, planets: [], signs: new Set() },
    'Mutable': { count: 0, planets: [], signs: new Set() }
  };
  
  chart.planets.forEach(planet => {
    Object.entries(MODALITIES_INFO).forEach(([modality, info]) => {
      if (info.signs.includes(planet.sign)) {
        modalityCount[modality].count++;
        modalityCount[modality].planets.push(planet.name);
        modalityCount[modality].signs.add(planet.sign);
      }
    });
  });

  // Detectar polarización por modalidad (5+ planetas)
  Object.entries(modalityCount).forEach(([modality, data]) => {
    if (data.count >= 5) {
      const info = MODALITIES_INFO[modality as keyof typeof MODALITIES_INFO];
      const intensity = Math.min(100, ((data.count - 4) / 4) * 100); // 5 = 25%, 8+ = 100%
      
      polarizations.push({
        type: 'modality',
        subject: modality,
        intensity,
        reasons: [
          `${data.count} planetas en modalidad ${modality}`,
          `Signos: ${Array.from(data.signs).join(', ')}`,
          `Planetas: ${data.planets.slice(0, 5).join(', ')}${data.planets.length > 5 ? '...' : ''}`
        ],
        affectedHouses: [],
        involvedPlanets: data.planets,
        integrationKey: info.integration,
        chakra: info.chakra,
        color: info.color,
        gradient: info.gradient,
        icon: info.icon,
        shadow: info.shadow,
        integration: info.integration,
        sacredGeometry: info.sacredGeometry,
        geometryPurpose: info.geometryPurpose,
        frequency: info.frequency
      });
    }
  });

  return polarizations;
}

/**
 * Función principal: detecta todas las polarizaciones en una carta natal
 */
export function detectPolarizations(chart: NatalChart): DetectedPolarization[] {
  const allPolarizations = [
    ...detectPlanetaryPolarizations(chart),
    ...detectSignPolarizations(chart),
    ...detectElementPolarizations(chart),
    ...detectModalityPolarizations(chart)
  ];
  
  // Ordenar por intensidad (descendente)
  return allPolarizations.sort((a, b) => b.intensity - a.intensity);
}
