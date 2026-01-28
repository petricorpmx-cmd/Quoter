# 🔍 Verificar Variables de Entorno en Azure Static Web Apps

## ❌ Problema Actual

Agregaste `VITE_GEMINI_API_KEY` en Azure Portal pero sigue sin funcionar.

## 🔍 Diagnóstico

Azure Static Web Apps **debería** pasar las variables de entorno automáticamente durante el build, pero a veces no lo hace correctamente.

## ✅ Solución: Verificar y Configurar Correctamente

### Paso 1: Verificar en Azure Portal

1. Ve a Azure Portal → Tu Static Web App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Verifica que `VITE_GEMINI_API_KEY` esté ahí con un valor

### Paso 2: Verificar el Nombre Exacto

El nombre debe ser **exactamente**:
```
VITE_GEMINI_API_KEY
```

**Verifica:**
- ✅ No tiene espacios al inicio o final
- ✅ Está en mayúsculas
- ✅ Tiene el prefijo `VITE_`
- ✅ El valor no está vacío

### Paso 3: Verificar en GitHub Actions (Después del Build)

1. Ve a GitHub → Tu repo → **"Actions"**
2. Selecciona el último workflow ejecutado
3. Haz clic en **"Build And Deploy"**
4. Expande los logs
5. Busca si hay mensajes sobre variables de entorno

### Paso 4: Verificar en el Navegador (Después del Deployment)

1. Abre tu sitio web
2. Abre la consola (F12)
3. Busca el mensaje de debug que agregamos:
   ```
   🔍 Debug Gemini API Key: { ... }
   ```
4. Esto te dirá exactamente qué variables están disponibles

---

## 🔧 Solución Alternativa: Usar GitHub Secrets

Si Azure no está pasando las variables correctamente, puedes usar GitHub Secrets:

### Paso 1: Agregar Secret en GitHub

1. Ve a tu repo en GitHub → **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Haz clic en **"New repository secret"**
3. Name: `VITE_GEMINI_API_KEY`
4. Value: Tu API key de Gemini
5. Haz clic en **"Add secret"**

### Paso 2: Modificar el Workflow

Necesitamos modificar el workflow para pasar la variable durante el build. Esto requiere actualizar el archivo `.github/workflows/azure-static-web-apps-ashy-bush-01638b01e.yml`.

---

## 🆘 Debug en la Consola

Después del próximo deployment, abre la consola y busca:

```javascript
🔍 Debug Gemini API Key: {
  desdeDefine: true/false,
  valorDefine: "...",
  desdeEnv: true/false,
  valorEnv: "...",
  apiKeyFinal: "...",
  todasLasEnv: [...]
}
```

**Esto te dirá:**
- Si la variable está disponible desde `__gemini_api_key` (define)
- Si la variable está disponible desde `import.meta.env.VITE_GEMINI_API_KEY`
- Qué variables de entorno están disponibles

---

## ✅ Checklist de Verificación

- [ ] Variable `VITE_GEMINI_API_KEY` existe en Azure Portal → Configuration
- [ ] Variable tiene un valor (no está vacía)
- [ ] Nombre es exactamente `VITE_GEMINI_API_KEY` (case-sensitive)
- [ ] Hiciste un push nuevo después de agregar la variable
- [ ] Deployment completado exitosamente
- [ ] Revisaste los logs de GitHub Actions
- [ ] Revisaste la consola del navegador para ver el debug

---

## 📝 Próximos Pasos

1. **Haz un push nuevo** con el código mejorado de debug
2. **Espera** a que termine el deployment
3. **Abre la consola** y revisa qué muestra el debug
4. **Comparte** conmigo qué muestra el debug para identificar el problema exacto
