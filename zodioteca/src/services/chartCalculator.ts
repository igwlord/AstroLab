import * as Astronomy from 'astronomy-engine';

// Tipos para la carta natal
export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  retrograde: boolean;
  house: number;
  longitude: number;
}

export interface HousePosition {
  number: number;
  sign: string;
  degree: number;
  cusp: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  applying: boolean;
}

export interface NatalChart {
  date: Date;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  aspects: Aspect[];
}

// Signos del zodiaco
const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

// Planetas a calcular
const PLANETS = [
  { name: 'Sol', body: Astronomy.Body.Sun },
  { name: 'Luna', body: Astronomy.Body.Moon },
  { name: 'Mercurio', body: Astronomy.Body.Mercury },
  { name: 'Venus', body: Astronomy.Body.Venus },
  { name: 'Marte', body: Astronomy.Body.Mars },
  { name: 'Júpiter', body: Astronomy.Body.Jupiter },
  { name: 'Saturno', body: Astronomy.Body.Saturn },
  { name: 'Urano', body: Astronomy.Body.Uranus },
  { name: 'Neptuno', body: Astronomy.Body.Neptune },
  { name: 'Plutón', body: Astronomy.Body.Pluto },
];

// Aspectos astrológicos
const ASPECT_TYPES = [
  { name: 'Conjunción', angle: 0, orb: 8 },
  { name: 'Sextil', angle: 60, orb: 6 },
  { name: 'Cuadratura', angle: 90, orb: 8 },
  { name: 'Trígono', angle: 120, orb: 8 },
  { name: 'Oposición', angle: 180, orb: 8 },
];

/**
 * Convierte grados eclípticos a signo zodiacal y grados
 */
function eclipticToZodiac(longitude: number): { sign: string; degree: number } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.round(degree * 100) / 100
  };
}

/**
 * Calcula si un planeta está retrógrado
 */
function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  const dt = 0.1; // 2.4 horas
  const date1 = new Date(date.getTime() - dt * 24 * 60 * 60 * 1000);
  const date2 = new Date(date.getTime() + dt * 24 * 60 * 60 * 1000);
  
  try {
    if (body === Astronomy.Body.Moon) {
      const pos1 = Astronomy.EclipticGeoMoon(date1);
      const pos2 = Astronomy.EclipticGeoMoon(date2);
      return pos2.lon < pos1.lon;
    }
    
    const helio1 = Astronomy.GeoVector(body, date1, false);
    const helio2 = Astronomy.GeoVector(body, date2, false);
    
    const lon1 = Math.atan2(helio1.y, helio1.x) * 180 / Math.PI;
    const lon2 = Math.atan2(helio2.y, helio2.x) * 180 / Math.PI;
    
    return lon2 < lon1;
  } catch {
    return false;
  }
}

/**
 * Calcula las posiciones planetarias
 */
function calculatePlanets(date: Date): PlanetPosition[] {
  const positions: PlanetPosition[] = [];
  
  for (const planet of PLANETS) {
    try {
      let longitude: number;
      
      // La Luna necesita cálculo geocéntrico especial
      if (planet.body === Astronomy.Body.Moon) {
        const ecliptic = Astronomy.EclipticGeoMoon(date);
        longitude = ecliptic.lon;
      } else {
        // Otros planetas: vector geocéntrico
        const geoVector = Astronomy.GeoVector(planet.body, date, false);
        const ecliptic = Astronomy.Ecliptic(geoVector);
        longitude = ecliptic.elon;
      }
      
      const zodiac = eclipticToZodiac(longitude);
      const retrograde = planet.body !== Astronomy.Body.Sun && 
                        planet.body !== Astronomy.Body.Moon ? 
                        isRetrograde(planet.body, date) : false;
      
      positions.push({
        name: planet.name,
        sign: zodiac.sign,
        degree: zodiac.degree,
        retrograde,
        house: 0, // Se calculará después con las casas
        longitude
      });
    } catch (error) {
      console.warn(`Error calculando ${planet.name}:`, error);
    }
  }
  
  return positions;
}

/**
 * Calcula el Ascendente con la fórmula astronómica correcta
 * Basado en "Astronomical Algorithms" de Jean Meeus
 */
function calculateAscendant(date: Date, latitude: number, longitude: number): { sign: string; degree: number; cusp: number } {
  try {
    // Calcular el Tiempo Sidéreo de Greenwich en horas
    const gst = Astronomy.SiderealTime(date);
    
    // Calcular el Tiempo Sidéreo Local (LST)
    // LST = GST + longitud (en horas, este positivo)
    const lst = gst + (longitude / 15); // convertir longitud de grados a horas
    
    // Normalizar LST a 0-24 horas
    const lstNormalized = ((lst % 24) + 24) % 24;
    
    // Convertir a grados para RAMC (Right Ascension of the Meridian)
    const ramc = lstNormalized * 15;
    
    // Oblicuidad de la eclíptica
    const obliquity = 23.4392911; // grados
    
    // Convertir a radianes
    const e = obliquity * Math.PI / 180; // oblicuidad en radianes
    const lat = latitude * Math.PI / 180; // latitud en radianes
    const mc = ramc * Math.PI / 180; // RAMC en radianes
    
    // Fórmula correcta del Ascendente según Meeus:
    // sin(ASC) = -cos(MC) / cos(lat)
    // cos(ASC) = [sin(e) * tan(lat) - sin(MC) * cos(e)] / cos(lat)
    
    const sinAsc = -Math.cos(mc) / Math.cos(lat);
    const cosAsc = (Math.sin(e) * Math.tan(lat) - Math.sin(mc) * Math.cos(e)) / Math.cos(lat);
    
    // Calcular el ángulo usando atan2 para obtener el cuadrante correcto
    const ascRad = Math.atan2(sinAsc, cosAsc);
    
    // Convertir a grados
    let ascLon = ascRad * 180 / Math.PI;
    
    // Normalizar a 0-360
    ascLon = ((ascLon % 360) + 360) % 360;
    
    const zodiac = eclipticToZodiac(ascLon);
    
    console.log('=== ASCENDENTE DEBUG ===');
    console.log('GST (horas):', gst);
    console.log('Longitud:', longitude);
    console.log('LST (horas):', lstNormalized);
    console.log('RAMC (grados):', ramc);
    console.log('Latitud:', latitude);
    console.log('Oblicuidad:', obliquity);
    console.log('ASC longitud eclíptica:', ascLon);
    console.log('Ascendente:', `${zodiac.sign} ${zodiac.degree.toFixed(2)}°`);
    
    return {
      sign: zodiac.sign,
      degree: zodiac.degree,
      cusp: ascLon
    };
  } catch (error) {
    console.error('Error calculando ascendente:', error);
    throw error;
  }
}

/**
 * Calcula el Medio Cielo (punto más alto de la eclíptica)
 */
function calculateMidheaven(date: Date, longitude: number): { sign: string; degree: number; cusp: number } {
  const hourAngle = Astronomy.SiderealTime(date);
  const lst = hourAngle * 15; // convertir a grados
  
  // MC está a 90° del Ascendente aproximadamente
  const mcLon = (lst + longitude + 90) % 360;
  const zodiac = eclipticToZodiac(mcLon);
  
  return {
    sign: zodiac.sign,
    degree: zodiac.degree,
    cusp: mcLon
  };
}

/**
 * Calcula las casas usando el sistema Placidus (simplificado)
 */
function calculateHousesPlacidus(
  ascendant: number,
  mc: number
): HousePosition[] {
  const houses: HousePosition[] = [];
  
  // Casa 1 = Ascendente
  // Casa 10 = Medio Cielo
  // Casas intermedias se interpolan
  
  const cusps = [
    ascendant, // Casa 1
    ascendant + 30, // Casa 2 (simplificado)
    ascendant + 60, // Casa 3
    (ascendant + 180) % 360, // Casa 4 (IC - opuesto al MC)
    ascendant + 120, // Casa 5
    ascendant + 150, // Casa 6
    (ascendant + 180) % 360, // Casa 7 (Descendente)
    ascendant + 210, // Casa 8
    ascendant + 240, // Casa 9
    mc, // Casa 10
    mc + 30, // Casa 11
    mc + 60, // Casa 12
  ];
  
  cusps.forEach((cusp, index) => {
    const normalized = ((cusp % 360) + 360) % 360;
    const zodiac = eclipticToZodiac(normalized);
    houses.push({
      number: index + 1,
      sign: zodiac.sign,
      degree: zodiac.degree,
      cusp: normalized
    });
  });
  
  return houses;
}

/**
 * Calcula las casas usando el sistema de Signos Enteros
 */
function calculateHousesWholeSign(ascendant: number): HousePosition[] {
  const houses: HousePosition[] = [];
  const ascZodiac = eclipticToZodiac(ascendant);
  const startSignIndex = ZODIAC_SIGNS.indexOf(ascZodiac.sign);
  
  for (let i = 0; i < 12; i++) {
    const signIndex = (startSignIndex + i) % 12;
    const cusp = signIndex * 30;
    
    houses.push({
      number: i + 1,
      sign: ZODIAC_SIGNS[signIndex],
      degree: 0,
      cusp
    });
  }
  
  return houses;
}

/**
 * Asigna planetas a casas
 */
function assignPlanetHouses(planets: PlanetPosition[], houses: HousePosition[]): void {
  for (const planet of planets) {
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % 12];
      
      const currentCusp = currentHouse.cusp;
      const nextCusp = nextHouse.cusp;
      
      // Manejar el cruce del zodíaco (360° -> 0°)
      if (nextCusp < currentCusp) {
        if (planet.longitude >= currentCusp || planet.longitude < nextCusp) {
          planet.house = currentHouse.number;
          break;
        }
      } else {
        if (planet.longitude >= currentCusp && planet.longitude < nextCusp) {
          planet.house = currentHouse.number;
          break;
        }
      }
    }
  }
}

/**
 * Calcula aspectos entre planetas
 */
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calcular ángulo entre planetas
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;
      
      // Verificar si forma aspecto
      for (const aspectType of ASPECT_TYPES) {
        const diff = Math.abs(angle - aspectType.angle);
        
        if (diff <= aspectType.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectType.name,
            angle: Math.round(angle * 100) / 100,
            orb: Math.round(diff * 100) / 100,
            applying: planet1.longitude < planet2.longitude
          });
        }
      }
    }
  }
  
  return aspects;
}

/**
 * Calcula la carta natal completa
 */
export async function calculateNatalChart(
  birthDate: Date,
  latitude: number,
  longitude: number,
  location: string,
  timezone: string,
  houseSystem: 'Placidus' | 'WholeSign' | 'Koch' | 'Equal' = 'Placidus'
): Promise<NatalChart> {
  try {
    console.log('=== CALCULANDO CARTA NATAL ===');
    console.log('Fecha entrada:', birthDate.toISOString());
    console.log('Fecha local:', birthDate.toLocaleString('es-AR', { timeZone: timezone }));
    console.log('Coordenadas:', { latitude, longitude });
    console.log('Timezone:', timezone);
    
    // Calcular posiciones planetarias
    const planets = calculatePlanets(birthDate);
    console.log('Planetas calculados:', planets.map(p => `${p.name}: ${p.sign} ${p.degree.toFixed(2)}°`));
    
    // Calcular Ascendente y Medio Cielo
    const ascendant = calculateAscendant(birthDate, latitude, longitude);
    const midheaven = calculateMidheaven(birthDate, longitude);
    
    console.log('Ascendente:', `${ascendant.sign} ${ascendant.degree.toFixed(2)}°`);
    console.log('Medio Cielo:', `${midheaven.sign} ${midheaven.degree.toFixed(2)}°`);
    
    // Calcular casas según el sistema elegido
    let houses: HousePosition[];
    
    switch (houseSystem) {
      case 'WholeSign':
        houses = calculateHousesWholeSign(ascendant.cusp);
        break;
      case 'Placidus':
      case 'Koch':
      case 'Equal':
      default:
        houses = calculateHousesPlacidus(ascendant.cusp, midheaven.cusp);
        break;
    }
    
    // Asignar planetas a casas
    assignPlanetHouses(planets, houses);
    
    // Calcular aspectos
    const aspects = calculateAspects(planets);
    
    return {
      date: birthDate,
      location,
      latitude,
      longitude,
      timezone,
      planets,
      houses,
      ascendant,
      midheaven,
      aspects
    };
  } catch (error) {
    console.error('Error calculando carta natal:', error);
    throw new Error('No se pudo calcular la carta natal. Verifica los datos ingresados.');
  }
}

// Base de datos de ubicaciones detalladas
export interface LocationData {
  country: string;
  province: string;
  city: string;
  neighborhood?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Base de datos completa de ubicaciones
export const LOCATIONS_DB: LocationData[] = [
  // ARGENTINA - Buenos Aires
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Palermo', latitude: -34.5889, longitude: -58.4246, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Recoleta', latitude: -34.5875, longitude: -58.3974, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Belgrano', latitude: -34.5633, longitude: -58.4544, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Villa Devoto', latitude: -34.6011, longitude: -58.5118, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Caballito', latitude: -34.6186, longitude: -58.4397, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'San Telmo', latitude: -34.6211, longitude: -58.3724, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Puerto Madero', latitude: -34.6118, longitude: -58.3634, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (CABA)', city: 'Buenos Aires', neighborhood: 'Centro', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  
  // ARGENTINA - Provincia Buenos Aires
  { country: 'Argentina', province: 'Buenos Aires (Provincia)', city: 'La Plata', latitude: -34.9205, longitude: -57.9536, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (Provincia)', city: 'Mar del Plata', latitude: -38.0055, longitude: -57.5426, timezone: 'America/Argentina/Buenos_Aires' },
  { country: 'Argentina', province: 'Buenos Aires (Provincia)', city: 'Quilmes', latitude: -34.7206, longitude: -58.2635, timezone: 'America/Argentina/Buenos_Aires' },
  
  // ARGENTINA - Otras provincias
  { country: 'Argentina', province: 'Córdoba', city: 'Córdoba', latitude: -31.4201, longitude: -64.1888, timezone: 'America/Argentina/Cordoba' },
  { country: 'Argentina', province: 'Santa Fe', city: 'Rosario', latitude: -32.9442, longitude: -60.6505, timezone: 'America/Argentina/Cordoba' },
  { country: 'Argentina', province: 'Mendoza', city: 'Mendoza', latitude: -32.8895, longitude: -68.8458, timezone: 'America/Argentina/Mendoza' },
  
  // MÉXICO - Ciudad de México
  { country: 'México', province: 'Ciudad de México', city: 'CDMX', neighborhood: 'Polanco', latitude: 19.4326, longitude: -99.1982, timezone: 'America/Mexico_City' },
  { country: 'México', province: 'Ciudad de México', city: 'CDMX', neighborhood: 'Condesa', latitude: 19.4118, longitude: -99.1715, timezone: 'America/Mexico_City' },
  { country: 'México', province: 'Ciudad de México', city: 'CDMX', neighborhood: 'Roma', latitude: 19.4189, longitude: -99.1660, timezone: 'America/Mexico_City' },
  { country: 'México', province: 'Ciudad de México', city: 'CDMX', neighborhood: 'Coyoacán', latitude: 19.3467, longitude: -99.1618, timezone: 'America/Mexico_City' },
  { country: 'México', province: 'Ciudad de México', city: 'CDMX', neighborhood: 'Centro Histórico', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City' },
  
  // MÉXICO - Otros estados
  { country: 'México', province: 'Jalisco', city: 'Guadalajara', latitude: 20.6597, longitude: -103.3496, timezone: 'America/Mexico_City' },
  { country: 'México', province: 'Nuevo León', city: 'Monterrey', latitude: 25.6866, longitude: -100.3161, timezone: 'America/Monterrey' },
  
  // COLOMBIA
  { country: 'Colombia', province: 'Bogotá D.C.', city: 'Bogotá', neighborhood: 'Chapinero', latitude: 4.6533, longitude: -74.0636, timezone: 'America/Bogota' },
  { country: 'Colombia', province: 'Bogotá D.C.', city: 'Bogotá', neighborhood: 'Usaquén', latitude: 4.7007, longitude: -74.0306, timezone: 'America/Bogota' },
  { country: 'Colombia', province: 'Bogotá D.C.', city: 'Bogotá', neighborhood: 'Centro', latitude: 4.5981, longitude: -74.0758, timezone: 'America/Bogota' },
  { country: 'Colombia', province: 'Antioquia', city: 'Medellín', latitude: 6.2442, longitude: -75.5812, timezone: 'America/Bogota' },
  { country: 'Colombia', province: 'Valle del Cauca', city: 'Cali', latitude: 3.4516, longitude: -76.5320, timezone: 'America/Bogota' },
  
  // CHILE
  { country: 'Chile', province: 'Región Metropolitana', city: 'Santiago', neighborhood: 'Providencia', latitude: -33.4291, longitude: -70.6104, timezone: 'America/Santiago' },
  { country: 'Chile', province: 'Región Metropolitana', city: 'Santiago', neighborhood: 'Las Condes', latitude: -33.4091, longitude: -70.5756, timezone: 'America/Santiago' },
  { country: 'Chile', province: 'Región Metropolitana', city: 'Santiago', neighborhood: 'Centro', latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago' },
  { country: 'Chile', province: 'Valparaíso', city: 'Valparaíso', latitude: -33.0472, longitude: -71.6127, timezone: 'America/Santiago' },
  
  // PERÚ
  { country: 'Perú', province: 'Lima', city: 'Lima', neighborhood: 'Miraflores', latitude: -12.1196, longitude: -77.0365, timezone: 'America/Lima' },
  { country: 'Perú', province: 'Lima', city: 'Lima', neighborhood: 'San Isidro', latitude: -12.0935, longitude: -77.0364, timezone: 'America/Lima' },
  { country: 'Perú', province: 'Lima', city: 'Lima', neighborhood: 'Centro', latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima' },
  
  // ESPAÑA
  { country: 'España', province: 'Madrid', city: 'Madrid', neighborhood: 'Salamanca', latitude: 40.4318, longitude: -3.6793, timezone: 'Europe/Madrid' },
  { country: 'España', province: 'Madrid', city: 'Madrid', neighborhood: 'Chamberí', latitude: 40.4333, longitude: -3.7030, timezone: 'Europe/Madrid' },
  { country: 'España', province: 'Madrid', city: 'Madrid', neighborhood: 'Centro', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  { country: 'España', province: 'Cataluña', city: 'Barcelona', neighborhood: 'Eixample', latitude: 41.3888, longitude: 2.1590, timezone: 'Europe/Madrid' },
  { country: 'España', province: 'Cataluña', city: 'Barcelona', neighborhood: 'Gràcia', latitude: 41.4036, longitude: 2.1564, timezone: 'Europe/Madrid' },
  { country: 'España', province: 'Cataluña', city: 'Barcelona', neighborhood: 'Centro', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid' },
  
  // USA
  { country: 'Estados Unidos', province: 'New York', city: 'New York', neighborhood: 'Manhattan', latitude: 40.7831, longitude: -73.9712, timezone: 'America/New_York' },
  { country: 'Estados Unidos', province: 'California', city: 'Los Angeles', neighborhood: 'Hollywood', latitude: 34.0928, longitude: -118.3287, timezone: 'America/Los_Angeles' },
  { country: 'Estados Unidos', province: 'Florida', city: 'Miami', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
];

/**
 * Obtiene listas únicas de países, provincias y ciudades
 */
export function getCountries(): string[] {
  const countries = new Set(LOCATIONS_DB.map(loc => loc.country));
  return Array.from(countries).sort();
}

export function getProvinces(country: string): string[] {
  const provinces = new Set(
    LOCATIONS_DB
      .filter(loc => loc.country === country)
      .map(loc => loc.province)
  );
  return Array.from(provinces).sort();
}

export function getCities(country: string, province: string): string[] {
  const cities = new Set(
    LOCATIONS_DB
      .filter(loc => loc.country === country && loc.province === province)
      .map(loc => loc.city)
  );
  return Array.from(cities).sort();
}

export function getNeighborhoods(country: string, province: string, city: string): string[] {
  const neighborhoods = LOCATIONS_DB
    .filter(loc => 
      loc.country === country && 
      loc.province === province && 
      loc.city === city &&
      loc.neighborhood
    )
    .map(loc => loc.neighborhood!);
  
  return Array.from(new Set(neighborhoods)).sort();
}

/**
 * Busca una ubicación específica en la base de datos
 */
export function findLocation(
  country: string,
  province: string,
  city: string,
  neighborhood?: string
): LocationData | null {
  // Primero buscar con barrio si se proporciona
  if (neighborhood) {
    const withNeighborhood = LOCATIONS_DB.find(loc =>
      loc.country === country &&
      loc.province === province &&
      loc.city === city &&
      loc.neighborhood === neighborhood
    );
    if (withNeighborhood) return withNeighborhood;
  }
  
  // Si no hay barrio o no se encuentra, buscar sin barrio
  const withoutNeighborhood = LOCATIONS_DB.find(loc =>
    loc.country === country &&
    loc.province === province &&
    loc.city === city &&
    !loc.neighborhood
  );
  
  if (withoutNeighborhood) return withoutNeighborhood;
  
  // Como fallback, usar la primera ubicación de esa ciudad
  return LOCATIONS_DB.find(loc =>
    loc.country === country &&
    loc.province === province &&
    loc.city === city
  ) || null;
}
