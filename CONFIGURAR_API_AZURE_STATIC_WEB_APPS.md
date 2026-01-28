# 🔧 Configurar API en Azure Static Web Apps

## ⚠️ Mensaje que ves

```
"No se admiten back-ends Bring Your Own API en el plan de hospedaje gratuito"
```

**Esto NO afecta a:**
- ✅ Azure Functions integradas (las que creamos en `backend/`)
- ✅ Variables de entorno (como `VITE_GEMINI_API_KEY`)
- ✅ Llamadas directas desde el frontend a APIs externas (como Gemini)

**Esto SÍ afecta a:**
- ❌ Vincular APIs externas como Container Apps, Web Apps, etc. desde esta pantalla

---

## 🎯 Para Gemini API: NO necesitas configurar nada aquí

La API de Gemini funciona **directamente desde el frontend**, no necesita backend. Solo necesitas:

### Paso 1: Configurar Variable de Entorno

1. **Ve a "Configuración"** (no "API") en el menú izquierdo
2. Pestaña **"Application settings"** o **"Variables de entorno"**
3. Haz clic en **"+ Add"**
4. Agrega:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Gemini
5. Haz clic en **"Save"**

**¡Eso es todo!** No necesitas configurar nada en la sección "API".

---

## 🔗 Para Azure Functions (Backend): Vincular Function App

Si quieres usar Azure Functions para reemplazar Firebase, necesitas vincular tu Function App:

### Opción 1: Plan Free (Limitado)

En el plan **Free**, Azure Static Web Apps puede usar **Azure Functions integradas** que se crean automáticamente cuando configuras el deployment desde GitHub/Azure DevOps.

**Cómo funciona:**
1. Cuando haces push a GitHub, Azure crea automáticamente un Function App
2. Las funciones se despliegan automáticamente
3. No necesitas vincular manualmente desde esta pantalla

**Limitación**: Solo funciona con el Function App que Azure crea automáticamente.

### Opción 2: Plan Standard (Recomendado para producción)

Si quieres usar tu propio Function App (como `quoter-api` que creamos):

1. **Actualiza el plan**:
   - Ve a **"Plan de hospedaje"** en el menú izquierdo
   - Haz clic en **"Actualizar"** o **"Upgrade"**
   - Selecciona el plan **"Standard"**

2. **Vincular Function App**:
   - Ve a **"API"** (donde estás ahora)
   - En la fila de "Producción", haz clic en **"Vínculo"**
   - Selecciona tu Function App (`quoter-api`)
   - Haz clic en **"OK"**

---

## 📊 Comparación de Planes

| Característica | Free | Standard |
|---------------|------|----------|
| **Azure Functions integradas** | ✅ Sí | ✅ Sí |
| **Vincular Function App externo** | ❌ No | ✅ Sí |
| **Dominios personalizados** | ✅ Sí | ✅ Sí |
| **Costo** | Gratis | ~$9/mes base |

---

## 🎯 Para tu caso específico

### Si solo quieres que funcione Gemini:

1. ✅ **Ignora la sección "API"** completamente
2. ✅ Ve a **"Configuración"** → **"Application settings"**
3. ✅ Agrega `VITE_GEMINI_API_KEY`
4. ✅ Guarda y listo

**No necesitas cambiar de plan ni configurar nada en "API".**

### Si quieres migrar Firebase a Azure Functions:

**Opción A: Usar Functions integradas (Free)**
1. Las funciones en `backend/` se despliegan automáticamente
2. Configura `VITE_AZURE_FUNCTIONS_URL` apuntando a la URL automática
3. Funciona sin costo adicional

**Opción B: Usar tu propio Function App (Standard)**
1. Actualiza a plan Standard
2. Despliega `quoter-api` manualmente
3. Vincúlalo desde la sección "API"
4. Configura `VITE_AZURE_FUNCTIONS_URL` con la URL de tu Function App

---

## 🔍 ¿Cómo saber qué plan tienes?

En la imagen que compartiste, veo que tienes el plan **Free** porque aparece el mensaje de advertencia.

Para verificar:
1. Ve a **"Overview"** de tu Static Web App
2. Busca **"Plan de hospedaje"** o **"Hosting plan"**
3. Debería decir **"Free"**

---

## ✅ Resumen Rápido

### Para Gemini API (lo que necesitas ahora):
- ❌ **NO** necesitas configurar nada en "API"
- ✅ **SÍ** necesitas configurar `VITE_GEMINI_API_KEY` en "Configuración"
- ✅ Funciona perfectamente en plan Free

### Para Azure Functions (migración futura):
- ✅ Plan Free: Usa Functions integradas automáticas
- ✅ Plan Standard: Puedes vincular tu propio Function App

---

## 🆘 ¿Necesitas ayuda?

- **Gemini no funciona**: Verifica que `VITE_GEMINI_API_KEY` esté en "Configuración" (no en "API")
- **Quieres vincular Function App**: Necesitas actualizar a plan Standard
- **Dudas sobre planes**: El plan Free es suficiente para empezar

---

**Conclusión**: Para Gemini API, ignora completamente la sección "API" y ve directamente a "Configuración" → "Application settings". 🚀
