# 🚀 Migración de Google Drive a Supabase

## ✅ Lo que ya está listo:

1. ✅ Supabase instalado (`@supabase/supabase-js`)
2. ✅ Credenciales configuradas en `src/config/supabase.ts`
3. ✅ Tabla `charts` creada en Supabase con RLS (Row Level Security)
4. ✅ Servicio completo (`supabaseService.ts`) con métodos CRUD
5. ✅ Context nuevo (`SupabaseContext.tsx`) para autenticación
6. ✅ Modal de login/registro (`AuthModal.tsx`)

---

## 📋 Cómo completar la migración:

### **Paso 1: Reemplazar GoogleDriveContext por SupabaseContext**

Edita `src/App.tsx`:

**ANTES:**
```tsx
import { GoogleDriveWrapper } from './context/GoogleDriveContext';

<GoogleDriveWrapper>
  {/* ... */}
</GoogleDriveWrapper>
```

**DESPUÉS:**
```tsx
import { SupabaseProvider } from './context/SupabaseContext';

<SupabaseProvider>
  {/* ... */}
</SupabaseProvider>
```

---

### **Paso 2: Actualizar SavedChartsPage**

Edita `src/pages/SavedChartsPage.tsx`:

**ANTES:**
```tsx
import { useGoogleDrive } from '../context/GoogleDriveContext';

const { isAuthenticated, login, logout, userEmail } = useGoogleDrive();
```

**DESPUÉS:**
```tsx
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../services/supabaseService';
import AuthModal from '../components/AuthModal';

const { user, isAuthenticated, signOut, showAuthModal, setShowAuthModal } = useSupabase();
```

---

### **Paso 3: Cambiar botón de "Conectar Drive" por "Sincronizar"**

**ANTES:**
```tsx
<button onClick={login}>
  ☁️ Conectar con Drive
</button>
```

**DESPUÉS:**
```tsx
{!isAuthenticated ? (
  <button onClick={() => setShowAuthModal(true)}>
    🔐 Iniciar Sesión
  </button>
) : (
  <>
    <div>👤 {user?.email}</div>
    <button onClick={handleSync}>
      🔄 Sincronizar
    </button>
    <button onClick={signOut}>
      👋 Cerrar Sesión
    </button>
  </>
)}

{/* Modal de autenticación */}
{showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
```

---

### **Paso 4: Implementar sincronización**

Agrega esta función en `SavedChartsPage.tsx`:

```tsx
const handleSync = async () => {
  if (!isAuthenticated) {
    setShowAuthModal(true);
    return;
  }

  try {
    // Obtener cartas locales
    const localCharts = getSavedCharts();
    
    // Sincronizar con Supabase
    const { data: serverCharts, error } = await supabase.syncCharts(localCharts);
    
    if (error) {
      console.error('Error al sincronizar:', error);
      return;
    }

    // Actualizar estado local con cartas del servidor
    if (serverCharts) {
      // Aquí actualizas tu store/estado con serverCharts
      console.log('✅ Sincronización completa:', serverCharts.length, 'cartas');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### **Paso 5: Auto-sync al iniciar sesión**

En `SavedChartsPage.tsx`, agrega un `useEffect`:

```tsx
useEffect(() => {
  if (isAuthenticated) {
    handleSync(); // Sincronizar automáticamente al loguearse
  }
}, [isAuthenticated]);
```

---

## 🎯 Funcionalidades del nuevo sistema:

### **Autenticación:**
```tsx
const { user, isAuthenticated, signIn, signUp, signOut } = useSupabase();

// Registrar
await signUp('email@example.com', 'password123');

// Iniciar sesión
await signIn('email@example.com', 'password123');

// Cerrar sesión
await signOut();
```

### **Guardar carta:**
```tsx
import { supabase } from '../services/supabaseService';

await supabase.saveChart(chartData);
```

### **Obtener cartas:**
```tsx
const { data: charts, error } = await supabase.getCharts();
```

### **Eliminar carta:**
```tsx
await supabase.deleteChart(chartId);
```

### **Sincronizar:**
```tsx
const localCharts = getSavedCharts(); // Tus cartas locales
const { data: mergedCharts } = await supabase.syncCharts(localCharts);
```

---

## 🔒 Seguridad (Row Level Security):

- ✅ Cada usuario **solo ve sus propias cartas**
- ✅ No puede acceder a cartas de otros usuarios
- ✅ Las políticas RLS protegen la base de datos
- ✅ El `anon` key es seguro porque RLS filtra por `auth.uid()`

---

## 🎨 UX Mejorada:

1. **Modal bonito** para login/registro (sin popups externos)
2. **Sin problemas de cookies** (todo por API)
3. **Sincronización automática** al loguearse
4. **Feedback visual** (loading states, errores claros)
5. **Persistencia** de sesión (no te desloguea al recargar)

---

## 🚨 Eliminar archivos obsoletos (opcional):

Una vez que funcione todo con Supabase, puedes eliminar:

- `src/context/GoogleDriveContext.tsx`
- `src/services/googleDriveService.ts`
- `src/config/googleDrive.ts`
- `src/components/PopupBlockedAlert.tsx`
- `src/components/PopupWaitingIndicator.tsx`

---

## 📝 Testing:

1. **Registro**: Crea una cuenta nueva con email/password
2. **Login**: Inicia sesión con esa cuenta
3. **Guardar**: Guarda una carta (debería ir a Supabase)
4. **Sincronizar**: Click en "Sincronizar" para traer cartas del servidor
5. **Otro dispositivo**: Loguéate en otro navegador y verás las mismas cartas
6. **Logout**: Cierra sesión y verifica que no puedes acceder a las cartas

---

## 🆘 Troubleshooting:

### Error: "User not authenticated"
- Verifica que estés logueado: `isAuthenticated === true`
- Revisa la consola: debe aparecer "✅ Sesión restaurada"

### Error: "Permission denied"
- Verifica que las políticas RLS estén activas en Supabase
- Ve a Table Editor > charts > RLS debería estar ON

### No aparecen las cartas
- Verifica en Supabase Dashboard > Table Editor > charts
- Deberías ver las cartas con el `user_id` correcto

---

## 🎉 Ventajas vs Google Drive:

| Feature | Google Drive | Supabase |
|---------|-------------|----------|
| Setup | 😫 Complejo | 😊 Simple |
| OAuth | 🔴 Popups + cookies | 🟢 Email/password |
| Velocidad | 🐢 Lento | ⚡ Rápido |
| Debugging | 😵 Difícil | 🔍 Fácil |
| Cross-device | ✅ Sí | ✅ Sí |
| Offline | ❌ No | 🟡 Parcial |
| Costo | 🆓 Gratis | 🆓 Gratis (hasta 500MB) |

---

**¿Listo para migrar?** Dime si quieres que actualice los archivos automáticamente o prefieres hacerlo paso a paso.
