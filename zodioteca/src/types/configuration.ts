export interface Configuration {
  name: string;
  symbol: string;
  description: string;
  manifestation: string;
  shadows: string;
  color: string;
  chakra: string;
  frequency: number | string;
  exercise: string;
}

export const CONFIGURATIONS: Configuration[] = [
  {
    name: 'Stellium',
    symbol: '🌟',
    description: 'Un Stellium ocurre cuando tres o más planetas se encuentran en el mismo signo o casa. Genera una concentración intensa de energía en un área específica de la vida. Esa zona se convierte en un "foco vital" para la persona.',
    manifestation: 'Persona que concentra su vida en un ámbito: ejemplo, Stellium en Casa X → toda la vida gira en torno a la profesión.',
    shadows: 'Obsesión, falta de balance, dificultad para distribuir energía en otras áreas.',
    color: 'Dorado brillante',
    chakra: 'Plexo Solar',
    frequency: 528,
    exercise: 'Realizar un "mapa de balance" escribiendo las áreas de vida descuidadas y dar un paso consciente hacia el equilibrio.'
  },
  {
    name: 'Gran Trígono',
    symbol: '🔺',
    description: 'Tres planetas forman un triángulo equilátero de 120°. Representa fluidez, talentos naturales y facilidad en la vida. Da estabilidad y armonía en el elemento implicado (fuego, tierra, aire o agua).',
    manifestation: 'Persona con facilidad innata en un área (ej: Gran Trígono en agua → sensibilidad emocional y empatía).',
    shadows: 'Exceso de comodidad, falta de esfuerzo para crecer.',
    color: 'Verde esmeralda',
    chakra: 'Corazón',
    frequency: 528,
    exercise: 'Agradecer cada día tres talentos naturales y usarlos conscientemente para ayudar a otros.'
  },
  {
    name: 'T-Cuadrada (T-Square)',
    symbol: '⛓️',
    description: 'Dos planetas en oposición (180°) ambos en cuadratura (90°) a un tercero. Es una figura de tensión que impulsa al crecimiento. El planeta focal (el que recibe las dos cuadraturas) muestra el área de mayor desafío.',
    manifestation: 'Persona con tensión constante que la obliga a buscar soluciones. Ejemplo: T-cuadrada con Marte focal → vida llena de desafíos de acción y autocontrol.',
    shadows: 'Frustración, sensación de bloqueo, conflictos externos.',
    color: 'Rojo intenso',
    chakra: 'Raíz',
    frequency: 396,
    exercise: 'Hacer ejercicio físico liberador + respiración consciente enfocada en transformar la tensión en acción creativa.'
  },
  {
    name: 'Cruz Cósmica (Gran Cuadratura)',
    symbol: '✝️',
    description: 'Cuatro planetas en cuadratura formando una cruz perfecta (dos oposiciones cruzadas y cuatro cuadraturas). Representa máxima tensión y necesidad de integrar fuerzas opuestas. Da carácter fuerte y vida llena de pruebas.',
    manifestation: 'Sensación de que la vida siempre exige esfuerzo. Persona resiliente, con capacidad de superar dificultades.',
    shadows: 'Agotamiento, lucha constante, rigidez.',
    color: 'Negro con destellos rojos',
    chakra: 'Raíz y Corazón',
    frequency: '396 / 639',
    exercise: 'Práctica de yoga o tai chi para integrar cuerpo y mente, transformando tensión en flexibilidad.'
  },
  {
    name: 'Yod (El Dedo de Dios)',
    symbol: '☝️',
    description: 'Configuración formada por dos quincuncios (150°) y un sextil (60°). Apunta hacia un planeta focal, considerado un "punto de destino kármico". Representa ajustes, aprendizajes y un camino particular de evolución.',
    manifestation: 'Persona que siente un destino especial, experiencias que la empujan hacia un propósito oculto.',
    shadows: 'Sensación de incomodidad constante, de "no encajar".',
    color: 'Violeta',
    chakra: 'Corona',
    frequency: 963,
    exercise: 'Meditación visualizando un triángulo de luz que converge en un punto, pidiendo claridad sobre la misión personal.'
  },
  {
    name: 'Cometa (Figura de la Cometa)',
    symbol: '🌠',
    description: 'Tres planetas forman un Gran Trígono, y un cuarto planeta se conecta en sextil con dos de ellos, creando una figura similar a una cometa. Representa dirección, canalización de talentos hacia un objetivo.',
    manifestation: 'Persona que logra enfocar sus dones naturales en un área concreta. Ejemplo: Cometa con Saturno focal → estructura profesional firme a partir de talentos innatos.',
    shadows: 'Exceso de confianza, autoindulgencia.',
    color: 'Azul turquesa',
    chakra: 'Garganta',
    frequency: 741,
    exercise: 'Visualizar un triángulo de luz estable y una "cola de cometa" dirigiendo la energía hacia una meta clara.'
  },
  {
    name: 'Kite (Cometa Alado)',
    symbol: '🪁',
    description: 'Es una Cometa potenciada porque al Gran Trígono se le suma una oposición al planeta focal. Representa gran potencial con desafíos externos que impulsan al uso consciente de talentos.',
    manifestation: 'Persona con grandes dones que deben ser encauzados con disciplina.',
    shadows: 'Pereza, no aprovechar oportunidades.',
    color: 'Dorado con violeta',
    chakra: 'Plexo Solar + Corona',
    frequency: '528 / 963',
    exercise: 'Escribir un objetivo concreto y luego diseñar tres acciones prácticas para usar los propios talentos en lograrlo.'
  }
];
