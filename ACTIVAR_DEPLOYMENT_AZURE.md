# 🚀 Activar Deployment en Azure Static Web Apps

## ❌ Problema Actual

Tu Static Web App está creado pero muestra:
- "En espera para implementación" (Awaiting deployment)
- Página de "Congratulations on your new site!" al visitar

## ✅ Solución: Activar el Deployment

Hay 3 formas de activar el deployment, dependiendo de cómo configuraste el repositorio:

---

## Opción 1: Si conectaste GitHub (Más común)

### Paso 1: Verificar que GitHub Actions esté activado

1. Ve a tu repositorio en GitHub: https://github.com/petricorpmx-cmd/Quoter
2. Ve a la pestaña **"Actions"**
3. Si ves un workflow de "Azure Static Web Apps", está configurado
4. Si no ves nada, necesitas activarlo (ver Paso 2)

### Paso 2: Activar GitHub Actions (si no está activado)

1. En Azure Portal → Tu Static Web App → **"Deployment Center"**
2. Verifica que esté conectado a GitHub
3. Si no está conectado:
   - Haz clic en **"Disconnect"** (si hay algo)
   - Luego **"Connect"** → Selecciona GitHub
   - Autoriza y selecciona:
     - Organization: `petricorpmx-cmd`
     - Repository: `Quoter`
     - Branch: `main`
   - Build Presets: `Vite`
   - App location: `/`
   - Output location: `dist`

### Paso 3: Hacer un push para activar el deployment

```powershell
# Hacer un pequeño cambio y hacer push
cd "G:\Mi unidad\Rolando Martinez\9.-Aplicaciones web\analizador-pro - copia"
& "C:\Program Files\Git\cmd\git.exe" commit --allow-empty -m "Trigger Azure deployment"
& "C:\Program Files\Git\cmd\git.exe" push origin main
```

### Paso 4: Verificar el deployment

1. Ve a GitHub → Tu repo → **"Actions"**
2. Deberías ver un workflow ejecutándose llamado "Azure Static Web Apps CI/CD"
3. Espera a que termine (puede tomar 2-5 minutos)
4. Una vez completado, tu sitio debería estar disponible

---

## Opción 2: Si conectaste Azure DevOps

### Paso 1: Verificar el Pipeline

1. Ve a Azure DevOps → Tu proyecto → **"Pipelines"**
2. Deberías ver un pipeline llamado "Quoter" o similar
3. Si no existe, créalo desde el archivo `azure-pipelines.yml`

### Paso 2: Configurar el Pipeline

1. En Azure DevOps → **"Pipelines"** → **"New pipeline"**
2. Selecciona **"Azure Repos Git"** (tu repositorio)
3. Selecciona el repositorio y la rama `main`
4. Selecciona **"Existing Azure Pipelines YAML file"**
5. Ruta: `/azure-pipelines.yml`
6. Haz clic en **"Run"**

### Paso 3: Configurar Variables

Antes de ejecutar, configura las variables:

1. Ve a **"Pipelines"** → Selecciona tu pipeline → **"Edit"**
2. Haz clic en **"Variables"** (arriba a la derecha)
3. Agrega estas variables (marca como "Secret" las que sean sensibles):
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` (obtener de Azure Portal)
   - `VITE_GEMINI_API_KEY` (opcional, si tienes)
   - `VITE_FIREBASE_API_KEY` (opcional, si tienes)
   - etc.

**Para obtener el token:**
- Azure Portal → Tu Static Web App → **"Manage deployment token"**
- Copia el token y pégalo en la variable `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Paso 4: Ejecutar el Pipeline

1. Haz clic en **"Run pipeline"**
2. Selecciona la rama `main`
3. Haz clic en **"Run"**
4. Espera a que termine el deployment

---

## Opción 3: Deployment Manual (Alternativa rápida)

Si las opciones anteriores no funcionan, puedes hacer un deployment manual:

### Paso 1: Build local

```powershell
cd "G:\Mi unidad\Rolando Martinez\9.-Aplicaciones web\analizador-pro - copia"
npm run build
```

### Paso 2: Instalar Azure Static Web Apps CLI

```powershell
npm install -g @azure/static-web-apps-cli
```

### Paso 3: Obtener el token de deployment

1. Azure Portal → Tu Static Web App → **"Manage deployment token"**
2. Copia el token

### Paso 4: Hacer deployment

```powershell
swa deploy ./dist --deployment-token TU_TOKEN_AQUI --env production
```

---

## 🔍 Verificar el Estado del Deployment

### En Azure Portal:

1. Ve a tu Static Web App
2. Pestaña **"Historial de implementación"** (Deployment History)
3. Deberías ver deployments con estado:
   - ✅ **Succeeded** = Deployment exitoso
   - ⏳ **In Progress** = En proceso
   - ❌ **Failed** = Falló (revisa los logs)

### En GitHub Actions (si usas GitHub):

1. Ve a tu repo → **"Actions"**
2. Verifica que el workflow esté ejecutándose o completado
3. Si falla, haz clic en el workflow para ver los logs

---

## ⚙️ Configurar Variables de Entorno (Importante)

Una vez que el deployment funcione, configura las variables:

1. Azure Portal → Tu Static Web App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Haz clic en **"+ Add"** y agrega:

```
VITE_GEMINI_API_KEY=tu-api-key-de-gemini
VITE_FIREBASE_API_KEY=tu-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_APP_ID=default-app-id
```

4. Haz clic en **"Save"**
5. Esto reiniciará la aplicación con las nuevas variables

---

## 🆘 Solución de Problemas

### El deployment no se activa

**Solución:**
- Verifica que el repositorio esté correctamente conectado en "Deployment Center"
- Haz un push nuevo al repositorio
- Verifica que la rama sea `main` (o la que configuraste)

### El deployment falla

**Revisa los logs:**
- GitHub Actions: Ve a "Actions" → Selecciona el workflow fallido → Ver logs
- Azure DevOps: Ve a "Pipelines" → Selecciona el pipeline → Ver logs

**Errores comunes:**
- ❌ "Output location not found" → Verifica que sea `dist`
- ❌ "Build failed" → Revisa que `npm run build` funcione localmente
- ❌ "Variables not found" → Configura las variables de entorno

### El sitio carga pero está en blanco

**Posibles causas:**
1. Variables de entorno no configuradas
2. Errores de JavaScript en la consola del navegador
3. Rutas incorrectas (verifica `staticwebapp.config.json`)

**Solución:**
- Abre la consola del navegador (F12) y revisa errores
- Verifica que las variables de entorno estén configuradas
- Revisa que `staticwebapp.config.json` esté correcto

---

## ✅ Checklist Final

Antes de considerar que todo está listo:

- [ ] El deployment se completó exitosamente
- [ ] El sitio carga (no muestra página de "Congratulations")
- [ ] Las variables de entorno están configuradas
- [ ] La aplicación funciona correctamente
- [ ] Firebase funciona (si lo configuraste)
- [ ] La IA funciona (si configuraste Gemini)

---

## 📝 Notas Importantes

- **Primer deployment**: Puede tomar 3-5 minutos
- **Deployments subsecuentes**: Se activan automáticamente con cada push a `main`
- **Variables de entorno**: Se aplican en el próximo deployment después de guardarlas
- **Build local**: Siempre prueba `npm run build` localmente antes de hacer push
