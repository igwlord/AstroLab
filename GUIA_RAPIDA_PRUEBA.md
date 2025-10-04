# 🚀 GUÍA RÁPIDA - Probar el Nuevo Formulario AHORA

## ⚡ Acceso Rápido (3 pasos)

### 1️⃣ Abre el navegador en:
```
http://localhost:5174
```

### 2️⃣ Login (si es necesario)
- Usuario: tu@email.com
- Password: (tu contraseña)

### 3️⃣ Click en la tarjeta VERDE:
```
┌────────────────────────────────────┐
│ ✨ Nueva Carta Natal       [NUEVO] │
│                                     │
│ Formulario mejorado estilo astro.com│
│                                     │
│  [✨ Calcular con nuevo formulario] │
└────────────────────────────────────┘
```

---

## 🎯 Datos de Prueba Rápida

Copia y pega estos datos para probar rápidamente:

### 📝 Datos Personales
```
Nombre: Juan Pérez
Apellido: (opcional)
Género: Hombre ♂️
☑ Esta carta es para mí
```

### 📅 Fecha y Hora
```
Día: 16
Mes: Octubre
Año: 1988
Hora: 17
Minutos: 50
Precisión: ⏰ Exacta
```

### 📍 Ubicación
```
País: Argentina
Región/Provincia: Buenos Aires
Ciudad: Buenos Aires (CABA)
  → Seleccionar de la lista que aparece
Barrio: Palermo (opcional)
```

### ⚙️ Configuración (opcional)
```
Click en "⚙️ Configuración Avanzada" para ver:
- Sistema de casas: Placidus
- Asteroides (activar algunos)
- Orbe de aspectos: 6°
```

### ✨ Calcular
```
Click en: [✨ Calcular Carta Natal]
```

---

## 🎨 Lo que verás

### Formulario (Antes de calcular)
```
╔═══════════════════════════════════════════╗
║  ✨ Nueva Carta Natal                    ║
║  Ingresa los datos de nacimiento...       ║
╚═══════════════════════════════════════════╝

┌───────────────────────────────────────────┐
│ 👤 Datos Personales                       │
│ [Nombre___________] [Apellido__________]  │
│ ○ ♀️ Mujer  ● ♂️ Hombre  ○ ⚧ Otro       │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ 📅 Fecha y Hora de Nacimiento             │
│ [16] [Octubre▼] [1988]                    │
│ Precisión: ● Exacta  ○ Aprox  ○ Desconocida│
│ [17] : [50]                                │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ 📍 Ubicación         [🗺️ Coords manuales] │
│ [Argentina▼]                               │
│ [Buenos Aires▼]                            │
│ [Buenos Aires (CABA)___________]           │
│ ┌──────────────────────────────┐          │
│ │ 🕐 Zona horaria detectada:   │          │
│ │ America/Argentina/Buenos_Aires│         │
│ └──────────────────────────────┘          │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ ⚙️ Configuración Avanzada           [▼]  │
│ (Click para expandir)                      │
└───────────────────────────────────────────┘

  [Cancelar] [✨ Calcular Carta Natal]
```

### Resultados (Después de calcular)
```
╔═══════════════════════════════════════════╗
║ Carta Natal de Juan Pérez                 ║
║ 📅 16 de octubre de 1988, 17:50           ║
║ 📍 Buenos Aires (CABA)                    ║
║          [💾 Guardar] [✨ Nueva Carta]    ║
╚═══════════════════════════════════════════╝

┌─────────────┬─────────────┬─────────────┐
│   ☀️ SOL    │   🌙 LUNA   │ ⬆️ ASCEND.  │
│             │             │             │
│  Libra      │ Capricornio │   Aries     │
│  23.71°     │   2.80°     │   9.66°     │
│  Casa 7     │  Casa 10    │  Casa 1     │
│             │             │             │
│ Tu esencia  │ Emociones   │ Tu máscara  │
└─────────────┴─────────────┴─────────────┘

┌───────────────────────────────────────────┐
│ 🪐 Planetas                                │
│ Sol      Libra       23.71°   Casa 7      │
│ Luna     Capricornio  2.80°   Casa 10     │
│ Mercurio Libra       12.70°   Casa 7  ℞   │
│ Venus    Virgo       14.38°   Casa 6      │
│ ...                                        │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ 🏠 Casas                                   │
│ Casa 1: Aries 9.66°                        │
│ Casa 2: Tauro 10.12°                       │
│ Casa 3: Géminis 8.45°                      │
│ ...                                        │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ ✨ Aspectos                                │
│ Sol ⚹ Conjunción ⚹ Mercurio (11.01°)     │
│ Luna ⚹ Oposición ⚹ Marte (7.20°)         │
│ ...                                        │
└───────────────────────────────────────────┘
```

---

## 🎮 Funciones a Probar

### 1. Cascada de Ubicación
```
1. Selecciona País: Argentina
   → Se cargan regiones automáticamente
2. Selecciona Región: Buenos Aires
   → Se habilita búsqueda de ciudades
3. Escribe en Ciudad: "bue"
   → Aparece lista con Buenos Aires (CABA)
4. Click en ciudad
   → Se rellenan coordenadas automáticas
   → Aparece timezone detectado
```

### 2. Coordenadas Manuales
```
1. Click en "🗺️ Coordenadas manuales"
2. Ingresar:
   Latitud: -34.6037
   Longitud: -58.3816
3. Ver timezone detectado automáticamente
```

### 3. Precisión de Hora
```
Probar cada opción:

● Exacta
  → Inputs de hora activos
  → Hora se guarda exacta

● Aproximada
  → Inputs activos
  → Se redondea a 15 min (ej: 17:47 → 17:45)

● Desconocida
  → Inputs deshabilitados
  → Se usa 12:00 por defecto
```

### 4. Configuración Avanzada
```
1. Click en "⚙️ Configuración Avanzada ▼"
2. Cambiar sistema de casas
3. Activar algunos asteroides
4. Ajustar orbe con slider
5. Activar/desactivar aspectos
6. Ver que se guarda todo
```

### 5. Persistencia
```
1. Rellenar mitad del formulario
2. Recargar página (F5)
3. Ver que los datos están guardados
4. Completar y calcular
5. Ver que el draft se limpió
```

### 6. Guardar Carta
```
1. Después de calcular
2. Click en "💾 Guardar"
3. Modal aparece
4. Agregar notas (opcional)
5. Click "Guardar"
6. Ver mensaje de éxito
```

---

## 🎯 Comparación Visual

### Dashboard - Antes
```
┌─────────────────────┐
│ 🎯 Carta Natal      │
│ Calcula tu carta... │
│ [Calcular Carta]    │
└─────────────────────┘
```

### Dashboard - Ahora
```
┌─────────────────────┐  ┌────────────────────────┐
│ 🎯 Carta Natal      │  │ ✨ Nueva Carta [NUEVO] │
│ Calcula tu carta... │  │ Formulario mejorado... │
│ [Calcular Carta]    │  │ [✨ Calcular nuevo]    │
└─────────────────────┘  └────────────────────────┘
    (Morado)                    (Verde)
```

---

## 🐛 Si algo no funciona

### No veo la tarjeta verde
```
Solución: Recargar página (Ctrl+R o F5)
```

### No aparecen ciudades
```
Causa: Mock tiene datos limitados
Solución: Usar solo países disponibles:
- Argentina (AR)
- España (ES)
- México (MX)
- Colombia (CO)
- Chile (CL)
- Perú (PE)
- Estados Unidos (US)
```

### Timezone no se detecta
```
Solución: 
1. Asegurarse de seleccionar ciudad (no solo escribir)
2. O usar toggle "Manual" para forzar
```

### Validación bloquea el botón
```
Solución: Ver mensajes de error en rojo
Campos requeridos:
- Nombre
- País
- Día, Mes, Año válidos
```

---

## ⚡ Shortcuts de Teclado

```
Tab          → Navegar entre campos
Enter        → Enviar formulario (si es válido)
Escape       → Cerrar acordeón de config avanzada
↑ ↓          → Navegar en selects
```

---

## 🎊 ¡A Probar!

Todo está listo. Solo necesitas:

1. **Abrir**: http://localhost:5174
2. **Click**: Tarjeta verde "✨ Nueva Carta Natal"
3. **Rellenar**: Usar datos de prueba de arriba
4. **Calcular**: Ver los resultados

---

## 📸 Screenshot Rápido

```
┌─────────────────────────────────────────────┐
│  🌐 localhost:5174                          │
├─────────────────────────────────────────────┤
│                                             │
│  Bienvenido, Usuario                        │
│  Explora tu cosmos interior                 │
│                                             │
│  ┌─────────────┐  ┌─────────────────────┐ │
│  │ 🎯 Carta    │  │ ✨ Nueva Carta      │ │
│  │    Natal    │  │    [NUEVO]          │ │
│  │             │  │                     │ │
│  │  [Calcular] │  │ [✨ Nuevo Form]    │ │ ← CLICK AQUÍ
│  └─────────────┘  └─────────────────────┘ │
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │ 📚 Glosario │  │ 🎵 Frecuenc.│         │
│  └─────────────┘  └─────────────┘         │
│                                             │
└─────────────────────────────────────────────┘
```

---

**¡Disfruta el nuevo formulario!** ✨

Si tienes dudas, consulta:
- `FORMULARIO_NATAL.md` - Documentación completa
- `INTEGRACION_COMPLETADA.md` - Detalles técnicos
