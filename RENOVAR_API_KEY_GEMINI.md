# 🔑 Renovar API Key de Gemini

## ❌ Problema Detectado

El error muestra: **"API key expired. Please renew the API key."**

La API key actual ha expirado y necesita ser renovada.

---

## ✅ Solución: Crear Nueva API Key

### Paso 1: Crear Nueva API Key en Google AI Studio

1. Ve a **Google AI Studio**: https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"** o **"Get API Key"**
4. Selecciona un proyecto existente o crea uno nuevo
5. **Copia la nueva API key** (empieza con `AIza...`)

### Paso 2: Actualizar en GitHub Secrets (Recomendado)

1. Ve a tu repositorio en GitHub: https://github.com/petricorpmx-cmd/Quoter
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Busca el secret `VITE_GEMINI_API_KEY`
4. Haz clic en **"Update"**
5. Pega la nueva API key
6. Haz clic en **"Update secret"**

### Paso 3: Actualizar en Azure Portal (Opcional)

1. Ve a Azure Portal → Tu Static Web App
2. Ve a **Configuration** → **Application settings**
3. Busca `VITE_GEMINI_API_KEY`
4. Haz clic en **"Edit"**
5. Pega la nueva API key
6. Haz clic en **"Save"**

### Paso 4: Hacer Nuevo Deployment

Después de actualizar la API key, necesitas hacer un nuevo deployment:

1. Haz un commit vacío para activar el workflow:
   ```bash
   git commit --allow-empty -m "Actualizar API key de Gemini"
   git push origin main
   ```

2. O simplemente espera al próximo push - el workflow usará la nueva API key automáticamente

---

## 🔍 Verificar que Funciona

Después del deployment:

1. Abre tu sitio web
2. Abre la consola (F12)
3. Busca el mensaje:
   ```
   📤 Enviando solicitud a Gemini: {
     apiKeyUsada: "AIzaSyCoij..."  // ← Debería mostrar la nueva API key
   }
   ```
4. Prueba el chat de IA - debería funcionar sin error 400

---

## ⚠️ Nota Importante

- Las API keys de Gemini pueden expirar si no se usan por mucho tiempo
- Es recomendable usar GitHub Secrets en lugar de hardcodear la API key
- El workflow actual usa: `${{ secrets.VITE_GEMINI_API_KEY || 'FALLBACK_KEY' }}`
- Si no hay secret, usa la key del fallback (que puede estar expirada)

---

**Una vez que tengas la nueva API key, actualízala en GitHub Secrets y haz un nuevo deployment.** 🚀
