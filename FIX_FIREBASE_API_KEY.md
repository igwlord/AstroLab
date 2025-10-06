# 🔧 FIX: Error API Key Firebase

## ❌ Error Actual

```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

Este error significa que Firebase no puede validar la API key. Esto sucede por una de estas razones:

1. **El proyecto de Firebase no está completamente configurado**
2. **Las restricciones de la API Key son muy estrictas**
3. **Falta habilitar servicios necesarios**

---

## ✅ SOLUCIÓN: Configurar Correctamente Firebase

### PASO 1: Verificar Configuración del Proyecto

1. Ve a: https://console.firebase.google.com/
2. Selecciona el proyecto: **astrlab-web**
3. Click en ⚙️ (Settings) → **Project settings**
4. En la sección "Your apps", verifica que la **Web app** esté creada

### PASO 2: Obtener Nueva Configuración (Recomendado)

1. En **Project settings** → **General**
2. Scroll down a "Your apps"
3. Si ya existe una web app:
   - Click en el ícono de configuración (</>) 
   - Copia la nueva configuración
4. Si NO existe:
   - Click "Add app" → Web
   - Registra la app: "zodioteca"
   - Copia la configuración que aparece

### PASO 3: Reemplazar la Configuración

La configuración se ve así:

```javascript
const firebaseConfig = {
  apiKey: "TU-NUEVA-API-KEY",
  authDomain: "astrlab-web.firebaseapp.com",
  projectId: "astrlab-web",
  storageBucket: "astrlab-web.firebasestorage.app",
  messagingSenderId: "1075027815076",
  appId: "TU-NUEVO-APP-ID",
  measurementId: "G-XXXXXXX"
};
```

**Copia TODOS los valores nuevos** y reemplázalos en:
`zodioteca/src/services/firebase.ts`

### PASO 4: Verificar API Key en Google Cloud

1. Ve a: https://console.cloud.google.com/
2. Selecciona el proyecto: **astrlab-web**
3. Menú lateral → **APIs & Services** → **Credentials**
4. Busca la API Key que empieza con `AIzaSyA5AuCUCp...`
5. Click en ella para editarla

#### Verificar Restricciones:

**API restrictions:**
- Debería estar en: "Don't restrict key" (para desarrollo)
- O tener estas APIs habilitadas:
  - Identity Toolkit API
  - Token Service API
  - Firebase Authentication API

**Application restrictions:**
- HTTP referrers (web sites)
- Agregar:
  - `http://localhost:5173/*`
  - `http://127.0.0.1:5173/*`
  - `https://astrlab-web.firebaseapp.com/*`
  - `https://astrlab-web.web.app/*`

### PASO 5: Habilitar Identity Toolkit API

1. En Google Cloud Console
2. Menú → **APIs & Services** → **Library**
3. Buscar: "Identity Toolkit API"
4. Click en **Identity Toolkit API**
5. Click **ENABLE** (si no está habilitado)

### PASO 6: Verificar Authentication Habilitado

1. En Firebase Console: https://console.firebase.google.com/
2. Proyecto: **astrlab-web**
3. Menú lateral → **Authentication**
4. Si dice "Get started", click en ese botón
5. Tab **Sign-in method**
6. Habilitar **Google** (si no está habilitado)
7. Agregar un **Support email** (requerido)

---

## 🔄 SOLUCIÓN ALTERNATIVA INMEDIATA

### Mientras corriges Firebase: USA MODO ANÓNIMO

El modo anónimo funciona sin problemas:

1. En la página de login, click en:
   ```
   🌟 Probar en modo anónimo
   ```

2. Entrarás inmediatamente al Dashboard

3. **Limitaciones del modo anónimo:**
   - ✅ Puedes usar todas las funcionalidades
   - ✅ Datos se guardan en localStorage
   - ❌ NO se sincronizan en la nube
   - ❌ Se pierden si limpias el navegador

---

## 🧪 DESPUÉS DE CONFIGURAR FIREBASE

### Probar Google Login:

1. Asegúrate de tener la nueva configuración en `firebase.ts`
2. Recarga la página (Ctrl+Shift+R)
3. Click "Continuar con Google"
4. Debería redirigir sin errores

### Logs Esperados (Éxito):

```
🔵 Iniciando login con Google...
(Redirige a Google)
(Vuelves de Google)
✅ Usuario autenticado via redirect: tu@gmail.com
```

### Si Aún Falla:

Copia y pega:
1. El error completo de la consola
2. La URL del proyecto en Firebase Console
3. Tu nueva configuración de Firebase (SIN la API key por seguridad)

---

## 📋 CHECKLIST DE VERIFICACIÓN

Antes de probar Google Login, verifica:

- [ ] Web app registrada en Firebase Console
- [ ] API Key sin restricciones (o con las correctas)
- [ ] Identity Toolkit API habilitada en Google Cloud
- [ ] Authentication habilitado en Firebase Console
- [ ] Google sign-in method habilitado
- [ ] Support email configurado
- [ ] `localhost` en dominios autorizados
- [ ] Nueva configuración copiada a `firebase.ts`

---

## 🎯 ACCIÓN INMEDIATA

**Por ahora, usa el MODO ANÓNIMO** para seguir trabajando:

1. Click en "🌟 Probar en modo anónimo"
2. Entras al Dashboard
3. Mientras tanto, configura Firebase correctamente
4. Después podrás usar Google Login

**El modo anónimo funciona perfectamente para desarrollo.**
