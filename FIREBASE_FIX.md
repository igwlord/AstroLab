# 🚨 FIX CRÍTICO - Google Sign-In Popup Se Cierra Solo

## 🔍 Diagnóstico del Problema

El popup de Google se cierra automáticamente porque **el dominio localhost no está autorizado en Firebase Console**.

Firebase rechaza el popup si el dominio no está en la whitelist, causando el error `auth/popup-closed-by-user` incluso si el usuario acepta.

---

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **astrlab-web**

### Paso 2: Autorizar el Dominio Localhost
1. En el menú lateral, ve a **Authentication**
2. Click en la pestaña **Settings** (Configuración)
3. Busca la sección **Authorized domains** (Dominios autorizados)
4. Click en **Add domain** (Agregar dominio)
5. Agrega estos dominios:
   - `localhost`
   - `127.0.0.1`
   - Tu dominio de producción si lo tienes

### Paso 3: Verificar Método de Login
1. En **Authentication > Sign-in method**
2. Asegúrate que **Google** esté **Enabled** (habilitado)
3. Verifica que el **Project support email** esté configurado

---

## 🧪 Probar Después del Fix

```bash
# 1. Reiniciar el dev server
cd zodioteca
npm run dev

# 2. Abrir en navegador con consola
# http://localhost:5173

# 3. Click en "Continuar con Google"
# Ahora el popup debería funcionar correctamente
```

---

## 📊 Logs Esperados (Exitosos)

```
🔵 [LoginPage] Botón clickeado
🔵 [AuthContext] loginWithGoogle llamado
🔵 [Firebase] Iniciando Google Sign-In... con popup
🔵 [Firebase] Abriendo popup de Google...
✅ [Firebase] Popup cerrado con éxito
✅ [Firebase] Usuario recibido: tu-email@gmail.com
🔵 [Firebase] Procesando usuario...
✅ Google Sign-In successful: tu-email@gmail.com
✅ [AuthContext] Login exitoso, cargando settings...
```

---

## 🔧 Cambios en el Código

### 1. firebase.ts - Más logging y configuración mejorada
```typescript
// Configuración mejorada del provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
  display: 'popup'
});
googleProvider.addScope('profile');
googleProvider.addScope('email');
```

### 2. AuthContext.tsx - Evitar múltiples llamadas
```typescript
// CRÍTICO: Evitar múltiples llamadas simultáneas
if (isLoading) {
  console.log('⚠️ Ya hay un login en progreso');
  return { success: false, error: 'Login en progreso' };
}
```

### 3. LoginPage.tsx - Protección contra doble click
```typescript
const [isProcessing, setIsProcessing] = useState(false);

// Evitar doble click
if (isProcessing || loading) {
  return;
}
```

---

## ⚠️ Si Aún No Funciona

### Opción A: Usar Redirect en lugar de Popup
En `firebase.ts`, cambia la línea 46:
```typescript
// Forzar redirect siempre
const result = await signInWithGoogle(true); // true = usar redirect
```

### Opción B: Verificar Firestore Rules
En Firebase Console > Firestore Database > Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Opción C: Limpiar caché del navegador
1. Abre DevTools (F12)
2. Click derecho en el botón Reload
3. "Empty Cache and Hard Reload"

---

## 🎯 Siguiente Paso

**¡CONFIGURA LOS DOMINIOS EN FIREBASE CONSOLE!**

Después de configurar los dominios autorizados, el login debería funcionar perfectamente.
