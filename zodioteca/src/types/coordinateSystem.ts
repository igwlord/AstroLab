/**
 * Sistemas de Coordenadas Celestes
 * Marco astronómico que define cómo localizamos los cuerpos celestes en el espacio
 */

export interface CoordinateSystem {
  id: string;
  name: string;
  symbol: string;
  color: string;
  gradient: string;
  base: string;
  coordinates: string;
  referencePlane: string;
  technicalDescription: string;
  astrologicalUse: string;
  philosophicalVision: string;
  keyPoints: string[];
}

export const COORDINATE_SYSTEMS: CoordinateSystem[] = [
  {
    id: 'ecliptic',
    name: 'Sistema Eclíptico',
    symbol: '☀️',
    color: '#FFD700',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    base: 'La órbita de la Tierra alrededor del Sol',
    coordinates: 'Longitud y Latitud Eclípticas',
    referencePlane: 'La Eclíptica —el plano de la órbita terrestre— que representa el camino aparente del Sol a lo largo del año.',
    technicalDescription: `En este sistema, la posición de todos los astros se mide con respecto al plano de la **Eclíptica**, que está inclinado unos 23°27' respecto del ecuador terrestre.

La **longitud eclíptica** (λ) se mide a lo largo del círculo de la Eclíptica desde el punto 0° de Aries (intersección con el ecuador celeste en el equinoccio de marzo).

La **latitud eclíptica** (β) se mide perpendicularmente a ese plano, hacia el norte o sur de la Eclíptica.`,
    astrologicalUse: `* Es el **sistema fundamental** del zodíaco tropical, ya que define los 12 signos a partir del movimiento aparente del Sol sobre la Eclíptica.
* Todas las posiciones planetarias que aparecen en una carta natal (grados de Aries, Tauro, Géminis, etc.) derivan de coordenadas eclípticas.
* Permite construir la rueda zodiacal y los aspectos según los 360° de longitud eclíptica.`,
    philosophicalVision: `Representa la **conciencia solar**: la mirada desde la Tierra hacia el Sol y su recorrido anual.

El sistema eclíptico simboliza el **ritmo cíclico del alma humana** en correspondencia con las estaciones y los arquetipos zodiacales.

Es el marco del **tiempo evolutivo** y del orden cósmico que da origen a la astrología tropical.`,
    keyPoints: [
      'Sistema fundamental del zodíaco tropical',
      'Basado en la órbita terrestre alrededor del Sol',
      'Define los 12 signos zodiacales',
      'Coordenadas: Longitud y Latitud Eclípticas',
      'Plano de referencia inclinado 23°27\' respecto al ecuador terrestre',
      'Punto de origen: 0° de Aries (equinoccio de marzo)',
      'Simboliza la conciencia solar y el tiempo evolutivo'
    ]
  },
  {
    id: 'equatorial',
    name: 'Sistema Ecuatorial',
    symbol: '🌍',
    color: '#4169E1',
    gradient: 'from-blue-600 via-cyan-500 to-green-400',
    base: 'El ecuador celeste (proyección del ecuador terrestre en la bóveda celeste)',
    coordinates: 'Ascensión Recta (AR) y Declinación (Dec)',
    referencePlane: 'El plano ecuatorial terrestre extendido al espacio.',
    technicalDescription: `El sistema ecuatorial se basa en el **movimiento de rotación de la Tierra** sobre su eje.

La **Ascensión Recta (AR)** equivale a la longitud celeste, medida en horas, minutos y segundos a lo largo del ecuador celeste desde el punto vernal (0° Aries).

La **Declinación (Dec)** mide el ángulo norte o sur respecto del ecuador celeste.`,
    astrologicalUse: `* Es el sistema que emplean los telescopios y observatorios para localizar estrellas y planetas en el cielo real.
* En astrología, se usa para calcular el **Medio Cielo (MC)** y el **Ascendente (ASC)**, ya que define la relación entre el cielo y el horizonte del lugar.
* Permite el paso entre coordenadas eclípticas y horizontales mediante transformaciones trigonométricas (ángulo horario, oblicuidad de la eclíptica, etc.).`,
    philosophicalVision: `El sistema ecuatorial representa la **perspectiva universal de la Tierra como ser cósmico**.

El eje del ecuador simboliza la **rotación de la conciencia**, el equilibrio entre norte y sur, día y noche, mente y materia.

Es un sistema que expresa la **relación dinámica entre lo terrestre y lo celeste**, el puente entre lo humano y lo sideral.`,
    keyPoints: [
      'Basado en la rotación de la Tierra',
      'Coordenadas: Ascensión Recta y Declinación',
      'Sistema astronómico estándar para observación',
      'Permite calcular Medio Cielo y Ascendente',
      'Puente entre coordenadas eclípticas y horizontales',
      'Simboliza el equilibrio día/noche y la rotación de la conciencia',
      'Expresa la relación dinámica entre Tierra y cosmos'
    ]
  },
  {
    id: 'horizontal',
    name: 'Sistema Horizontal (o Local del Observador)',
    symbol: '🧭',
    color: '#8B4513',
    gradient: 'from-amber-600 via-orange-700 to-red-900',
    base: 'El horizonte del observador en la Tierra',
    coordinates: 'Altitud (altura sobre el horizonte) y Azimut (dirección cardinal)',
    referencePlane: 'El plano horizontal tangente a la Tierra en el punto del observador.',
    technicalDescription: `El sistema horizontal es **el más personal y efímero** de todos. Su origen es el lugar y momento exactos del observador.

* La **Altitud** mide cuántos grados sobre (positivo) o bajo (negativo) el horizonte se encuentra el astro.
* El **Azimut** indica la dirección cardinal, medida desde el norte hacia el este (0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste).`,
    astrologicalUse: `* Determina la **posición instantánea de los planetas en el cielo visible**: si están ascendiendo, culminando o poniéndose.
* Es fundamental para calcular el **Ascendente**, **Descendente**, **Medio Cielo** y **Fondo del Cielo**, que dependen del horizonte y meridiano del lugar.
* Su valor cambia constantemente con la rotación de la Tierra; una variación de minutos altera por completo las casas.`,
    philosophicalVision: `El sistema horizontal representa la **conciencia encarnada del observador**.

Es el cielo *vivido*, el punto donde el cosmos se experimenta como aquí y ahora.

En astrología, simboliza la **encarnación individual**, el alma que observa el cielo desde un punto específico del tiempo y del espacio.

Así, cada carta natal es una fotografía del cielo desde un lugar de la Tierra —una experiencia **local y subjetiva del infinito**.`,
    keyPoints: [
      'Sistema personal y efímero del observador',
      'Coordenadas: Altitud y Azimut',
      'Determina posición visible de los astros',
      'Base para calcular Ascendente y casas',
      'Cambia constantemente con la rotación terrestre',
      'Simboliza la conciencia encarnada',
      'Representa el aquí y ahora del observador',
      'Experiencia local y subjetiva del cosmos'
    ]
  }
];

// Comparación conceptual de los tres sistemas
export const SYSTEMS_COMPARISON = {
  headers: ['Sistema', 'Base física', 'Uso principal', 'Naturaleza simbólica'],
  rows: [
    {
      system: 'Eclíptico ☀️',
      base: 'Órbita terrestre alrededor del Sol',
      use: 'Define signos y posiciones zodiacales',
      symbolic: 'Conciencia solar, ciclo vital, orden cósmico'
    },
    {
      system: 'Ecuatorial 🌍',
      base: 'Rotación terrestre (ecuador celeste)',
      use: 'Cálculo de casas, MC y ASC',
      symbolic: 'Equilibrio Tierra-Cielo, estructura del tiempo diario'
    },
    {
      system: 'Horizontal 🧭',
      base: 'Horizonte local del observador',
      use: 'Determina el punto de vista individual',
      symbolic: 'Encarnación, percepción inmediata, experiencia personal'
    }
  ]
};

export const COORDINATE_SYSTEMS_INTRO = `En astrología, todo cálculo parte de un sistema de referencia: una forma de "mapear" el cielo desde un punto de vista definido.

Así como en la Tierra usamos latitud y longitud, en el cielo existen distintos sistemas que determinan **cómo medir las posiciones planetarias** según el fenómeno que tomemos como base: la órbita de la Tierra, su rotación o la mirada del observador.`;
