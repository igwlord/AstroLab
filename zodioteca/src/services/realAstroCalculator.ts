/**
 * Calculador Astronómico Real usando astronomy-engine
 * Calcula posiciones planetarias precisas para cualquier fecha/ubicación
 */

import * as Astronomy from 'astronomy-engine';

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

const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

function getPlanetName(body: Astronomy.Body): string {
  switch (body) {
    case Astronomy.Body.Sun: return 'Sol';
    case Astronomy.Body.Moon: return 'Luna';
    case Astronomy.Body.Mercury: return 'Mercurio';
    case Astronomy.Body.Venus: return 'Venus';
    case Astronomy.Body.Mars: return 'Marte';
    case Astronomy.Body.Jupiter: return 'Júpiter';
    case Astronomy.Body.Saturn: return 'Saturno';
    case Astronomy.Body.Uranus: return 'Urano';
    case Astronomy.Body.Neptune: return 'Neptuno';
    case Astronomy.Body.Pluto: return 'Plutón';
    default: return 'Desconocido';
  }
}

function eclipticToZodiac(longitude: number): { sign: string; degree: number } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.round(degree * 100) / 100
  };
}

function calculateRetrograde(body: Astronomy.Body, date: Date): boolean {
  // Calcular velocidad aparente comparando posición en t y t+1 día
  const currentPos = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, false));
  const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const nextPos = Astronomy.Ecliptic(Astronomy.GeoVector(body, nextDay, false));

  // Si la longitud disminuye, está retrógrado
  return nextPos.elon < currentPos.elon;
}

function calculateHouses(date: Date, latitude: number, longitude: number): {
  houses: HousePosition[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
} {
  // Calcular RAMC (Right Ascension of Midheaven)
  const siderealTime = Astronomy.SiderealTime(date);
  const ramc = (siderealTime + longitude / 15) * 15; // Convertir a grados

  // Calcular MC (Midheaven) - Longitud eclíptica del meridiano
  const mc = ramc % 360;
  const mcZodiac = eclipticToZodiac(mc);

  // Calcular ASC (Ascendant) usando fórmula simplificada
  // ASC = arctan(sin(RAMC) / (cos(RAMC) * sin(obliquity) - tan(latitude) * cos(obliquity)))
  const obliquity = 23.4397; // Oblicuidad de la eclíptica en grados
  const ramcRad = (ramc * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;

  const ascLon =
    Math.atan2(
      Math.sin(ramcRad),
      Math.cos(ramcRad) * Math.sin(oblRad) - Math.tan(latRad) * Math.cos(oblRad)
    ) *
    (180 / Math.PI);

  const asc = ((ascLon % 360) + 360) % 360;
  const ascZodiac = eclipticToZodiac(asc);

  // Sistema de casas Placidus simplificado
  const houses: HousePosition[] = [];
  const ic = (mc + 180) % 360; // Immum Coeli (Casa 4)
  const desc = (asc + 180) % 360; // Descendente (Casa 7)

  // Casas 1, 4, 7, 10 (angulares)
  houses.push({ number: 1, ...ascZodiac, cusp: asc });
  houses.push({ number: 4, ...eclipticToZodiac(ic), cusp: ic });
  houses.push({ number: 7, ...eclipticToZodiac(desc), cusp: desc });
  houses.push({ number: 10, ...mcZodiac, cusp: mc });

  // Interpolar casas intermedias (simplificado - no es Placidus exacto)
  for (let i = 0; i < 3; i++) {
    // Casas 2, 3 entre ASC y IC
    const cusp2_3 = (asc + ((ic - asc + 360) % 360) * (i + 1) / 3) % 360;
    houses.push({ number: i + 2, ...eclipticToZodiac(cusp2_3), cusp: cusp2_3 });

    // Casas 5, 6 entre IC y DESC
    const cusp5_6 = (ic + ((desc - ic + 360) % 360) * (i + 1) / 3) % 360;
    houses.push({ number: i + 5, ...eclipticToZodiac(cusp5_6), cusp: cusp5_6 });

    // Casas 8, 9 entre DESC y MC
    const cusp8_9 = (desc + ((mc - desc + 360) % 360) * (i + 1) / 3) % 360;
    houses.push({ number: i + 8, ...eclipticToZodiac(cusp8_9), cusp: cusp8_9 });

    // Casas 11, 12 entre MC y ASC
    const cusp11_12 = (mc + ((asc - mc + 360) % 360) * (i + 1) / 3) % 360;
    houses.push({ number: i + 11, ...eclipticToZodiac(cusp11_12), cusp: cusp11_12 });
  }

  // Ordenar por número de casa
  houses.sort((a, b) => a.number - b.number);

  return {
    houses,
    ascendant: ascZodiac,
    midheaven: mcZodiac
  };
}

function assignHouse(longitude: number, houses: HousePosition[]): number {
  // Encontrar en qué casa está el planeta
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % 12];

    if (currentHouse.cusp <= nextHouse.cusp) {
      if (longitude >= currentHouse.cusp && longitude < nextHouse.cusp) {
        return currentHouse.number;
      }
    } else {
      // Cruce del 0° de Aries
      if (longitude >= currentHouse.cusp || longitude < nextHouse.cusp) {
        return currentHouse.number;
      }
    }
  }
  return 1; // Fallback
}

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectTypes = [
    { name: 'Conjunción', angle: 0, orb: 10 },
    { name: 'Sextil', angle: 60, orb: 6 },
    { name: 'Cuadratura', angle: 90, orb: 8 },
    { name: 'Trígono', angle: 120, orb: 8 },
    { name: 'Oposición', angle: 180, orb: 10 }
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const angle = Math.abs(p1.longitude - p2.longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;

      for (const aspectType of aspectTypes) {
        const diff = Math.abs(normalizedAngle - aspectType.angle);
        if (diff <= aspectType.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: aspectType.name,
            angle: normalizedAngle,
            orb: diff,
            applying: p1.longitude < p2.longitude
          });
        }
      }
    }
  }

  return aspects;
}

export async function calculateNatalChart(
  birthDate: Date,
  latitude: number,
  longitude: number,
  location: string,
  _houseSystem: 'Placidus' | 'WholeSign' | 'Koch' | 'Equal' = 'Placidus'
): Promise<NatalChart> {
  // TODO: Implementar diferentes sistemas de casas
  console.log('=== CÁLCULO ASTRONÓMICO REAL ===');
  console.log('Fecha:', birthDate.toISOString());
  console.log('Ubicación:', { latitude, longitude, location });

  // Calcular posiciones planetarias
  const planets: PlanetPosition[] = [];
  const bodies = [
    Astronomy.Body.Sun,
    Astronomy.Body.Moon,
    Astronomy.Body.Mercury,
    Astronomy.Body.Venus,
    Astronomy.Body.Mars,
    Astronomy.Body.Jupiter,
    Astronomy.Body.Saturn,
    Astronomy.Body.Uranus,
    Astronomy.Body.Neptune,
    Astronomy.Body.Pluto
  ];

  // Calcular casas primero para asignar planetas
  const { houses, ascendant, midheaven } = calculateHouses(birthDate, latitude, longitude);

  for (const body of bodies) {
    try {
      const ecliptic = Astronomy.Ecliptic(Astronomy.GeoVector(body, birthDate, false));
      const lon = ecliptic.elon;
      const zodiac = eclipticToZodiac(lon);
      const retrograde = body !== 'Sun' && body !== 'Moon' ? calculateRetrograde(body, birthDate) : false;
      const house = assignHouse(lon, houses);

      planets.push({
        name: getPlanetName(body),
        sign: zodiac.sign,
        degree: zodiac.degree,
        longitude: lon,
        retrograde,
        house
      });
    } catch (error) {
      console.error(`Error calculando ${body}:`, error);
    }
  }

  // Calcular aspectos
  const aspects = calculateAspects(planets);

  return {
    date: birthDate,
    location,
    latitude,
    longitude,
    timezone: 'UTC', // TODO: usar timezone real
    planets,
    houses,
    ascendant,
    midheaven,
    aspects
  };
}
