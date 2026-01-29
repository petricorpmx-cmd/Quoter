# 🔄 Alternativa: Configurar en Azure Portal Directamente

Si GitHub Secrets no funciona, podemos usar Azure Portal directamente.

## ⚠️ Limitación

Azure Portal pasa las variables en **runtime**, pero Vite las necesita en **build time**. Sin embargo, podemos modificar el código para leer la variable en runtime como fallback.

## ✅ Solución: Leer Variable en Runtime

Voy a modificar el código para que intente leer la variable desde `import.meta.env` en runtime también.

---

## 📝 Pasos

### Paso 1: Configurar en Azure Portal

1. Ve a Azure Portal → Tu Static Web App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Agrega o verifica:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Gemini
4. Haz clic en **"Save"**

### Paso 2: Modificar el Código

Necesitamos modificar el código para que lea la variable en runtime también.

---

## 🔧 Código Modificado

El código ya intenta leer desde `import.meta.env.VITE_GEMINI_API_KEY`, pero necesitamos asegurarnos de que funcione en runtime.

---

## ⚠️ Nota Importante

Las variables con prefijo `VITE_` normalmente se inyectan durante el build. En Azure Static Web Apps, estas variables están disponibles en runtime, pero Vite las necesita durante el build.

**Solución temporal**: Podemos hacer que el código lea la variable directamente desde el objeto `window` o desde una variable global que Azure inyecta.

---

**Voy a modificar el código para que funcione con Azure Portal directamente.** 🚀
