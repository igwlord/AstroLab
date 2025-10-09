export interface Exercise {
  title: string;
  goal: string;
  steps: string[];
  mantra?: string;
}

export interface HolisticSignData {
  sign: string;
  element: string;
  modality: string;
  geometry: string;
  frequency: string;
  exercises: Exercise[];
  crystals: string[];
  aromas: string[];
  color: string;
}

export const HOLISTIC_EXERCISES: Record<string, HolisticSignData> = {
  'Aries': {
    sign: 'Aries',
    element: 'Fuego',
    modality: 'Cardinal',
    geometry: 'Tetraedro',
    frequency: '432 Hz',
    exercises: [
      {
        title: 'Activación solar',
        goal: 'Encender la voluntad y la acción inspirada',
        steps: [
          'Al amanecer, colócate frente al sol con las palmas abiertas',
          'Inhalá luz dorada hacia el plexo solar',
          'Exhalá cualquier duda o miedo a actuar'
        ],
        mantra: 'Yo soy acción consciente y creadora'
      },
      {
        title: 'Ritmo del fuego interno',
        goal: 'Canalizar energía sin impulsividad',
        steps: [
          'Respirá en 3 tiempos y exhalá en 6',
          'Visualizá una llama azul estable en tu abdomen'
        ]
      },
      {
        title: 'Movimiento consciente',
        goal: 'Descargar exceso de energía',
        steps: [
          'Realizá ejercicios de fuerza o danza tribal',
          'Agradecé tu vitalidad al finalizar'
        ]
      }
    ],
    crystals: ['granate', 'cornalina', 'jaspe rojo'],
    aromas: ['canela', 'clavo', 'jengibre'],
    color: '#FF3B1F'
  },
  'Tauro': {
    sign: 'Tauro',
    element: 'Tierra',
    modality: 'Fijo',
    geometry: 'Cubo',
    frequency: '396 Hz',
    exercises: [
      {
        title: 'Enraizamiento sensorial',
        goal: 'Reconectar con el cuerpo y la estabilidad',
        steps: [
          'Caminá descalzo sobre tierra o piso natural',
          'Sentí el contacto y respirá profundo',
          'Inhalá energía verde-dorada desde la tierra',
          'Exhalá tensión, ansiedad o prisa'
        ],
        mantra: 'Estoy presente, seguro y sostenido por la Tierra'
      },
      {
        title: 'Ritual de abundancia consciente',
        goal: 'Expandir seguridad y gratitud',
        steps: [
          'Encendé una vela verde o dorada',
          'Escribí tres cosas simples que te generen placer',
          'Agradecé en voz alta y colocá la nota bajo una planta',
          'Dejá que la vela se consuma visualizando prosperidad'
        ]
      },
      {
        title: 'Fijeza flexible',
        goal: 'Liberar rigidez mental sin perder foco',
        steps: [
          'Sentate con la espalda recta y manos sobre el abdomen',
          'Inhalá contando 4 segundos, exhalá 6 segundos',
          'Repetí 10 veces visualizando tu cuerpo como una montaña que respira',
          'Cada exhalación disuelve la necesidad de control'
        ]
      }
    ],
    crystals: ['aventurina verde', 'cuarzo ahumado', 'jade'],
    aromas: ['pachuli', 'vetiver', 'sándalo'],
    color: '#7B5E3B'
  },
  'Géminis': {
    sign: 'Géminis',
    element: 'Aire',
    modality: 'Mutable',
    geometry: 'Octaedro',
    frequency: '741 Hz',
    exercises: [
      {
        title: 'Respiración de claridad mental',
        goal: 'Equilibrar mente y comunicación',
        steps: [
          'Inhalá por la nariz en 4 tiempos',
          'Retenés 2 segundos y exhalá por la boca',
          'Repetí visualizando aire azul celeste rodeando tu cabeza'
        ]
      },
      {
        title: 'Escritura intuitiva',
        goal: 'Canalizar pensamientos dispersos',
        steps: [
          'Escribí 3 páginas sin censura',
          'Subrayá una frase que te resuene como mensaje interno'
        ]
      },
      {
        title: 'Silencio consciente',
        goal: 'Reducir ruido mental',
        steps: [
          '10 minutos en quietud observando la respiración',
          'Notá los pensamientos como nubes pasajeras'
        ]
      }
    ],
    crystals: ['ágata azul', 'celestina', 'cuarzo claro'],
    aromas: ['menta', 'eucalipto', 'lavanda'],
    color: '#74C1FF'
  },
  'Cáncer': {
    sign: 'Cáncer',
    element: 'Agua',
    modality: 'Cardinal',
    geometry: 'Icosaedro',
    frequency: '528 Hz',
    exercises: [
      {
        title: 'Baño lunar',
        goal: 'Liberar emociones retenidas',
        steps: [
          'Llenar una bañera o recipiente con agua y sal marina',
          'Visualizar que el agua absorbe tu carga emocional'
        ]
      },
      {
        title: 'Respiración del corazón',
        goal: 'Expandir empatía y ternura',
        steps: [
          'Colocá una mano en el pecho',
          'Inhalá luz rosada y exhalá compasión'
        ]
      },
      {
        title: 'Santuario interno',
        goal: 'Nutrir tu niño interior',
        steps: [
          'Meditá visualizando una casa cálida dentro de tu corazón',
          'Habitá ese espacio cada día por 3 minutos'
        ]
      }
    ],
    crystals: ['piedra luna', 'cuarzo rosa', 'sodalita'],
    aromas: ['jazmín', 'rosa', 'manzanilla'],
    color: '#88BFFF'
  },
  'Leo': {
    sign: 'Leo',
    element: 'Fuego',
    modality: 'Fijo',
    geometry: 'Tetraedro estrellado (Merkaba)',
    frequency: '639 Hz',
    exercises: [
      {
        title: 'Respiración solar',
        goal: 'Activar confianza y magnetismo',
        steps: [
          'Inhalá por la nariz luz dorada al plexo',
          'Exhalá irradiando esa luz hacia el entorno'
        ]
      },
      {
        title: 'Ritual del espejo',
        goal: 'Reforzar autoestima auténtica',
        steps: [
          'Mírate al espejo y agradecé tres cualidades reales',
          'Sonreí a tu reflejo con sinceridad'
        ]
      },
      {
        title: 'Movimiento expresivo',
        goal: 'Abrir el chakra del corazón a través del cuerpo',
        steps: [
          'Bailá con música alegre 5 minutos',
          'Dejá que tu cuerpo hable sin juicio'
        ]
      }
    ],
    crystals: ['ojo de tigre', 'citrino', 'ámbar'],
    aromas: ['naranja dulce', 'canela', 'incienso'],
    color: '#FFA31A'
  },
  'Virgo': {
    sign: 'Virgo',
    element: 'Tierra',
    modality: 'Mutable',
    geometry: 'Flor de la Vida (matriz)',
    frequency: '528 Hz',
    exercises: [
      {
        title: 'Purificación corporal',
        goal: 'Depurar energía y mente',
        steps: [
          'Prepará una infusión de hierbas',
          'Respirá los vapores y liberá pensamientos'
        ]
      },
      {
        title: 'Orden consciente',
        goal: 'Transformar orden en ritual sagrado',
        steps: [
          'Organizá tu espacio en silencio',
          'Intencioná cada objeto con propósito'
        ]
      },
      {
        title: 'Servicio con propósito',
        goal: 'Canalizar energía en ayuda práctica',
        steps: [
          'Realizá una acción solidaria',
          'Observá la sensación interna al dar'
        ]
      }
    ],
    crystals: ['amatista', 'jaspe amarillo', 'fluorita'],
    aromas: ['romero', 'limón', 'lavanda'],
    color: '#B8CC7A'
  },
  'Libra': {
    sign: 'Libra',
    element: 'Aire',
    modality: 'Cardinal',
    geometry: 'Octaedro (equilibrio)',
    frequency: '741 Hz',
    exercises: [
      {
        title: 'Meditación del equilibrio',
        goal: 'Armonizar polaridades internas',
        steps: [
          'Visualizá dos columnas de luz rosa y azul equilibrándose en tu corazón'
        ]
      },
      {
        title: 'Arte contemplativo',
        goal: 'Conectar con la belleza como vía espiritual',
        steps: [
          'Pintá o fotografiá algo que simbolice armonía'
        ]
      },
      {
        title: 'Escucha activa',
        goal: 'Practicar presencia en vínculos',
        steps: [
          'Durante una conversación, escuchá sin interrumpir ni juzgar'
        ]
      }
    ],
    crystals: ['cuarzo rosa', 'aventurina verde', 'lapislázuli'],
    aromas: ['rosa', 'ylang ylang', 'bergamota'],
    color: '#D6A3FF'
  },
  'Escorpio': {
    sign: 'Escorpio',
    element: 'Agua',
    modality: 'Fijo',
    geometry: 'Dodecaedro',
    frequency: '432 Hz',
    exercises: [
      {
        title: 'Respiración de transmutación',
        goal: 'Transformar emociones intensas',
        steps: [
          'Visualizá luz violeta desde el sacro ascendiendo a la coronilla'
        ]
      },
      {
        title: 'Escritura de sombra',
        goal: 'Liberar energía reprimida',
        steps: [
          'Escribí sin filtro lo que callás',
          'Quemá el papel agradeciendo su liberación'
        ]
      },
      {
        title: 'Baño de renacimiento',
        goal: 'Reiniciar el campo energético',
        steps: [
          'Agua con sal y pétalos oscuros',
          'Visualizá la muerte simbólica del ego'
        ]
      }
    ],
    crystals: ['obsidiana', 'granate', 'turmalina negra'],
    aromas: ['mirra', 'patchuli', 'sándalo'],
    color: '#7D3F98'
  },
  'Sagitario': {
    sign: 'Sagitario',
    element: 'Fuego',
    modality: 'Mutable',
    geometry: 'Tetraedro',
    frequency: '639 Hz',
    exercises: [
      {
        title: 'Visualización del horizonte',
        goal: 'Expandir visión y propósito',
        steps: [
          'Cerrá los ojos y visualizá un horizonte infinito',
          'Inhalá libertad, exhalá limitaciones'
        ]
      },
      {
        title: 'Meditación caminando',
        goal: 'Conectar movimiento con intuición',
        steps: [
          'Caminá conscientemente, observando cada paso'
        ]
      },
      {
        title: 'Lectura inspiradora',
        goal: 'Elevar el conocimiento a sabiduría',
        steps: [
          'Leé un texto filosófico o espiritual 10 min diarios'
        ]
      }
    ],
    crystals: ['amatista', 'sodalita', 'topacio'],
    aromas: ['incienso', 'pino', 'salvia'],
    color: '#FF6C1A'
  },
  'Capricornio': {
    sign: 'Capricornio',
    element: 'Tierra',
    modality: 'Cardinal',
    geometry: 'Cubo',
    frequency: '396 Hz',
    exercises: [
      {
        title: 'Respiración de estructura',
        goal: 'Consolidar propósito y foco',
        steps: [
          'Visualizá una columna vertebral de luz dorada que te sostiene'
        ]
      },
      {
        title: 'Planificación sagrada',
        goal: 'Convertir la disciplina en arte espiritual',
        steps: [
          'Escribí tres metas diarias y ofrecelas al universo'
        ]
      },
      {
        title: 'Silencio de montaña',
        goal: 'Activar sabiduría interior',
        steps: [
          'Meditá sentado, visualizando una montaña dentro de ti'
        ]
      }
    ],
    crystals: ['hematite', 'ónix', 'cuarzo ahumado'],
    aromas: ['cedro', 'vetiver', 'mirra'],
    color: '#564C3B'
  },
  'Acuario': {
    sign: 'Acuario',
    element: 'Aire',
    modality: 'Fijo',
    geometry: 'Octaedro (mental superior)',
    frequency: '852 Hz',
    exercises: [
      {
        title: 'Respiración eléctrica',
        goal: 'Activar claridad mental e intuición tecnológica',
        steps: [
          'Visualizá descargas de luz azul recorriendo tu cuerpo'
        ]
      },
      {
        title: 'Meditación con sonido',
        goal: 'Sincronizar mente con frecuencias elevadas',
        steps: [
          'Usá sonido binaural 852 Hz y visualizá patrones geométricos'
        ]
      },
      {
        title: 'Servicio comunitario',
        goal: 'Canalizar innovación en beneficio colectivo',
        steps: [
          'Ofrecé una idea o ayuda concreta en tu comunidad'
        ]
      }
    ],
    crystals: ['aguamarina', 'lapislázuli', 'amatista'],
    aromas: ['menta', 'eucalipto', 'incienso'],
    color: '#82D1FF'
  },
  'Piscis': {
    sign: 'Piscis',
    element: 'Agua',
    modality: 'Mutable',
    geometry: 'Icosaedro',
    frequency: '528 Hz',
    exercises: [
      {
        title: 'Respiración oceánica',
        goal: 'Unir cuerpo y espíritu',
        steps: [
          'Inhalá como una ola que sube',
          'Exhalá como el mar que se retira'
        ]
      },
      {
        title: 'Meditación del perdón',
        goal: 'Disolver viejos dolores',
        steps: [
          'Repetí: "Te perdono, me perdono, libero y sano"'
        ]
      },
      {
        title: 'Baño de sonido',
        goal: 'Elevar vibración mediante música y agua',
        steps: [
          'Sumergí tus manos en agua mientras escuchás cantos armónicos'
        ]
      }
    ],
    crystals: ['aguamarina', 'amatista', 'cuarzo rosa'],
    aromas: ['mirra', 'ylang ylang', 'jazmín'],
    color: '#A4C6FF'
  }
};
