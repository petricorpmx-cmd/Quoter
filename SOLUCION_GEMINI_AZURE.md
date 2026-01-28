# 🔧 Solución: API de Gemini no funciona en Azure

## ❌ Problema

La API de Gemini muestra el mensaje:
```
⚠️ El asistente de IA requiere una API key de Gemini para funcionar...
```

## ✅ Solución: Configurar Variable de Entorno en Azure

### Paso 1: Obtener tu API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"** o **"Get API Key"**
4. Copia la API key (algo como: `AIzaSy...`)

### Paso 2: Configurar en Azure Static Web Apps

**⚠️ IMPORTANTE**: NO vayas a la sección "API". Ve directamente a "Configuración".

1. **Ve a Azure Portal**: https://portal.azure.com
2. **Busca tu Static Web App** → Selecciónala
3. En el menú izquierdo, busca **"Configuración"** (Configuration) - NO "API"
4. Pestaña **"Application settings"** o **"Variables de entorno"**
5. Haz clic en **"+ Add"** o **"+ Agregar"**
6. Agrega:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Gemini (ej: `AIzaSy...`)
7. Haz clic en **"OK"**
8. Haz clic en **"Save"** o **"Guardar"** (arriba)
9. Espera unos segundos mientras se reinicia la aplicación

**Nota**: Si ves un mensaje sobre "Bring Your Own API" en la sección "API", ignóralo. Eso es para APIs externas, no para variables de entorno. Gemini funciona directamente desde el frontend, no necesita backend.

### Paso 3: Verificar

1. Espera 1-2 minutos para que el cambio se aplique
2. Recarga tu sitio web
3. Prueba el chat de IA
4. Debería funcionar correctamente

---

## 🔍 Verificación en Código

El código busca la variable así:

```javascript
const apiKey = typeof __gemini_api_key !== 'undefined' ? __gemini_api_key : '';
```

Esta variable se define en `vite.config.js` usando:
```javascript
__gemini_api_key: JSON.stringify(env.VITE_GEMINI_API_KEY || '')
```

**Importante**: En Azure, las variables de entorno con prefijo `VITE_` se inyectan durante el build.

---

## ⚠️ Notas Importantes

1. **Después de agregar la variable**: Azure necesita hacer un nuevo deployment
   - Si tienes GitHub Actions configurado, haz un push nuevo
   - O espera a que Azure detecte el cambio y redepliegue

2. **La variable debe llamarse exactamente**: `VITE_GEMINI_API_KEY`
   - El prefijo `VITE_` es necesario para que Vite la incluya en el build

3. **Seguridad**: 
   - La API key se compilará en el código JavaScript
   - Esto es normal para APIs públicas como Gemini
   - Si necesitas más seguridad, considera usar Azure Functions como proxy

---

## 🆘 Si aún no funciona

### Verificar que la variable esté configurada:

1. Azure Portal → Static Web App → Configuration
2. Verifica que `VITE_GEMINI_API_KEY` esté en la lista
3. Verifica que tenga un valor (no esté vacía)

### Verificar el deployment:

1. Ve a **"Deployment History"** en Azure Portal
2. Verifica que haya un deployment reciente después de agregar la variable
3. Si no hay deployment nuevo, haz un push a GitHub para forzar un nuevo build

### Verificar en la consola del navegador:

1. Abre tu sitio web
2. Abre la consola (F12)
3. Busca errores relacionados con Gemini
4. Verifica que la variable esté disponible (puede tomar unos minutos)

---

## ✅ Checklist

- [ ] API key de Gemini obtenida
- [ ] Variable `VITE_GEMINI_API_KEY` agregada en Azure Portal
- [ ] Variable guardada (Save)
- [ ] Esperado 1-2 minutos para que se aplique
- [ ] Sitio web recargado
- [ ] Chat de IA probado y funcionando
