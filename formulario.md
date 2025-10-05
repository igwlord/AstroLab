o.

---

 **sistema de introducción de datos** 
 
 (formulario) estilo astro.com.

> El objetivo es producir un **componente React** (TypeScript preferido) que:
>
> * Recolecte datos personales y de nacimiento.
> * Resuelva **ubicaciones** (país → provincia/estado → ciudad → barrio) y también permita **introducir coordenadas manuales**.
> * Calcule automáticamente **zona horaria y DST** según la ubicación y fecha/hora.
> * Soporte **precisión de hora** (exacta / aproximada / desconocida).
> * Exponga un panel de **Configuración extra** (asteroides, aspectos, Lilith, partes árabes/polarizaciones, etc.).
> * Entregue un **payload normalizado** al `onSubmit` que usaré para llamar a mi `calculateNatalChart(payload)` (ya existente).
>
> ---
>
> **Tecnología & estilo**
>
> * React + TypeScript + hooks.
> * UI con Tailwind (opcional, pero usar clases BEM o Tailwind utilities).
> * Accesibilidad: labels asociadas, `aria-describedby` para ayudas, foco claro, teclas ↑↓ para selects.
> * i18n listo: todos los strings centralizados en un objeto `t()` o `messages`, fácil de traducir.
Adapata a los estilos css de la pagina
>
> ---
>
> **Estructura del componente**
>
> * Archivo único exportando `export default function NatalChartForm(props)` con estas props:
>
>   ```ts
>   type ExtraOptions = {
>     houseSystem: 'Placidus' | 'WholeSign' | 'Koch' | 'Equal';
>     asteroids: { ceres: boolean; pallas: boolean; juno: boolean; vesta: boolean; chiron: boolean };
>     aspects: { conjunction: boolean; opposition: boolean; trine: boolean; square: boolean; sextile: boolean; quincunx: boolean };
>     aspectOrbs: number; // en grados, default 6
>     lilith: { mean: boolean; true: boolean };
>     nodes: { mean: boolean; true: boolean };
>     polarizations: boolean;
>     arabicParts: boolean;
>     parallelDeclinations: boolean;
>   };
>   type FormValue = {
>     name: string;
>     surname?: string;
>     gender?: 'female' | 'male' | 'event';
>     isSelf?: boolean; // "soy yo"
>     birth: {
>       day: number; month: number; year: number;
>       time?: { hour: number; minute: number };
>       timeAccuracy: 'exact' | 'approx' | 'unknown';
>     };
>     location: {
>       countryCode: string; // ISO-3166-1 alpha-2
>       region?: string;     // provincia/estado
>       city?: string;
>       neighborhood?: string;
>       lat?: number; lon?: number; // si el usuario ingresa coordenadas
>       tzId?: string;      // IANA (ej: "America/Argentina/Buenos_Aires")
>     };
>     settings: ExtraOptions;
>   };
>   type NatalChartFormProps = {
>     defaultValues?: Partial<FormValue>;
>     onSubmit: (data: FormValue) => void;
>   };
>   ```
>
> ---
>
> **UI y campos (como astro.com)**
>
> 1. **Datos básicos**
>
>    * `nombre` (input)
>    * `apellido` (input opcional)
>    * `género`: mujer / hombre / Otro/ suceso (radio)
>    
> 2. **Fecha de nacimiento**
>
>    * Día (input numérico 1–31)
>    * Mes (select 1–12 con nombre local)
>    * Año (input numérico con validación 1200–2100)
> 3. **Hora**
>
>    * Select de hora `HH` y `mm`.
>    * Select **precisión**: `exacta`, `aprox.`, `desconocida`.
>
>      * Si `desconocida`, deshabilitar inputs de hora y marcar `time` como `undefined`.
>      * Si `aprox.`, permitir hora y redondear a 15 min al enviar (indicar en hint).
> 4. **Ubicación**
>
>    * Cascada: País (select) → Provincia/Estado (select) → Ciudad (autocomplete) → Barrio (input texto opcional).
>    * Botón “Usar coordenadas” que revela inputs `lat` y `lon` (decimal, validación −90..90 / −180..180).
>    * Mostrar un hint “Si completa coordenadas, la app las prioriza sobre ciudad/barrio”.
>    * Resolver **TZ IANA + DST** automáticamente al seleccionar la ciudad o al introducir coordenadas + fecha/hora. Mostrar campo **solo lectura** `tzId`.


> 5. **Configuración extra (acordeón)**
>
>    * `houseSystem` (select con los 4 sistemas).
>    * Grupo **Asteroides** (Ceres, Pallas, Juno, Vesta, Quirón).
>    * Grupo **Aspectos** (Conj/Opp/Tri/Sq/Sex/Quincunx) + `aspectOrbs` (slider 1–10, default 6).
>    * `lilith` (Mean / True toggles).
>    * `nodes` (Mean / True).
>    * `polarizations` (checkbox).
>    * `arabicParts` (checkbox).
>    * `parallelDeclinations` (checkbox).

> 6. **Acciones**
>
>    * Botón “Continuar / Calcular”.
>    * Al enviar, construir un `FormValue` *completo y validado* y llamar a `props.onSubmit(data)`.
>    * No realizar el cálculo acá; sólo preparar datos.
>
> ---
>
> **Fuentes de datos sugeridas (sin backend pesado)**
>
> * Cargar **países** desde un JSON local (ISO-3166).
> * Provincias/estados y ciudades: usar datasets livianos (ej. `countries-regions-cities.json` propio) + **autocomplete** por texto.
> * Alternativamente, admitir una **strategy**: si existe `window.locationService.find(query)` devolver `{lat, lon, tzId, countryCode, region, city}`; si no, usar el dataset local. Implementar una **interfaz**:
>
>   ```ts
>   interface LocationService {
>     getCountries(): Promise<Array<{ code: string; name: string }>>;
>     getRegions(countryCode: string): Promise<string[]>;
>     getCities(countryCode: string, region?: string, q?: string): Promise<Array<{ name: string; lat: number; lon: number; tzId?: string }>>;
>     resolveTimeZone(lat: number, lon: number, dateTimeIso: string): Promise<string>; // tzId IANA
>   }
>   ```
>
>   Proveer un **mock por defecto** con datos mínimos y punto de extensión para reemplazarlo.
>
> ---
>
> **Cálculo de TZ & DST**
>
> * Cuando haya `lat/lon` y `fecha/hora`, llamar `locationService.resolveTimeZone` y setear `tzId`.
> * Si no hay hora (desconocida), resolver igualmente `tzId` (sólo fecha) usando 12:00 local como aproximación.
> * Mostrar “huso horario automático” con opción manual `select tzId` si el usuario quiere forzar.
>
> ---
>
> **Validación y UX**
>
> * Validaciones en tiempo real con mensajes bajo cada campo.
> * Estados `loading`/`error` al cargar regiones/ciudades.
> * Guardar progreso en `localStorage` (key `natal_form_draft`) y restaurar al montar.
> * Teclado: Enter envía si el formulario es válido; Esc cierra el acordeón de “Configuración extra”.
> * Tooltips `i` con aclaraciones (ej: “Tiempo aproximado redondea a 15’ ”, “Coordenadas priorizan sobre ciudad”).
>
> ---
>
> **Salida esperada (de ejemplo)**
>
> ```json
> {
>   "name": "Guido",
>   "surname": "Di Pietro",
>   "gender": "male",
>   "isSelf": true,
>   "birth": {
>     "day": 16, "month": 10, "year": 1988,
>     "time": { "hour": 17, "minute": 50 },
>     "timeAccuracy": "exact"
>   },
>   "location": {
>     "countryCode": "AR",
>     "region": "Buenos Aires",
>     "city": "CABA",
>     "neighborhood": "Palermo",
>     "lat": -34.580, "lon": -58.430,
>     "tzId": "America/Argentina/Buenos_Aires"
>   },
>   "settings": {
>     "houseSystem": "Placidus",
>     "asteroids": { "ceres": true, "pallas": true, "juno": false, "vesta": false, "chiron": true },
>     "aspects": { "conjunction": true, "opposition": true, "trine": true, "square": true, "sextile": true, "quincunx": false },
>     "aspectOrbs": 6,
>     "lilith": { "mean": true, "true": false },
>     "nodes": { "mean": true, "true": false },
>     "polarizations": true,
>     "arabicParts": false,
>     "parallelDeclinations": false
>   }
> }
> ```
>
> ---
>
> **Conexión con mi cálculo (no implementes el cálculo)**
>
> * Yo voy a pasar a este form una prop `onSubmit`.
> * Ejemplo de uso que podés dejar comentado:
>
>   ```tsx
>   // const chart = await calculateNatalChart(formData); // ya lo tengo implementado
>   // navigate('/result', { state: chart });
>   ```
>
> ---
>
> **Criterios de aceptación**
>
> * El formulario se renderiza sin errores, es totalmente navegable con teclado y móvil-first.
> * La cascada país→región→ciudad funciona y permite override por coordenadas.
> * `tzId` se resuelve y se muestra como sólo lectura (editable manualmente si el usuario abre “avanzado”).
> * `timeAccuracy` modifica validaciones y payload.
> * “Configuración extra” guarda y restaura su estado.
> * `onSubmit` recibe un `FormValue` válido y tipado.
>
> Generá el código completo del componente, con mocks mínimos para `LocationService` y datasets reducidos que yo luego reemplazaré por los reales. Incluí estilos básicos con Tailwind y tooltips simples.

---


