# 📋 Formulario de Carta Natal Mejorado

## Descripción

Componente React profesional para recolección de datos de carta natal, inspirado en el formulario de **astro.com**.

## Características Principales

### ✨ Datos Personales
- Nombre y apellido
- Género (Mujer / Hombre / Otro / Suceso)
- Checkbox "Es para mí"

### 📅 Fecha y Hora de Nacimiento
- Día, mes (selector con nombres), año
- Hora con selectores de HH:MM
- **Precisión de hora**:
  - ⏰ Exacta
  - ⏱️ Aproximada (redondea a 15 minutos)
  - ❓ Desconocida (deshabilita inputs de hora)

### 📍 Ubicación
- **Cascada de selectores**: País → Región → Ciudad
- Autocomplete de ciudades
- Campo opcional de barrio
- **Toggle para coordenadas manuales**:
  - Campos de latitud/longitud con validación
  - Prioriza coordenadas sobre ciudad
- **Timezone automático**:
  - Detecta IANA timezone según coordenadas
  - Muestra zona horaria en campo de solo lectura
  - Opción manual para override

### ⚙️ Configuración Avanzada (Acordeón)
- Sistema de casas (Placidus, WholeSign, Koch, Equal)
- **Asteroides**: Ceres, Pallas, Juno, Vesta, Quirón
- **Aspectos**: Conjunción, Oposición, Trígono, Cuadratura, Sextil, Quincunx
- Slider de orbe de aspectos (1-10°, default 6)
- **Lilith**: Mean / True
- **Nodos lunares**: Mean / True
- Polarizaciones
- Partes Árabes
- Declinaciones Paralelas

### 💾 Persistencia
- Guarda borrador en `localStorage` con key `natal_form_draft`
- Restaura automáticamente al recargar página
- Se limpia al enviar exitosamente

### ♿ Accesibilidad
- Labels asociadas a todos los inputs
- Focus visible con ring de color
- Navegación completa con teclado
- Mensajes de error contextuales

## Uso

### Importar el componente

```tsx
import NatalChartForm from '../components/NatalChartForm';
import type { FormValue } from '../types/natalForm';
```

### Ejemplo básico

```tsx
function MyPage() {
  const handleSubmit = (data: FormValue) => {
    console.log('Datos recibidos:', data);
    // Aquí llamar a calculateNatalChart(data)
  };

  return (
    <NatalChartForm 
      onSubmit={handleSubmit}
      onCancel={() => console.log('Cancelado')} // opcional
    />
  );
}
```

### Con valores por defecto

```tsx
<NatalChartForm 
  defaultValues={{
    name: 'Guido',
    surname: 'Di Pietro',
    gender: 'male',
    isSelf: true,
    birth: {
      day: 16,
      month: 10,
      year: 1988,
      time: { hour: 17, minute: 50 },
      timeAccuracy: 'exact',
    },
    location: {
      countryCode: 'AR',
      region: 'Buenos Aires',
      city: 'Buenos Aires (CABA)',
      lat: -34.6037,
      lon: -58.3816,
      tzId: 'America/Argentina/Buenos_Aires',
    },
  }}
  onSubmit={handleSubmit}
/>
```

## Estructura de Datos

### FormValue (Output)

```typescript
type FormValue = {
  name: string;
  surname?: string;
  gender?: 'female' | 'male' | 'other' | 'event';
  isSelf?: boolean;
  birth: {
    day: number;
    month: number;
    year: number;
    time?: { hour: number; minute: number }; // undefined si timeAccuracy='unknown'
    timeAccuracy: 'exact' | 'approx' | 'unknown';
  };
  location: {
    countryCode: string; // ISO-3166-1 alpha-2
    region?: string;
    city?: string;
    neighborhood?: string;
    lat?: number;
    lon?: number;
    tzId?: string; // IANA timezone
  };
  settings: ExtraOptions;
};
```

### Ejemplo de payload completo

```json
{
  "name": "Guido",
  "surname": "Di Pietro",
  "gender": "male",
  "isSelf": true,
  "birth": {
    "day": 16,
    "month": 10,
    "year": 1988,
    "time": { "hour": 17, "minute": 50 },
    "timeAccuracy": "exact"
  },
  "location": {
    "countryCode": "AR",
    "region": "Buenos Aires",
    "city": "CABA",
    "neighborhood": "Palermo",
    "lat": -34.580,
    "lon": -58.430,
    "tzId": "America/Argentina/Buenos_Aires"
  },
  "settings": {
    "houseSystem": "Placidus",
    "asteroids": {
      "ceres": true,
      "pallas": true,
      "juno": false,
      "vesta": false,
      "chiron": true
    },
    "aspects": {
      "conjunction": true,
      "opposition": true,
      "trine": true,
      "square": true,
      "sextile": true,
      "quincunx": false
    },
    "aspectOrbs": 6,
    "lilith": { "mean": true, "true": false },
    "nodes": { "mean": true, "true": false },
    "polarizations": true,
    "arabicParts": false,
    "parallelDeclinations": false
  }
}
```

## LocationService

El formulario usa un servicio de ubicaciones con interfaz:

```typescript
interface LocationService {
  getCountries(): Promise<Array<{ code: string; name: string }>>;
  getRegions(countryCode: string): Promise<string[]>;
  getCities(countryCode: string, region?: string, q?: string): 
    Promise<Array<{ name: string; lat: number; lon: number; tzId?: string }>>;
  resolveTimeZone(lat: number, lon: number, dateTimeIso: string): Promise<string>;
}
```

### Mock incluido

Por defecto usa `MockLocationService` con datos mínimos:
- 7 países (AR, ES, MX, CO, CL, PE, US)
- Regiones principales de cada país
- Ciudades con coordenadas y timezone

### Reemplazar con servicio real

```tsx
import { defaultLocationService } from '../services/locationService';

// Reemplazar el mock
defaultLocationService.getCountries = async () => {
  const response = await fetch('/api/countries');
  return response.json();
};
```

## Validaciones

- **Nombre**: Requerido
- **Día**: 1-31
- **Mes**: 1-12
- **Año**: 1200-2100
- **Hora**: 0-23 (si no es "desconocida")
- **Minuto**: 0-59 (si no es "desconocida")
- **País**: Requerido
- **Latitud**: -90 a 90
- **Longitud**: -180 a 180

Mensajes de error se muestran bajo cada campo en rojo.

## Estilos

Usa **Tailwind CSS** con:
- Gradientes purple-to-indigo para headers
- Inputs con focus ring purple
- Cards con sombras y bordes redondeados
- Responsive: mobile-first con grid breakpoints

## Acciones del usuario

### Enter
Envía el formulario si está válido

### Escape
Cierra el acordeón de "Configuración Avanzada" (si está abierto)

### Tab
Navegación estándar entre campos

## Próximas mejoras (TODO)

- [ ] Integrar servicio real de geocoding (Google Maps API, Nominatim)
- [ ] Resolver timezone con API como timezonedb.com
- [ ] Agregar dataset completo de ciudades (GeoNames)
- [ ] Validación de fechas inválidas (ej: 31 de febrero)
- [ ] Sugerencias de barrios según ciudad
- [ ] Modo oscuro
- [ ] i18n completo (actualmente strings en español hardcodeados)
- [ ] Tests unitarios con Vitest

## Archivos

- `src/components/NatalChartForm.tsx` - Componente principal
- `src/types/natalForm.ts` - Tipos TypeScript
- `src/services/locationService.ts` - Servicio de ubicaciones (mock)
- `src/pages/NewNatalChartPage.tsx` - Página de ejemplo
- `FORMULARIO_NATAL.md` - Esta documentación

## Licencia

Parte del proyecto Zodioteca
