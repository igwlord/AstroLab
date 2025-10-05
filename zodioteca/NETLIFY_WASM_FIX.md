# 🚀 Configuración Netlify para Swiss Ephemeris WASM

## 🐛 Problema Encontrado

En Netlify, la app mostraba el siguiente error:
```
wasm streaming compile failed: TypeError: WebAssembly: Response has 
unsupported MIME type 'text/html; charset=utf-8' expected 'application/wasm'
```

**Causa raíz**: 
1. Netlify estaba sirviendo archivos `.wasm` con el Content-Type incorrecto
2. El archivo `_redirects` estaba capturando TODOS los paths (incluyendo `.wasm` y `.data`)
3. Los archivos WASM eran redirigidos a `index.html` en lugar de ser servidos directamente

## ✅ Solución Implementada

### 1. **netlify.toml** (Configuración Principal)
```toml
# Headers para archivos WASM
[[headers]]
  for = "/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
    Cache-Control = "public, max-age=31536000, immutable"

# Headers para archivos .data
[[headers]]
  for = "/*.data"
  [headers.values]
    Content-Type = "application/octet-stream"
    Cache-Control = "public, max-age=31536000, immutable"

# Headers de seguridad para WASM
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
```

### 2. **public/_headers** (Respaldo)
Archivo de headers que se copia a `dist/_headers` durante el build.
```
/*.wasm
  Content-Type: application/wasm

/*.data
  Content-Type: application/octet-stream
```

### 3. **public/_redirects** (Exclusiones Críticas)
```
# ⚠️ IMPORTANTE: Excluir WASM antes del redirect SPA
/*.wasm    200
/*.data    200
/assets/*.wasm    200
/assets/*.data    200

# SPA redirect para todo lo demás
/*    /index.html   200
```

**Orden importa**: Las reglas se evalúan de arriba hacia abajo. Los archivos WASM deben estar ANTES del wildcard `/*`.

## 📁 Estructura de Archivos en Producción

```
dist/
├── _headers              # Headers de Netlify
├── _redirects            # Reglas de redirect
├── swisseph.wasm         # 541 KB (raíz)
├── swisseph.data         # 12.08 MB (raíz)
├── assets/
│   ├── swisseph-BkUvWBEB.wasm    # 541 KB (con hash)
│   └── swisseph-qCB3Dpzs.data    # 12.08 MB (con hash)
└── index.html
```

Los archivos están duplicados (con y sin hash) para máxima compatibilidad.

## 🔍 Verificación

### Headers Correctos:
```bash
curl -I https://astrolab-web.netlify.app/assets/swisseph-BkUvWBEB.wasm
```
Debería retornar:
```
HTTP/2 200
content-type: application/wasm
cross-origin-embedder-policy: require-corp
cross-origin-opener-policy: same-origin
cache-control: public, max-age=31536000, immutable
```

### No Redirect a HTML:
Los archivos `.wasm` y `.data` deben retornar `200` directamente, no `200` desde `index.html`.

## 🚨 Errores Comunes

### ❌ Error 1: Content-Type incorrecto
```
Content-Type: text/html  ← MAL
Content-Type: application/wasm  ← BIEN
```

### ❌ Error 2: Orden incorrecto en _redirects
```
# ❌ MAL - wildcard primero
/*    /index.html   200
/*.wasm    200

# ✅ BIEN - específico primero
/*.wasm    200
/*    /index.html   200
```

### ❌ Error 3: Headers CORS faltantes
```
# ⚠️ Sin estos headers, WASM puede fallar
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

## 📝 Checklist de Deploy

- [x] `netlify.toml` en raíz del proyecto
- [x] `public/_headers` con Content-Type correcto
- [x] `public/_redirects` con exclusiones WASM primero
- [x] Archivos `.wasm` y `.data` en `public/`
- [x] Build genera `dist/_headers` y `dist/_redirects`
- [x] Archivos WASM en `dist/` y `dist/assets/`
- [ ] Verificar headers en producción con `curl -I`
- [ ] Probar carga de WASM en navegador (sin errores)
- [ ] Verificar cálculos funcionan correctamente

## 🔗 Referencias

- [Netlify Headers](https://docs.netlify.com/routing/headers/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)
- [WebAssembly MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#webassembly)
- [COOP/COEP for SharedArrayBuffer](https://web.dev/coop-coep/)

## 🎯 Resultado Esperado

Después del deploy con estas configuraciones:
- ✅ Archivos WASM se cargan correctamente
- ✅ No hay errores de "unsupported MIME type"
- ✅ Cálculos de Swiss Ephemeris funcionan
- ✅ Precisión de 0.02-0.07° mantenida

---
**Fecha**: 5 de enero de 2025  
**Status**: ✅ CONFIGURADO - Listo para Deploy
