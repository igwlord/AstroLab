# 🌟 Sistema de Favoritos con Sync Cross-Device

## ✅ ¿Qué se implementó?

### 📱 **Sincronización Automática entre Dispositivos**

Tu sistema de favoritos ahora se sincroniza automáticamente entre PC y celular cuando inicias sesión con Supabase.

**Características:**
- ✅ **Auto-sync al login**: Se sincroniza automáticamente al iniciar sesión
- ✅ **Auto-save**: Cada favorito se guarda automáticamente en la nube
- ✅ **Merge inteligente**: Si tienes favoritos en PC y celular, se combinan (el más reciente gana)
- ✅ **Funciona offline**: Guarda local primero, sync después
- ✅ **Zero-config**: No necesitas hacer nada, funciona automáticamente

---

## 🚀 Cómo activar el sync

### **Paso 1: Ejecutar el SQL en Supabase**

1. Ve a tu dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto **AstroLab**
3. Ve a **"SQL Editor"** (icono de terminal)
4. Crea una nueva query (botón **"New query"**)
5. Abre el archivo `supabase-favorites-schema.sql` que está en la raíz de tu proyecto
6. Copia **TODO** el contenido y pégalo en el editor
7. Ejecuta con el botón **"Run"** (o Ctrl+Enter)
8. Deberías ver: ✅ **"Success. No rows returned"**

### **Paso 2: Verificar que funciona**

1. **En PC**:
   - Abre tu app en el navegador
   - Inicia sesión con tu cuenta de Supabase
   - Agrega algunos favoritos (estrellitas ⭐)
   - Mira la consola del navegador (F12), deberías ver:
     ```
     🔄 Iniciando sync de favoritos...
     ✅ Favoritos sincronizados
     ✅ Favorito guardado en cloud: [nombre]
     ```

2. **En Celular**:
   - Abre la app en el navegador del celular
   - Inicia sesión con la MISMA cuenta
   - Espera 1-2 segundos
   - ¡Deberías ver TODOS tus favoritos de PC! 🎉

---

## 📋 ¿Cómo funciona el sistema?

### **Flujo de sincronización:**

```
┌─────────────┐
│   LOGIN     │
│  Supabase   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Auto-Sync (1 segundo)  │
│  ├─ Obtener de cloud    │
│  ├─ Merge con local     │
│  └─ Subir cambios       │
└─────────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Favoritos combinados   │
│  PC + Celular = ✨      │
└─────────────────────────┘
```

### **Auto-save en cada acción:**

```typescript
// Al agregar favorito ⭐
add() → localStorage → Supabase ✅

// Al eliminar favorito 🗑️
remove() → localStorage → Supabase ✅

// Al anclar/desanclar 📌
togglePin() → localStorage → Supabase ✅

// Al usar desde favoritos 👆
touch() → actualiza lastUsedAt → Supabase ✅
```

---

## 🔍 Debugging

### **Ver logs en consola:**

Abre la consola del navegador (F12) y busca estos mensajes:

```
✅ Sesión iniciada: tu@email.com
🔄 Iniciando sync de favoritos...
✅ Favoritos sincronizados: { added: 0, updated: 0 }
✅ Favorito guardado en cloud: Aries
```

### **Ver datos en Supabase:**

1. Ve a **Table Editor** en tu dashboard
2. Selecciona la tabla **`favorites`**
3. Deberías ver tus favoritos con estos campos:
   - `favorite_id`: ID del favorito
   - `title`: Nombre (ej: "Aries", "Mars")
   - `type`: Tipo (ej: "glossary-sign", "planet")
   - `last_used_at`: Última vez usado
   - `pinned`: Si está anclado

### **Errores comunes:**

❌ **"No se pudo guardar en cloud"**
- Verifica que ejecutaste el SQL en Supabase
- Verifica que estás logueado
- Revisa permisos RLS en Supabase

❌ **"No sync entre dispositivos"**
- Verifica que usas la MISMA cuenta en ambos
- Espera 1-2 segundos después del login
- Revisa la consola por errores

---

## 📊 Estructura de datos

### **Local (localStorage):**
```typescript
{
  "favorites-v2": {
    "items": {
      "glossary-sign_aries": {
        "id": "glossary-sign_aries",
        "type": "glossary-sign",
        "title": "Aries",
        "icon": "♈",
        "route": "/glossary?categoria=signos#sign-aries",
        "targetId": "aries",
        "scope": "global",
        "tags": ["fuego", "cardinal"],
        "pinned": false,
        "createdAt": 1728739200000,
        "lastUsedAt": 1728739500000
      }
    }
  }
}
```

### **Cloud (Supabase):**
```sql
| id | user_id | favorite_id | type | title | ... |
|----|---------|-------------|------|-------|-----|
| uuid | user123 | glossary-sign_aries | glossary-sign | Aries | ... |
```

---

## ✨ Ventajas del sistema

### **Para el usuario:**
- ✅ Favoritos sincronizados automáticamente
- ✅ Sin configuración manual
- ✅ Funciona offline (guarda local primero)
- ✅ No pierde datos si borra el navegador

### **Para el desarrollador:**
- ✅ Auto-save no bloqueante (Promise.catch)
- ✅ Merge inteligente por `lastUsedAt`
- ✅ RLS de Supabase protege datos
- ✅ Código simple y mantenible

---

## 🎯 Próximos pasos (opcionales)

- [ ] **UI de sync manual**: Botón en FavoritesPage para forzar sync
- [ ] **Indicador visual**: Mostrar última vez sincronizado
- [ ] **Conflictos**: Notificar si hay diferencias grandes
- [ ] **Analytics**: Favoritos más usados globalmente

---

## 📝 Notas técnicas

### **¿Por qué timestamp en milisegundos?**
```typescript
// Local: Date.now() → 1728739200000 (milisegundos)
// Cloud: new Date(ms).toISOString() → "2024-10-12T10:00:00.000Z"
// Conversión automática en toSupabase/fromSupabase
```

### **¿Por qué setTimeout en el sync?**
```typescript
// Evitar bloquear el login
setTimeout(async () => {
  await favoritesService.syncOnLogin(favorites);
}, 1000);
```

### **¿Cómo funciona el merge?**
```typescript
// Estrategia: El más reciente gana
if (localDate >= cloudDate) {
  useLocal(); // PC más reciente
} else {
  useCloud(); // Celular más reciente
}
```

---

## 🐛 Troubleshooting

### **Problema: No sincroniza**
1. Verifica que ejecutaste el SQL
2. Revisa permisos RLS en Supabase:
   ```sql
   -- Deberías tener estas 4 políticas:
   - Users can view own favorites
   - Users can insert own favorites  
   - Users can update own favorites
   - Users can delete own favorites
   ```

### **Problema: Duplicados**
- No debería pasar gracias a `UNIQUE(user_id, favorite_id)`
- Si pasa, ejecuta:
  ```sql
  DELETE FROM favorites 
  WHERE id NOT IN (
    SELECT MIN(id) FROM favorites 
    GROUP BY user_id, favorite_id
  );
  ```

---

## 🎉 ¡Listo!

Tu sistema de favoritos ahora sincroniza entre dispositivos automáticamente. 

**Pruébalo:**
1. Guarda favoritos en PC 💻
2. Abre en celular 📱
3. Login con la misma cuenta
4. ¡Magia! ✨

---

**Desarrollado con ❤️ para AstroLab**
*Sistema de Favoritos v2.0 - Octubre 2025*
