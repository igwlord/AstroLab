# 🌙 AstroLab - Deployment en Netlify

## 🚀 Deploy Automático

Este proyecto está configurado para hacer deploy automático en Netlify.

### Pasos para el Deploy:

#### Opción 1: Deploy desde GitHub (Recomendado)

1. **Ir a Netlify**: https://app.netlify.com
2. **Click en "Add new site" → "Import an existing project"**
3. **Conectar con GitHub** y seleccionar el repositorio `igwlord/AstroLab`
4. **Configuración automática** (ya detectará el `netlify.toml`):
   - Base directory: `zodioteca`
   - Build command: `npm run build`
   - Publish directory: `zodioteca/dist`
5. **Click en "Deploy site"**

¡Listo! El sitio se actualizará automáticamente con cada push a `main`.

#### Opción 2: Deploy Manual con CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Deploy desde la raíz del proyecto
cd zodioteca
npm run build
netlify deploy --prod
```

---

## ⚙️ Configuración del Proyecto

### Estructura:
```
AstroLab/
├── netlify.toml          # Configuración de Netlify
└── zodioteca/            # Aplicación React
    ├── public/
    │   ├── _redirects    # Redirecciones SPA
    │   └── media/        # Audios de frecuencias
    ├── src/
    └── dist/             # Build generado
```

### Variables de Entorno (si las necesitas):

Si en el futuro necesitas variables de entorno:

1. Ve a **Site settings → Environment variables** en Netlify
2. Agrega las variables necesarias
3. En local, usa `.env` (ya está en `.gitignore`)

---

## 🎯 Features del Deploy

✅ **Auto-deploy** desde GitHub  
✅ **HTTPS** automático  
✅ **CDN** global  
✅ **Redirects** para SPA  
✅ **Cache** optimizado para assets  
✅ **Headers** de seguridad  
✅ **Audios** de frecuencias incluidos  

---

## 📊 Build Stats Esperados

- **Tiempo de build**: ~2-3 minutos
- **Tamaño del bundle**: ~500KB (sin contar audios)
- **Audios**: ~140MB (cachéados eficientemente)

---

## 🔧 Troubleshooting

### Si el build falla:

1. **Verificar Node version**: Debe ser 18+
2. **Limpiar cache**:
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```
3. **Verificar logs** en Netlify Dashboard

### Si las rutas no funcionan:

- El archivo `_redirects` debe estar en `public/`
- El `netlify.toml` debe tener la configuración de redirects

---

## 🌐 URLs del Proyecto

- **GitHub**: https://github.com/igwlord/AstroLab
- **Netlify**: (Se generará después del primer deploy)

---

## 📝 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

---

## 🎨 Características de la App

- 🌙 **Carta Natal** con cálculos astronómicos reales
- 📍 **30+ ciudades** argentinas (GBA completo)
- 🗺️ **23 provincias** con coordenadas automáticas
- 📄 **Export a PDF** de cartas natales
- 🎵 **11 frecuencias** holísticas (174-963 Hz)
- 📚 **Glosario** astrológico completo
- 🌍 **Multi-idioma** (ES/EN)
- 🎨 **Tema claro/oscuro**
- 💫 **Sin registro** (modo demo)

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**
