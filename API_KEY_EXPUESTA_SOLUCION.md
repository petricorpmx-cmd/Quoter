# 🔒 Solución: API Key Expuesta Públicamente

## ⚠️ Problema Detectado

Google AI Studio detectó que tu API key está expuesta públicamente en:
- El código en GitHub (vite.config.js)
- El workflow de GitHub Actions

**Esto es un riesgo de seguridad** porque cualquiera puede ver y usar tu API key.

## ✅ Soluciones

### Solución 1: Crear Nueva API Key y Usar GitHub Secrets (Recomendado)

#### Paso 1: Crear Nueva API Key

1. En Google AI Studio, haz clic en **"Borrar clave"** (Delete key) para eliminar la actual
2. Haz clic en **"Create API Key"** o **"Get API Key"**
3. Crea una nueva API key
4. **NO la hardcodees en el código**

#### Paso 2: Agregar en GitHub Secrets

1. Ve a GitHub → Tu repo → Settings → Secrets and variables → Actions
2. Crea un nuevo secret:
   - Name: `VITE_GEMINI_API_KEY`
   - Secret: Tu nueva API key
3. Guarda el secret

#### Paso 3: Remover del Código

Necesitamos quitar la API key hardcodeada de `vite.config.js` y usar solo variables de entorno.

### Solución 2: Restringir la API Key Actual

Si quieres mantener la API key actual:

1. En Google AI Studio, haz clic en la API key
2. Ve a **"Restrictions"** o **"Restricciones"**
3. Agrega restricciones:
   - **Application restrictions**: Restrict to HTTP referrers
   - Agrega tu dominio de Azure: `https://ashy-bush-01638b01e.1.azurestaticapps.net/*`
   - O restringe por IP si es posible

**Nota**: Esto limita el uso pero no oculta la API key del código.

### Solución 3: Usar Variables de Entorno en Azure Portal

1. Crea una nueva API key en Google AI Studio
2. Agrega la nueva API key en Azure Portal → Static Web App → Configuration → Application settings
3. Remueve la API key hardcodeada del código
4. El código usará la variable de entorno de Azure

---

## 🎯 Recomendación

**La mejor solución es:**
1. ✅ Crear una nueva API key
2. ✅ Agregarla en GitHub Secrets (aunque tengas problemas, podemos intentar de nuevo)
3. ✅ O agregarla en Azure Portal → Variables de entorno
4. ✅ Remover la API key hardcodeada del código

---

## 🔄 Próximos Pasos

1. **Crea una nueva API key** en Google AI Studio
2. **Compártela conmigo** y la configuro correctamente
3. **Removemos la API key expuesta** del código

---

**¿Quieres que te ayude a crear una nueva API key y configurarla de forma segura?** 🔒
