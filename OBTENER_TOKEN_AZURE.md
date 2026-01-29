# 🔑 Obtener Token de Azure Static Web Apps

## ⚠️ Confusión Aclarada

Hay DOS cosas diferentes:

1. **API Key de Gemini** (`AIzaSyCo-ZyM50ZmwbSsepA-Tdlj5TqzKAeF314`)
   - ✅ Ya está en el código
   - ✅ Es para usar la API de Google Gemini

2. **Token de Azure Static Web Apps** (diferente)
   - ❌ Este es el que necesitas obtener
   - ❌ Es para autenticar el deployment desde GitHub Actions

---

## ✅ Cómo Obtener el Token de Azure

### Paso 1: Ir a Azure Portal

1. Ve a: https://portal.azure.com
2. Busca tu **Static Web App** (el que se llama "Quoter" o similar)
3. Haz clic en él

### Paso 2: Obtener el Token

1. En el menú izquierdo, busca **"Manage deployment token"** o **"Administrar token de implementación"**
2. Haz clic en él
3. Verás un token largo (algo como: `abcdef1234567890...`)
4. Haz clic en el ícono de **copiar** (📋) para copiarlo

### Paso 3: Agregar el Token en GitHub

1. Ve a GitHub → Tu repo → **"Settings"**
2. **"Secrets and variables"** → **"Actions"**
3. Busca el secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_ASHY_BUSH_01638B01E`
4. Haz clic en el ícono de **lápiz** (✏️) para editarlo
5. Pega el token de Azure (NO el API key de Gemini)
6. Haz clic en **"Update secret"**

---

## 🔍 Cómo Identificar el Token Correcto

**Token de Azure Static Web Apps:**
- Es MUY largo (muchos caracteres)
- No empieza con "AIzaSy"
- Se obtiene de Azure Portal → Static Web App → "Manage deployment token"

**API Key de Gemini:**
- Empieza con "AIzaSy"
- Es para usar la API de Google
- Ya está en el código

---

## ✅ Checklist

- [ ] Fuiste a Azure Portal → Tu Static Web App
- [ ] Fuiste a "Manage deployment token"
- [ ] Copiaste el token (el largo, no el de Gemini)
- [ ] Fuiste a GitHub → Settings → Secrets
- [ ] Actualizaste `AZURE_STATIC_WEB_APPS_API_TOKEN_ASHY_BUSH_01638B01E`
- [ ] Hiciste un push nuevo

---

**El token de Azure es diferente al API key de Gemini. Necesitas obtener el token de Azure Portal.** 🔑
