/**
 * Tipo de datos para Frecuencias Zodiacales
 * Combina astrología, chakras y frecuencias sagradas
 */

export interface ZodiacFrequency {
  // Identificación del signo
  id: string;
  name: string;
  symbol: string;
  
  // Información energética
  chakra: {
    name: string;
    location: string;
  };
  
  // Frecuencia sagrada
  frequency: number; // En Hz
  audioFile: string; // Path al archivo de audio
  
  // Colores vibratorios
  color: {
    primary: string;    // Color principal
    secondary?: string; // Color secundario (opcional)
    gradient: string;   // Gradiente CSS
    hex: string;        // Código hex para efectos
  };
  
  // Ejercicio holístico
  exercise: {
    title: string;
    description: string;
    affirmation: string;
  };
  
  // Metadatos
  element: 'fuego' | 'tierra' | 'aire' | 'agua';
  dates: string; // Rango de fechas del signo
}

export type ZodiacFrequencies = ZodiacFrequency[];
