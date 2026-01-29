# 🔧 Solución: Error 403 (Forbidden) en Gemini API

## ❌ Error

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=... 403 (Forbidden)
```

## ✅ Significado

El error 403 significa:
- ✅ La API key está siendo usada (ya no falta)
- ❌ Pero la API key es **inválida** o **no tiene permisos**

## 🔍 Posibles Causas

1. **API key inválida o expirada**
2. **API key sin permisos** para el modelo `gemini-2.5-flash-preview-09-2025`
3. **API key restringida** por IP o dominio
4. **Cuota excedida** en Google Cloud
5. **API key deshabilitada**

## ✅ Soluciones

### Solución 1: Verificar la API Key en Google AI Studio

1. Ve a: https://makersuite.google.com/app/apikey
2. Verifica que la API key `AIzaSyCo-ZyM50ZmwbSsepA-Tdlj5TqzKAeF314` esté:
   - ✅ Activa (no deshabilitada)
   - ✅ Con permisos para Gemini API
   - ✅ Sin restricciones de IP/dominio (o que incluya tu dominio de Azure)

### Solución 2: Obtener una Nueva API Key

1. Ve a: https://makersuite.google.com/app/apikey
2. Si la API key actual está deshabilitada o tiene problemas:
   - Haz clic en **"Create API Key"** o **"Get API Key"**
   - Crea una nueva API key
   - Copia la nueva API key

### Solución 3: Verificar Restricciones de la API Key

1. Ve a Google Cloud Console: https://console.cloud.google.com/
2. Ve a **"APIs & Services"** → **"Credentials"**
3. Busca tu API key
4. Verifica las **restricciones**:
   - Si hay restricciones de **IP**, agrega el dominio de Azure
   - Si hay restricciones de **aplicación**, verifica que esté configurada correctamente

### Solución 4: Usar un Modelo Diferente

El modelo `gemini-2.5-flash-preview-09-2025` puede no estar disponible o requerir permisos especiales. Podemos cambiar a un modelo más estable:

- `gemini-1.5-flash`
- `gemini-1.5-pro`
- `gemini-pro`

---

## 🔄 Actualizar la API Key

Si obtienes una nueva API key:

1. Actualiza `vite.config.js` con la nueva API key
2. O configúrala en Azure Portal → Variables de entorno

---

## 📝 Verificar en Google AI Studio

**Pasos rápidos:**
1. Ve a: https://makersuite.google.com/app/apikey
2. Verifica el estado de tu API key
3. Si está deshabilitada o tiene problemas, crea una nueva
4. Comparte la nueva API key y la actualizo en el código

---

**¿Puedes verificar en Google AI Studio si la API key está activa y tiene permisos?** 🔍
