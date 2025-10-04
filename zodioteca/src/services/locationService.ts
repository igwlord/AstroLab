/**
 * Location Service Interface
 * Define la interfaz para el servicio de ubicaciones y timezone
 */

export interface LocationService {
  getCountries(): Promise<Array<{ code: string; name: string }>>;
  getRegions(countryCode: string): Promise<string[]>;
  getCities(
    countryCode: string,
    region?: string,
    q?: string
  ): Promise<Array<{ name: string; lat: number; lon: number; tzId?: string }>>;
  getRegionCoordinates(countryCode: string, region: string): Promise<{ lat: number; lon: number; tzId: string } | null>;
  resolveTimeZone(lat: number, lon: number, dateTimeIso: string): Promise<string>; // tzId IANA
}

/**
 * Mock LocationService con datos mínimos
 * TODO: Reemplazar con servicio real
 */
export class MockLocationService implements LocationService {
  private countries = [
    { code: 'AR', name: 'Argentina' },
    { code: 'ES', name: 'España' },
    { code: 'MX', name: 'México' },
    { code: 'CO', name: 'Colombia' },
    { code: 'CL', name: 'Chile' },
    { code: 'PE', name: 'Perú' },
    { code: 'US', name: 'Estados Unidos' },
  ];

  private regions: Record<string, string[]> = {
    AR: ['Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Chaco', 'Corrientes', 'Misiones', 'San Juan', 'Jujuy', 'Río Negro', 'Neuquén', 'Formosa', 'Chubut', 'San Luis', 'Catamarca', 'La Rioja', 'La Pampa', 'Santa Cruz', 'Tierra del Fuego'],
    ES: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'],
    MX: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Puebla'],
    CO: ['Bogotá', 'Antioquia', 'Valle del Cauca'],
    CL: ['Santiago', 'Valparaíso', 'Biobío'],
    PE: ['Lima', 'Cusco', 'Arequipa'],
    US: ['California', 'New York', 'Texas', 'Florida'],
  };

  private cities: Record<string, Array<{ name: string; lat: number; lon: number; tzId: string }>> = {
    'AR-Buenos Aires': [
      { name: 'Buenos Aires (CABA)', lat: -34.6037, lon: -58.3816, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'La Plata', lat: -34.9215, lon: -57.9545, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Mar del Plata', lat: -38.0055, lon: -57.5426, tzId: 'America/Argentina/Buenos_Aires' },
      // Gran Buenos Aires (GBA) - Zona Norte
      { name: 'San Isidro', lat: -34.4707, lon: -58.5275, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Vicente López', lat: -34.5269, lon: -58.4796, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'San Martín', lat: -34.5747, lon: -58.5373, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Tigre', lat: -34.4264, lon: -58.5796, tzId: 'America/Argentina/Buenos_Aires' },
      // GBA - Zona Oeste
      { name: 'La Matanza', lat: -34.6696, lon: -58.5949, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Morón', lat: -34.6534, lon: -58.6198, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Tres de Febrero', lat: -34.6032, lon: -58.5667, tzId: 'America/Argentina/Buenos_Aires' },
      // GBA - Zona Sur
      { name: 'Lanús', lat: -34.7005, lon: -58.3916, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Avellaneda', lat: -34.6614, lon: -58.3654, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Quilmes', lat: -34.7206, lon: -58.2636, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Lomas de Zamora', lat: -34.7602, lon: -58.3984, tzId: 'America/Argentina/Buenos_Aires' },
      // Otras ciudades de la provincia
      { name: 'Bahía Blanca', lat: -38.7183, lon: -62.2663, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Tandil', lat: -37.3217, lon: -59.1332, tzId: 'America/Argentina/Buenos_Aires' },
    ],
    'AR-CABA': [
      { name: 'Ciudad Autónoma de Buenos Aires', lat: -34.6037, lon: -58.3816, tzId: 'America/Argentina/Buenos_Aires' },
    ],
    'AR-Córdoba': [
      { name: 'Córdoba Capital', lat: -31.4201, lon: -64.1888, tzId: 'America/Argentina/Cordoba' },
      { name: 'Villa Carlos Paz', lat: -31.4241, lon: -64.4978, tzId: 'America/Argentina/Cordoba' },
      { name: 'Río Cuarto', lat: -33.1301, lon: -64.3499, tzId: 'America/Argentina/Cordoba' },
      { name: 'Villa María', lat: -32.4075, lon: -63.2401, tzId: 'America/Argentina/Cordoba' },
    ],
    'AR-Santa Fe': [
      { name: 'Santa Fe Capital', lat: -31.6333, lon: -60.7000, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Rosario', lat: -32.9468, lon: -60.6393, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Rafaela', lat: -31.2528, lon: -61.4867, tzId: 'America/Argentina/Buenos_Aires' },
    ],
    'AR-Mendoza': [
      { name: 'Mendoza Capital', lat: -32.8908, lon: -68.8272, tzId: 'America/Argentina/Mendoza' },
      { name: 'San Rafael', lat: -34.6177, lon: -68.3301, tzId: 'America/Argentina/Mendoza' },
    ],
    'AR-Tucumán': [
      { name: 'San Miguel de Tucumán', lat: -26.8083, lon: -65.2176, tzId: 'America/Argentina/Tucuman' },
    ],
    'AR-Entre Ríos': [
      { name: 'Paraná', lat: -31.7333, lon: -60.5297, tzId: 'America/Argentina/Buenos_Aires' },
      { name: 'Concordia', lat: -31.3930, lon: -58.0209, tzId: 'America/Argentina/Buenos_Aires' },
    ],
    'AR-Salta': [
      { name: 'Salta Capital', lat: -24.7821, lon: -65.4232, tzId: 'America/Argentina/Salta' },
    ],
    'AR-Misiones': [
      { name: 'Posadas', lat: -27.3671, lon: -55.8961, tzId: 'America/Argentina/Buenos_Aires' },
    ],
    'AR-Neuquén': [
      { name: 'Neuquén Capital', lat: -38.9516, lon: -68.0591, tzId: 'America/Argentina/Salta' },
    ],
    'ES-Madrid': [
      { name: 'Madrid', lat: 40.4168, lon: -3.7038, tzId: 'Europe/Madrid' },
      { name: 'Alcalá de Henares', lat: 40.4818, lon: -3.3639, tzId: 'Europe/Madrid' },
    ],
    'MX-Ciudad de México': [
      { name: 'Ciudad de México', lat: 19.4326, lon: -99.1332, tzId: 'America/Mexico_City' },
    ],
    'US-California': [
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, tzId: 'America/Los_Angeles' },
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194, tzId: 'America/Los_Angeles' },
    ],
    'US-New York': [
      { name: 'New York', lat: 40.7128, lon: -74.0060, tzId: 'America/New_York' },
    ],
  };

  async getCountries(): Promise<Array<{ code: string; name: string }>> {
    return Promise.resolve(this.countries);
  }

  async getRegions(countryCode: string): Promise<string[]> {
    return Promise.resolve(this.regions[countryCode] || []);
  }

  async getCities(
    countryCode: string,
    region?: string,
    q?: string
  ): Promise<Array<{ name: string; lat: number; lon: number; tzId?: string }>> {
    const key = region ? `${countryCode}-${region}` : countryCode;
    let cities = this.cities[key] || [];

    if (q) {
      const query = q.toLowerCase();
      cities = cities.filter((city) => city.name.toLowerCase().includes(query));
    }

    return Promise.resolve(cities);
  }

  async getRegionCoordinates(countryCode: string, region: string): Promise<{ lat: number; lon: number; tzId: string } | null> {
    // Buscar la primera ciudad de esa región para usar sus coordenadas
    const key = `${countryCode}-${region}`;
    const cities = this.cities[key];
    
    if (cities && cities.length > 0) {
      // Usar las coordenadas de la capital/ciudad principal (primera en la lista)
      return {
        lat: cities[0].lat,
        lon: cities[0].lon,
        tzId: cities[0].tzId
      };
    }
    
    return null;
  }

  async resolveTimeZone(lat: number, lon: number): Promise<string> {
    // Aproximación simple por coordenadas
    // TODO: Usar servicio real como timezonedb.com o similar
    
    // Argentina
    if (lat < -20 && lat > -55 && lon < -53 && lon > -73) {
      return 'America/Argentina/Buenos_Aires';
    }
    
    // España
    if (lat > 36 && lat < 44 && lon > -10 && lon < 5) {
      return 'Europe/Madrid';
    }
    
    // México
    if (lat > 14 && lat < 33 && lon < -86 && lon > -118) {
      return 'America/Mexico_City';
    }
    
    // USA Costa Este
    if (lat > 25 && lat < 48 && lon < -67 && lon > -80) {
      return 'America/New_York';
    }
    
    // USA Costa Oeste
    if (lat > 32 && lat < 49 && lon < -114 && lon > -125) {
      return 'America/Los_Angeles';
    }
    
    // Default UTC
    return 'UTC';
  }
}

// Instancia por defecto
export const defaultLocationService = new MockLocationService();
