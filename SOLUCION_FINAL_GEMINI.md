# ✅ Solución Final: Configurar Gemini API Key

## 🔄 Dos Opciones Disponibles

### Opción 1: GitHub Secrets (Recomendado, pero tiene problemas)

Si puedes hacer que funcione GitHub Secrets:
1. Ve a GitHub → Settings → Secrets and variables → Actions
2. Crea el secret `VITE_GEMINI_API_KEY` con tu API key
3. Haz un push nuevo

**Problema actual**: El secret se borra al guardar.

---

### Opción 2: Azure Portal + Código Modificado (Funciona Ahora)

He modificado el código para que también intente leer desde `window.VITE_GEMINI_API_KEY` en runtime.

#### Paso 1: Configurar en Azure Portal

1. Ve a Azure Portal → Tu Static Web App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Agrega:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Gemini
4. Haz clic en **"Save"**

#### Paso 2: Inyectar Variable en Runtime

Necesitamos modificar `index.html` para inyectar la variable en `window`:

```html
<script>
  // Inyectar variable de entorno desde Azure
  window.VITE_GEMINI_API_KEY = 'TU_API_KEY_AQUI';
</script>
```

Pero esto no es ideal porque expondría la API key en el HTML.

---

## 🎯 Solución Recomendada: Usar GitHub Secrets Correctamente

El problema con GitHub Secrets es que el valor se borra. Esto puede ser porque:

1. **El valor tiene caracteres especiales** que GitHub no acepta
2. **Hay un problema con el navegador** (ya probaste Brave)
3. **Hay un problema de permisos**

### Intentar de Nuevo con Cuidado:

1. **Obtén tu API key:**
   - Ve a: https://makersuite.google.com/app/apikey
   - Copia SOLO la API key (sin espacios, sin comillas)

2. **En GitHub:**
   - Elimina el secret actual (papelera)
   - Crea uno nuevo
   - En "Name": `VITE_GEMINI_API_KEY`
   - En "Secret": Pega la API key
   - **ANTES de hacer clic en "Add secret":**
     - Verifica que el campo tenga texto
     - Si está vacío, pega de nuevo
   - Haz clic en "Add secret"

3. **Verifica:**
   - Deberías ver el secret en la lista
   - "Last updated" debería decir "now"

---

## 🔧 Alternativa: Hardcodear Temporalmente (NO RECOMENDADO)

Si nada funciona, puedes hardcodear la API key temporalmente en `vite.config.js`:

```javascript
__gemini_api_key: JSON.stringify("TU_API_KEY_AQUI")
```

**⚠️ ADVERTENCIA**: Esto expone la API key en el código. Solo úsalo para pruebas.

---

## ✅ Próximos Pasos

1. **Intenta crear el secret de nuevo** con mucho cuidado
2. **Si no funciona**, podemos hardcodear temporalmente para que funcione
3. **Después**, podemos buscar una solución más permanente

---

**¿Quieres que modifique el código para hardcodear la API key temporalmente mientras resolvemos el problema de GitHub Secrets?** 🤔
