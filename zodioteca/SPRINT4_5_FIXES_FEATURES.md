# 🐛 SPRINTS 4 & 5: Fixes Específicos y Mejoras - Planificación

**Fecha:** 10 de octubre de 2025  
**Tipo:** Bug fixes + Feature enhancements  
**Prioridad:** ALTA (funcionalidad crítica + UX audio)

---

## 📋 Resumen de Issues Reportados

### **Sprint 4: Carta Natal + Glosario (Móvil)**
**Componentes:** `ChartViewTabs.tsx`, `NatalChartWheelPro.tsx`, `GlossaryCategories.tsx`  
**Tiempo estimado:** 2-3h  
**Impacto:** ALTO (funcionalidad crítica)

**Issues:**
1. ❌ **Tab chip 'Carta Natal' faltante en móviles** → No permite volver a la carta
2. ❌ **Menú de configuración ausente en carta natal móvil**
3. ❌ **Sección 'Sistema de Casas' faltante en Glosario móvil**
4. ❌ **Sección 'Sistema de Coordenadas' faltante en Glosario móvil**

---

### **Sprint 5: MiniPlayer Frecuencias (PC + Móvil)**
**Componentes:** `FloatingMiniPlayer.tsx`, `FrequenciesPage.tsx`  
**Tiempo estimado:** 3-4h  
**Impacto:** MEDIO-ALTO (UX audio + bugs críticos)

**Features:**
1. ✨ **Barra de volumen con fases lunares** 🌑🌒🌓🌔🌕 (0% → 100%)
2. ✨ **Efectos de latido con ondas suaves** (pulir visuales)

**Bugs:**
3. 🐛 **Audio Aire se corta a los 3min** (duración real: 15min) → Revisar otros 11 audios
4. 🐛 **Sincronización siguiente/atrás desincronizada** → Estado no se refleja en vista Frecuencias

---

## 🚀 SPRINT 4: Fixes Carta Natal + Glosario (Móvil)

### **Issue #1: Tab Chip 'Carta Natal' Faltante en Móviles**

**Problema:**
```
Móvil (<768px):
┌─────────────────────────────────────┐
│ Tab chips:                          │
│ [Datos] [Aspectos] [Dignidades] ... │
│                                     │
│ ❌ Falta chip [Carta Natal]         │
│ → Usuario no puede volver a rueda  │
└─────────────────────────────────────┘
```

**Causa probable:**
- `ChartViewTabs.tsx` oculta el tab "Carta Natal" en móvil con `hidden md:block`
- O el tab no existe en el array de tabs móviles

**Solución:**
```tsx
// Archivo: ChartViewTabs.tsx

// Antes (probable)
const mobileTabs = ['Datos', 'Aspectos', 'Dignidades', 'Configuraciones'];

// Después (fix)
const mobileTabs = ['Carta Natal', 'Datos', 'Aspectos', 'Dignidades', 'Configuraciones'];

// O quitar clase hidden del tab
<button 
  className="md:block" // ❌ Antes: hidden md:block
  onClick={() => setActiveTab('chart')}
>
  Carta Natal
</button>
```

**Testing:**
- [ ] iPhone SE: Tab chip visible y funcional
- [ ] Tocar "Carta Natal" vuelve a la rueda
- [ ] Posición del tab: inicio de la lista
- [ ] Estado activo visual cuando estás en carta

---

### **Issue #2: Menú de Configuración Ausente en Carta Natal Móvil**

**Problema:**
```
Móvil (<768px):
┌─────────────────────────────────────┐
│ [Rueda Natal] ← Visible             │
│                                     │
│ ❌ Falta botón ⚙️ Configuración     │
│ → Usuario no puede ocultar planetas│
└─────────────────────────────────────┘

Desktop (≥768px):
┌─────────────────────────────────────┐
│ [Rueda Natal] [⚙️ Configuración] ✅  │
│                                     │
│ → Funciona correctamente            │
└─────────────────────────────────────┘
```

**Causa probable:**
- Botón configuración tiene clase `hidden md:block`
- O está dentro de un contenedor que se oculta en móvil

**Solución:**
```tsx
// Archivo: NatalChartWheelPro.tsx o ChartViewTabs.tsx

// Antes (probable)
<button 
  className="hidden md:flex items-center gap-2" // ❌ Oculto en móvil
  onClick={() => setShowConfigModal(true)}
>
  <SettingsIcon />
  Configuración
</button>

// Después (fix)
<button 
  className="flex items-center gap-2 px-3 py-2 rounded-lg" // ✅ Visible en móvil
  onClick={() => setShowConfigModal(true)}
>
  <SettingsIcon className="w-5 h-5" />
  <span className="hidden sm:inline">Configuración</span> {/* Solo texto en desktop */}
</button>
```

**Alternativa: Botón flotante móvil**
```tsx
{/* Solo en móvil: botón flotante ⚙️ */}
<button 
  className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-purple-600 shadow-lg"
  onClick={() => setShowConfigModal(true)}
  aria-label="Abrir configuración"
>
  <SettingsIcon className="w-6 h-6 text-white" />
</button>
```

**Testing:**
- [ ] iPhone SE: Botón ⚙️ visible
- [ ] Tocar botón abre modal configuración
- [ ] Modal funciona en móvil
- [ ] Cambios de configuración se aplican

---

### **Issue #3: Sección 'Sistema de Casas' Faltante en Glosario Móvil**

**Problema:**
```
Glosario - Desktop (≥768px):
✅ Planetas
✅ Signos
✅ Aspectos
✅ Sistema de Casas      ← Visible
✅ Sistema de Coordenadas ← Visible
✅ Configuraciones

Glosario - Móvil (<768px):
✅ Planetas
✅ Signos
✅ Aspectos
❌ Sistema de Casas      ← FALTANTE
❌ Sistema de Coordenadas ← FALTANTE
✅ Configuraciones
```

**Causa probable:**
- Categorías filtradas en móvil por tamaño de pantalla
- O renderizado condicional que excluye estas secciones

**Solución:**
```tsx
// Archivo: GlossaryCategories.tsx

// Antes (probable)
const categories = [
  { id: 'planets', name: 'Planetas', icon: '☉' },
  { id: 'signs', name: 'Signos', icon: '♈' },
  { id: 'aspects', name: 'Aspectos', icon: '☌' },
  // ❌ Falta Sistema de Casas en móvil
  // ❌ Falta Sistema de Coordenadas en móvil
  { id: 'configurations', name: 'Configuraciones', icon: '⚙️' },
];

// Después (fix)
const categories = [
  { id: 'planets', name: 'Planetas', icon: '☉' },
  { id: 'signs', name: 'Signos', icon: '♈' },
  { id: 'aspects', name: 'Aspectos', icon: '☌' },
  { id: 'house-systems', name: 'Sistema de Casas', icon: '🏠' }, // ✅ Añadido
  { id: 'coordinate-systems', name: 'Sistema de Coordenadas', icon: '🌐' }, // ✅ Añadido
  { id: 'configurations', name: 'Configuraciones', icon: '⚙️' },
];

// O quitar filtro móvil si existe
const visibleCategories = isMobile 
  ? categories // ✅ Mostrar todas (no filtrar)
  : categories;
```

**Testing:**
- [ ] iPhone SE: 6 categorías visibles
- [ ] Tocar "Sistema de Casas" muestra contenido
- [ ] Tocar "Sistema de Coordenadas" muestra contenido
- [ ] Scroll funciona correctamente
- [ ] Contenido de las secciones completo

---

### **Issue #4: Validar Contenido de Secciones**

Una vez visibles las secciones, validar que tienen contenido:

```tsx
// Archivo: glossaryData.ts (o similar)

export const houseSystems = [
  {
    id: 'placidus',
    name: 'Placidus',
    description: 'Sistema de casas más popular...',
    // ... resto del contenido
  },
  {
    id: 'koch',
    name: 'Koch',
    description: 'Sistema desarrollado por Walter Koch...',
  },
  // ... otros sistemas
];

export const coordinateSystems = [
  {
    id: 'ecliptic',
    name: 'Eclíptica',
    description: 'Sistema de coordenadas basado en la órbita terrestre...',
  },
  {
    id: 'equatorial',
    name: 'Ecuatorial',
    description: 'Basado en el ecuador celeste...',
  },
  // ... otros sistemas
];
```

**Testing:**
- [ ] Contenido Sistema de Casas: ≥5 sistemas explicados
- [ ] Contenido Sistema de Coordenadas: ≥3 sistemas
- [ ] Formato consistente con otras secciones
- [ ] Links internos funcionan (si aplican)

---

## 🎵 SPRINT 5: Mejoras MiniPlayer Frecuencias

### **Feature #1: Barra de Volumen con Fases Lunares**

**Diseño:**
```
┌────────────────────────────────────────┐
│ 🎵 Mercurio - 141.27 Hz               │
│                                        │
│ Volumen:                               │
│ ┌──────────────────────────────────┐  │
│ │🌑     🌒     🌓     🌔     🌕   │  │ ← Fases lunares
│ │•─────────────────────────○       │  │ ← Slider
│ └──────────────────────────────────┘  │
│    0%   25%    50%    75%   100%      │
└────────────────────────────────────────┘
```

**Implementación:**
```tsx
// Archivo: FloatingMiniPlayer.tsx

const MoonPhaseVolumeSlider = ({ volume, onVolumeChange }: Props) => {
  // Fases lunares con emojis
  const moonPhases = [
    { emoji: '🌑', threshold: 0 },    // 0% - Luna nueva
    { emoji: '🌒', threshold: 12.5 }, // 12.5%
    { emoji: '🌓', threshold: 37.5 }, // 37.5%
    { emoji: '🌔', threshold: 62.5 }, // 62.5%
    { emoji: '🌕', threshold: 87.5 }, // 87.5% - Luna llena
  ];

  // Determinar fase actual según volumen
  const currentPhase = moonPhases.reduce((prev, curr) => 
    volume >= curr.threshold ? curr : prev
  );

  return (
    <div className="w-full px-4">
      {/* Fases lunares (decorativas) */}
      <div className="flex justify-between mb-2 text-2xl opacity-60">
        {moonPhases.map((phase, idx) => (
          <span 
            key={idx}
            className={`transition-all duration-300 ${
              volume >= phase.threshold 
                ? 'opacity-100 scale-110 drop-shadow-glow' 
                : 'opacity-40 scale-90'
            }`}
            style={{
              filter: volume >= phase.threshold 
                ? `drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))` 
                : 'none'
            }}
          >
            {phase.emoji}
          </span>
        ))}
      </div>

      {/* Slider de volumen */}
      <input 
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg cursor-pointer
                   bg-gradient-to-r from-purple-900 to-purple-600
                   appearance-none
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-yellow-400
                   [&::-webkit-slider-thumb]:shadow-lg
                   [&::-webkit-slider-thumb]:cursor-pointer"
        aria-label={`Volumen: ${volume}%`}
      />

      {/* Porcentaje numérico */}
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>0%</span>
        <span className="font-bold text-purple-300">{volume}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
```

**Animación de transición:**
```tsx
// Efecto de crecimiento de luna al subir volumen
const moonGrowAnimation = keyframes`
  0% { transform: scale(0.9); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1.1); opacity: 1; }
`;
```

**Testing:**
- [ ] 5 fases lunares visibles correctamente
- [ ] Fase actual iluminada según volumen
- [ ] Transición suave entre fases (300ms)
- [ ] Efecto glow en fase activa
- [ ] Slider funcional en móvil y desktop
- [ ] Tooltip con % al hacer hover (desktop)
- [ ] Accesibilidad: ARIA labels correctos

---

### **Feature #2: Efectos de Latido con Ondas Suaves**

**Diseño actual vs mejorado:**
```
Antes:
┌────────────────────┐
│ [Onda muy abrupta] │ ← Animación rígida
│  /\  /\  /\  /\    │
│ /  \/  \/  \/  \   │
└────────────────────┘

Después:
┌────────────────────┐
│ [Onda suave]       │ ← Animación orgánica
│   ╱╲   ╱╲   ╱╲    │
│  ╱  ╲ ╱  ╲ ╱  ╲   │
└────────────────────┘
```

**Implementación:**
```tsx
// Archivo: FloatingMiniPlayer.tsx

const PulseWaveEffect = ({ frequency, isPlaying }: Props) => {
  return (
    <div className="relative w-full h-16 overflow-hidden">
      {/* SVG con ondas suaves */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 200 50"
        preserveAspectRatio="none"
      >
        {/* Onda de fondo (más lenta) */}
        <path
          d="M0,25 Q25,15 50,25 T100,25 T150,25 T200,25"
          fill="none"
          stroke="rgba(139, 92, 246, 0.3)"
          strokeWidth="2"
          className={isPlaying ? 'animate-pulse-wave-slow' : ''}
        />
        
        {/* Onda principal (velocidad media) */}
        <path
          d="M0,25 Q25,10 50,25 T100,25 T150,25 T200,25"
          fill="none"
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth="3"
          className={isPlaying ? 'animate-pulse-wave' : ''}
        />
        
        {/* Onda frontal (más rápida) */}
        <path
          d="M0,25 Q25,5 50,25 T100,25 T150,25 T200,25"
          fill="none"
          stroke="rgba(168, 85, 247, 0.9)"
          strokeWidth="4"
          className={isPlaying ? 'animate-pulse-wave-fast' : ''}
        />
      </svg>

      {/* Gradiente overlay para fade suave */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(26,26,46,0.3) 50%, transparent 90%)'
        }}
      />
    </div>
  );
};

// Animaciones con timing bezier suave
const pulseWaveKeyframes = {
  '0%': { transform: 'translateX(-50px)' },
  '100%': { transform: 'translateX(0px)' },
};

// CSS Tailwind config
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-wave-slow': 'pulse-wave 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-wave': 'pulse-wave 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-wave-fast': 'pulse-wave 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
};
```

**Variante: Onda sincronizada con frecuencia**
```tsx
// Velocidad de onda basada en frecuencia Hz
const waveSpeed = 3000 / (frequency / 100); // Más Hz = más rápido

<path
  style={{
    animation: `pulse-wave ${waveSpeed}ms cubic-bezier(0.4, 0, 0.2, 1) infinite`
  }}
/>
```

**Testing:**
- [ ] Ondas visibles durante reproducción
- [ ] Pausa cuando audio pausa
- [ ] Transición suave (cubic-bezier)
- [ ] Performance 60fps
- [ ] No causa lag en móvil
- [ ] Colores coherentes con tema

---

### **Bug #3: Audio Aire se Corta a los 3min**

**Problema:**
```
Audio: Aire (elemento)
Duración esperada: 15 minutos
Duración actual: Se corta a los ~3 minutos
Estado: 🐛 BUG CRÍTICO
```

**Causa probable:**
1. **Archivo truncado:** MP3 corrupto o cortado al subir
2. **Timeout del servidor:** CDN cierra conexión a los 3min
3. **Buffer size:** Audio no precargado completamente
4. **Loop mal configurado:** Se repite fragmento de 3min

**Diagnóstico:**
```bash
# Verificar duración real del archivo
ffprobe public/media/frequencies/aire.mp3

# Output esperado:
Duration: 00:15:00.00 # ✅ 15 minutos

# Si muestra:
Duration: 00:03:XX.XX # ❌ Archivo truncado
```

**Solución #1: Re-subir archivo correcto**
```bash
# Verificar archivo fuente
ls -lh public/media/frequencies/aire.mp3

# Reemplazar con archivo completo de 15min
# Rebuild y redeploy
```

**Solución #2: Configurar preload**
```tsx
<audio 
  ref={audioRef}
  src={audioUrl}
  preload="auto" // ✅ Cargar todo antes de reproducir
  onLoadedMetadata={(e) => {
    console.log('Duración cargada:', e.currentTarget.duration);
    if (e.currentTarget.duration < 900) { // <15min
      console.error('❌ Audio truncado:', audioUrl);
    }
  }}
/>
```

**Solución #3: Verificar los otros 11 audios**
```tsx
// Script de validación
const frequencies = [
  'sol', 'luna', 'mercurio', 'venus', 'marte', 
  'jupiter', 'saturno', 'urano', 'neptuno', 'pluton',
  'tierra', 'aire', 'fuego', 'agua'
];

frequencies.forEach(async (freq) => {
  const audio = new Audio(`/media/frequencies/${freq}.mp3`);
  audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration;
    const expectedDuration = 900; // 15min
    
    if (Math.abs(duration - expectedDuration) > 10) {
      console.error(`❌ ${freq}: ${duration}s (esperado: ${expectedDuration}s)`);
    } else {
      console.log(`✅ ${freq}: ${duration}s OK`);
    }
  });
});
```

**Testing:**
- [ ] Audio Aire reproduce 15min completos
- [ ] Otros 11 audios validan correctamente
- [ ] No hay cortes abruptos
- [ ] Loop funciona correctamente
- [ ] Preload no causa lag inicial

---

### **Bug #4: Sincronización Siguiente/Atrás Desincronizada**

**Problema:**
```
Escenario:
1. Usuario está en página /frecuencias
2. Selecciona "Sol" → Sol activo en página + mini reproductor
3. Usuario toca "Siguiente ▶▶" en mini reproductor
4. Audio cambia a "Luna" ✅
5. Usuario vuelve a /frecuencias
6. ❌ Página aún muestra "Sol" activo (debería mostrar "Luna")
7. ❌ Botón de selección desincronizado
```

**Causa probable:**
- Estado del reproductor y página no comparten store
- O evento de cambio de pista no actualiza vista Frecuencias

**Diagnóstico:**
```tsx
// Verificar si usan el mismo estado
// FloatingMiniPlayer.tsx
const { currentTrack, setCurrentTrack } = useAudioStore();

// FrequenciesPage.tsx
const { currentTrack } = useAudioStore(); // ¿Mismo store?
```

**Solución:**
```tsx
// Archivo: store/useAudioStore.ts (Zustand o Context)

interface AudioStore {
  currentTrack: string | null;
  isPlaying: boolean;
  volume: number;
  
  // Métodos sincronizados
  setCurrentTrack: (track: string) => void;
  next: () => void;
  previous: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 80,
  
  setCurrentTrack: (track) => {
    set({ currentTrack: track });
    // Broadcast a todos los componentes
    window.dispatchEvent(new CustomEvent('audio-track-change', { 
      detail: { track } 
    }));
  },
  
  next: () => {
    const tracks = ['sol', 'luna', 'mercurio', 'venus', ...];
    const currentIdx = tracks.indexOf(get().currentTrack || '');
    const nextIdx = (currentIdx + 1) % tracks.length;
    get().setCurrentTrack(tracks[nextIdx]);
  },
  
  previous: () => {
    const tracks = ['sol', 'luna', 'mercurio', 'venus', ...];
    const currentIdx = tracks.indexOf(get().currentTrack || '');
    const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    get().setCurrentTrack(tracks[prevIdx]);
  },
}));
```

**En FrequenciesPage.tsx:**
```tsx
const FrequenciesPage = () => {
  const { currentTrack, setCurrentTrack } = useAudioStore();

  // Escuchar cambios del mini reproductor
  useEffect(() => {
    const handleTrackChange = (e: CustomEvent) => {
      console.log('Track cambió a:', e.detail.track);
      // React automáticamente re-renderiza con nuevo currentTrack
    };
    
    window.addEventListener('audio-track-change', handleTrackChange);
    return () => window.removeEventListener('audio-track-change', handleTrackChange);
  }, []);

  return (
    <div>
      {frequencies.map((freq) => (
        <FrequencyCard
          key={freq.id}
          frequency={freq}
          isActive={currentTrack === freq.id} // ✅ Sincronizado
          onSelect={() => setCurrentTrack(freq.id)}
        />
      ))}
    </div>
  );
};
```

**En FloatingMiniPlayer.tsx:**
```tsx
const FloatingMiniPlayer = () => {
  const { currentTrack, next, previous, isPlaying } = useAudioStore();

  return (
    <div className="fixed bottom-4 right-4">
      <button onClick={previous}>⏮️ Atrás</button>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button onClick={next}>Siguiente ⏭️</button>
      
      <div className="text-xs text-purple-300">
        Reproduciendo: {currentTrack}
      </div>
    </div>
  );
};
```

**Testing:**
- [ ] Cambiar pista en mini reproductor actualiza /frecuencias
- [ ] Seleccionar en /frecuencias actualiza mini reproductor
- [ ] Siguiente/Atrás sincronizados correctamente
- [ ] Estado persiste al navegar entre páginas
- [ ] Visual feedback inmediato (<100ms)

---

## ✅ Checklist Final Sprints 4 & 5

### **Sprint 4: Carta Natal + Glosario**
- [ ] Tab chip "Carta Natal" visible en móvil
- [ ] Botón ⚙️ configuración visible en móvil
- [ ] Modal configuración funciona en móvil
- [ ] Sección "Sistema de Casas" visible en Glosario móvil
- [ ] Sección "Sistema de Coordenadas" visible en Glosario móvil
- [ ] Contenido completo en ambas secciones
- [ ] Testing en iPhone SE y Pixel 5
- [ ] 0 errores consola

### **Sprint 5: MiniPlayer**
- [ ] Barra volumen con 5 fases lunares implementada
- [ ] Animación suave entre fases (300ms)
- [ ] Efecto glow en fase activa
- [ ] Ondas de latido suaves (3 capas)
- [ ] Animación cubic-bezier fluida
- [ ] Audio Aire reproduce 15min completos
- [ ] 12 audios validados (duración correcta)
- [ ] Sincronización siguiente/atrás funciona
- [ ] Estado compartido entre mini reproductor y /frecuencias
- [ ] Testing en móvil y desktop
- [ ] Performance 60fps mantenido

---

## 📊 Resumen de Impacto

| Sprint | Issues | Features | Tiempo | Impacto |
|--------|--------|----------|--------|---------|
| **Sprint 4** | 4 bugs críticos | 0 | 2-3h | ALTO (funcionalidad) |
| **Sprint 5** | 2 bugs críticos | 2 features UX | 3-4h | MEDIO-ALTO (audio) |
| **Total** | 6 bugs | 2 features | 5-7h | ALTO |

---

**Status:** 📋 **PLANIFICADO** (Pendiente inicio después de Sprint 3)
