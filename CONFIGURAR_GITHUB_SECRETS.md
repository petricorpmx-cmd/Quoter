# 🔐 Configurar GitHub Secrets para Variables de Entorno

## ❌ Problema Identificado

Azure Static Web Apps NO pasa las variables de entorno durante el BUILD de GitHub Actions. Las variables en Azure Portal solo están disponibles en runtime, pero Vite necesita las variables durante el BUILD.

## ✅ Solución: Usar GitHub Secrets

Necesitamos configurar las variables como Secrets en GitHub para que estén disponibles durante el build.

---

## 📝 Paso a Paso

### Paso 1: Obtener los Valores de Azure Portal

1. Ve a Azure Portal → Tu Static Web App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Copia los valores de estas variables (si las tienes):
   - `VITE_GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_APP_ID`

### Paso 2: Agregar Secrets en GitHub

1. Ve a tu repositorio en GitHub: https://github.com/petricorpmx-cmd/Quoter
2. Haz clic en **"Settings"** (arriba)
3. En el menú izquierdo, ve a **"Secrets and variables"** → **"Actions"**
4. Haz clic en **"New repository secret"**

#### Agregar cada Secret:

**Secret 1: VITE_GEMINI_API_KEY**
- Name: `VITE_GEMINI_API_KEY`
- Secret: Tu API key de Gemini (ej: `AIzaSy...`)
- Haz clic en **"Add secret"**

**Secret 2: VITE_FIREBASE_API_KEY** (si usas Firebase)
- Name: `VITE_FIREBASE_API_KEY`
- Secret: Tu Firebase API Key
- Haz clic en **"Add secret"**

**Secret 3-7: Resto de variables de Firebase** (si usas Firebase)
- Repite el proceso para cada variable:
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

**Secret 8: VITE_APP_ID** (opcional)
- Name: `VITE_APP_ID`
- Secret: `default-app-id` (o el valor que uses)

### Paso 3: Verificar que el Workflow esté Actualizado

He actualizado el workflow (`.github/workflows/azure-static-web-apps-ashy-bush-01638b01e.yml`) para usar estos secrets. Verifica que el archivo tenga la sección `env:` con todas las variables.

### Paso 4: Hacer un Push Nuevo

Después de agregar los secrets, haz un push nuevo para activar un nuevo build:

```powershell
git commit --allow-empty -m "Build con GitHub Secrets"
git push origin main
```

O simplemente haz cualquier cambio y push.

### Paso 5: Verificar

1. Ve a GitHub → Tu repo → **"Actions"**
2. Verifica que el workflow se ejecute
3. En los logs del paso "Build And Deploy", deberías ver que las variables están disponibles
4. Después del deployment, prueba tu sitio

---

## 🔍 Verificar que Funciona

Después del deployment, abre la consola del navegador y busca:

```javascript
🔍 Debug Gemini API Key: {
  desdeDefine: true,
  valorDefine: "AIzaSy...",  // ← Debería tener valor ahora
  longitudDefine: 39,        // ← Debería ser > 0
  ...
}
```

---

## ⚠️ Importante

- Los Secrets en GitHub son **privados** y solo están disponibles durante el build
- No se exponen en el código final (son seguros)
- Si cambias un secret, necesitas hacer un nuevo push para que se aplique

---

## 🆘 Si No Funciona

1. Verifica que los Secrets estén agregados correctamente en GitHub
2. Verifica que los nombres sean exactos (case-sensitive)
3. Verifica que el workflow tenga la sección `env:` con las variables
4. Revisa los logs de GitHub Actions para ver si hay errores

---

## ✅ Checklist

- [ ] Secrets agregados en GitHub → Settings → Secrets and variables → Actions
- [ ] Workflow actualizado con sección `env:`
- [ ] Push nuevo hecho
- [ ] Deployment completado
- [ ] Verificado en consola del navegador

---

**Una vez que agregues los Secrets y hagas un push nuevo, debería funcionar correctamente.** 🚀
