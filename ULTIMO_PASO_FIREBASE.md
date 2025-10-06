# ✅ API Key Actualizada - Pasos Finales

## ✅ Completado

- ✅ Identity Toolkit API habilitada
- ✅ API Key actualizada en el código: `AIzaSyBH6LnVh0FHd_7wKcoPdeaKrp5cAbJHRYM`
- ✅ API Key sin restricciones (puede llamar a cualquier API)

## 🔧 PASO FINAL: Agregar Localhost a Restricciones de Sitios Web

Según la imagen que compartiste, necesitas agregar los dominios en "Restricciones de sitios web".

### 1. En Google Cloud Console (donde estás ahora):

En la sección **"Restricciones de sitios web"**, haz click en **"Añad"** (Add) y agrega estas URLs:

```
http://localhost:5173/*
http://127.0.0.1:5173/*
https://astrlab-web.firebaseapp.com/*
https://astrlab-web.web.app/*
```

**Importante:** Cada URL debe terminar con `/*` para permitir todas las rutas.

### 2. Click en "Guardar"

Espera 1-2 minutos para que los cambios se propaguen.

---

## 🧪 PROBAR GOOGLE LOGIN

Después de guardar las restricciones:

1. **Recarga la página de tu app**: `Ctrl+Shift+R`
2. **Abre la consola**: `F12`
3. **Click en "Continuar con Google"**

### Logs Esperados (Éxito):

```
🔵 Iniciando login con Google...
(Redirige a accounts.google.com)
(Vuelves automáticamente)
🔵 Verificando resultado de redirect...
✅ Usuario autenticado via redirect: tu@gmail.com
✅ Settings guardados en la nube
🔵 [Auth] Estado cambió: tu@gmail.com
```

### Si Funciona:

✅ Verás el Dashboard con tu nombre y foto de Google
✅ Tus configuraciones se guardarán en la nube
✅ Podrás acceder desde cualquier dispositivo

---

## ⚠️ Si AÚN da Error

### Error Posible: "Origin not allowed"

Si ves este error después de agregar las URLs:

1. Verifica que agregaste exactamente:
   - `http://localhost:5173/*` (con `/*` al final)
   - `http://127.0.0.1:5173/*`

2. Espera 2-3 minutos para que se propague

3. Limpia caché del navegador:
   - F12 → Console
   - Click derecho en Reload
   - "Empty Cache and Hard Reload"

### Error: "Popup blocked"

No debería pasar porque usamos redirect, pero si pasa:
- El modo anónimo siempre funciona como respaldo

---

## 📋 CHECKLIST FINAL

Verifica que tengas TODO esto configurado:

### En Google Cloud Console (donde estás):
- [x] Identity Toolkit API: **Habilitada** ✅
- [x] API Key actualizada: `AIzaSyBH6...` ✅
- [ ] Sitios web agregados en restricciones:
  - [ ] `http://localhost:5173/*`
  - [ ] `http://127.0.0.1:5173/*`
  - [ ] `https://astrlab-web.firebaseapp.com/*`
  - [ ] `https://astrlab-web.web.app/*`
- [ ] Click en **"Guardar"**

### En Firebase Console:
- [x] Authentication habilitado
- [x] Google sign-in method habilitado
- [x] localhost en dominios autorizados (ya lo tienes)

---

## 🎯 ACCIÓN INMEDIATA

1. **Agrega las 4 URLs** en "Restricciones de sitios web"
2. **Click "Guardar"**
3. **Espera 1-2 minutos**
4. **Recarga tu app** (Ctrl+Shift+R)
5. **Prueba "Continuar con Google"**

Si todo está bien, debería funcionar perfectamente.

---

## 🚀 MIENTRAS TANTO

Si quieres empezar a usar la app YA:

```
Click en "🌟 Probar en modo anónimo"
```

Funciona al 100% y puedes configurar Firebase en paralelo.

---

## 📝 RESUMEN

**Completado:**
- ✅ API Key actualizada en el código
- ✅ Identity Toolkit API habilitada

**Falta:**
- ⏳ Agregar URLs en restricciones (1 minuto)
- ⏳ Guardar y esperar propagación (1-2 minutos)
- ⏳ Probar login

**Tiempo estimado para completar:** 3-5 minutos

🎉 **Estás a solo un paso de tener Google Login funcionando!**
