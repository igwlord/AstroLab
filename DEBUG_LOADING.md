# 🐛 DEBUG: Loading Infinito

## Problema
Después del redirect de Google, la app se queda en estado "loading" con el spinner infinitamente.

## Causa Probable
`onAuthChange` (Firebase Auth observer) no se está disparando correctamente después del redirect.

## Logs a Verificar

Abre la consola del navegador (F12) y busca estos logs **en orden**:

### 1. Al Cargar la Página (después del redirect)
```
🔵 [AuthContext] Inicializando auth...
🔵 [AuthContext] Verificando redirect result...
🔵 [Firebase] Verificando redirect result...
🔵 [Firebase] getRedirectResult response: {...}
```

### 2. Si hay usuario del redirect
```
✅ [Firebase] Redirect result tiene usuario: tu@gmail.com
🔵 [Firebase] Creando/actualizando documento de usuario...
✅ [Firebase] Google Sign-In (redirect) successful: tu@gmail.com
✅ [AuthContext] Usuario logueado via redirect: tu@gmail.com
```

### 3. El observer debe dispararse
```
🔵 [AuthContext] onAuthChange disparado: tu@gmail.com
✅ [AuthContext] Usuario configurado: tu@gmail.com
🔵 [AuthContext] Cargando settings desde la nube...
🔵 [AuthContext] Configurando isLoading = false
```

## ⚠️ Si Falta Alguno de Estos Logs

### Falta onAuthChange
Si ves los logs del redirect pero NO ves "onAuthChange disparado":
- El Firebase Auth observer no se está inicializando correctamente
- Puede ser un problema de timing

### getRedirectResult devuelve null
Si ves:
```
🔵 [Firebase] No hay redirect result
🔵 [AuthContext] No hay redirect result
```
Pero SÍ acabas de volver de Google, significa que:
- Firebase no detectó el redirect
- Los parámetros de la URL se perdieron
- Hay un problema con el dominio autorizado

### Error en Firestore
Si ves error al crear el documento:
```
❌ [Firebase] Error handling redirect result: ...
```
Las reglas de Firestore pueden estar rechazando la escritura.

## 🔧 Solución Temporal (Testing)

Si quieres probar sin el problema, puedes temporalmente:

1. **Forzar que loading sea false después de 3 segundos**
2. **Usar modo anónimo** (el botón morado) que no tiene estos problemas
3. **Limpiar caché y cookies** del navegador

## 📋 Información Necesaria

Para ayudarte mejor, necesito que copies y pegues:

1. **TODOS los logs de la consola** desde que se carga la página
2. **La URL completa** después de volver de Google (debe tener ?state=...&code=...)
3. **Errores en rojo** (si hay alguno)
4. **Estado del loading**:
   - Abre la consola
   - En la pestaña "Console", escribe: `window.__AUTH_STATE__`
   - Presiona Enter
   - Copia el resultado

## 🎯 Próximo Paso

**Abre la consola (F12) y copia TODO lo que aparece**, especialmente los logs con 🔵 🔄 ✅ ❌
