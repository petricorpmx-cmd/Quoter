# 🚀 Guía de Configuración para Azure

Esta guía te ayudará a configurar tu proyecto en Azure para:
- ✅ Ver y gestionar el repositorio en Azure DevOps
- ✅ Desplegar el frontend en Azure Static Web Apps
- ✅ Configurar backend y base de datos en Azure

---

## 📋 Índice

1. [Conectar Repositorio a Azure DevOps](#1-conectar-repositorio-a-azure-devops)
2. [Desplegar Frontend en Azure Static Web Apps](#2-desplegar-frontend-en-azure-static-web-apps)
3. [Opciones de Backend y Base de Datos](#3-opciones-de-backend-y-base-de-datos)
4. [Configuración de Variables de Entorno en Azure](#4-configuración-de-variables-de-entorno-en-azure)

---

## 1. Conectar Repositorio a Azure DevOps

### Opción A: Importar desde GitHub a Azure DevOps Repos

1. **Ve a Azure DevOps**: https://dev.azure.com
2. **Crea un nuevo proyecto** (o selecciona uno existente)
3. **Ve a Repos** → **Files**
4. **Haz clic en "Import"** (o "Import repository")
5. **Selecciona "Git"** como tipo de repositorio
6. **Ingresa la URL de GitHub**: `https://github.com/petricorpmx-cmd/Quoter.git`
7. **Haz clic en "Import"**

### Opción B: Agregar Azure DevOps como remoto adicional

Si quieres mantener GitHub y también tener Azure DevOps:

```powershell
# Agregar Azure DevOps como remoto adicional
& "C:\Program Files\Git\cmd\git.exe" remote add azure https://dev.azure.com/ORGANIZACION/PROYECTO/_git/REPOSITORIO

# Hacer push a Azure DevOps
& "C:\Program Files\Git\cmd\git.exe" push azure main
```

**Para obtener la URL de Azure DevOps:**
1. Ve a tu repositorio en Azure DevOps
2. Haz clic en "Clone" (botón azul)
3. Copia la URL HTTPS

---

## 2. Desplegar Frontend en Azure Static Web Apps

Azure Static Web Apps es perfecto para aplicaciones React/Vite y se integra automáticamente con Azure DevOps.

### Paso 1: Crear Azure Static Web App

1. **Ve a Azure Portal**: https://portal.azure.com
2. **Busca "Static Web Apps"** y haz clic en "Create"
3. **Completa la configuración**:
   - **Subscription**: Tu suscripción de Azure
   - **Resource Group**: Crea uno nuevo o usa existente
   - **Name**: `analizador-pro` (o el nombre que prefieras)
   - **Plan type**: Free (para empezar)
   - **Region**: Elige la más cercana (ej: `East US 2`)
   - **Source**: Azure DevOps
   - **Organization**: Tu organización de Azure DevOps
   - **Project**: Tu proyecto
   - **Repository**: Tu repositorio
   - **Branch**: `main`
   - **Build Presets**: `Vite`
   - **App location**: `/` (raíz)
   - **Api location**: (dejar vacío, no hay API)
   - **Output location**: `dist`

4. **Haz clic en "Review + create"** → **"Create"**

### Paso 2: Configurar Build Settings

Azure Static Web Apps detectará automáticamente Vite, pero puedes personalizar en el archivo `azure-pipelines.yml` (ya incluido en el proyecto).

### Paso 3: Configurar Variables de Entorno

Ve a tu Static Web App en Azure Portal:
1. **Configuration** → **Application settings**
2. **Agrega las variables de entorno** (ver sección 4)

---

## 3. Opciones de Backend y Base de Datos

Tu proyecto actualmente usa **Firebase** como backend/BD. Tienes 3 opciones:

### Opción A: Mantener Firebase (Recomendado para empezar)

**Ventajas:**
- ✅ Ya está configurado y funcionando
- ✅ No requiere cambios en el código
- ✅ Gratis hasta cierto límite
- ✅ Fácil de usar

**Configuración:**
- Solo necesitas configurar las variables de entorno en Azure (ver sección 4)
- Firebase funciona desde cualquier lugar (no necesita estar en Azure)

### Opción B: Migrar a Azure Cosmos DB

**Ventajas:**
- ✅ Todo en Azure (un solo proveedor)
- ✅ Escalable y robusto
- ✅ Integración nativa con otros servicios Azure

**Desventajas:**
- ⚠️ Requiere cambios en el código
- ⚠️ Necesitas crear un backend API (Azure Functions)

**Pasos para migrar:**
1. Crear Azure Cosmos DB (API de MongoDB o SQL)
2. Crear Azure Functions para el backend API
3. Modificar el código para usar Azure Functions en lugar de Firebase
4. Migrar datos de Firebase a Cosmos DB

### Opción C: Azure Functions + Azure SQL Database

**Ventajas:**
- ✅ Backend completo en Azure
- ✅ Base de datos relacional (SQL)
- ✅ Control total sobre la lógica

**Desventajas:**
- ⚠️ Requiere más configuración
- ⚠️ Necesitas crear el backend desde cero

---

## 4. Configuración de Variables de Entorno en Azure

### Para Azure Static Web Apps:

1. **Ve a tu Static Web App** en Azure Portal
2. **Configuration** → **Application settings**
3. **Agrega estas variables** (con el prefijo `VITE_`):

```
VITE_APP_ID=default-app-id
VITE_GEMINI_API_KEY=tu-api-key-de-gemini
VITE_FIREBASE_API_KEY=tu-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Para Azure DevOps Pipelines:

Las variables se pueden configurar en:
- **Pipelines** → **Library** → **Variable groups**
- O directamente en el pipeline YAML usando `variables:`

---

## 🔧 Archivos de Configuración Incluidos

El proyecto incluye:
- `azure-pipelines.yml` - Pipeline de CI/CD para Azure DevOps
- `staticwebapp.config.json` - Configuración para Azure Static Web Apps
- `.github/workflows/azure-static-web-apps.yml` - Alternativa con GitHub Actions

---

## 📝 Próximos Pasos

1. ✅ **Conecta el repositorio a Azure DevOps** (Opción A o B de la sección 1)
2. ✅ **Crea Azure Static Web App** (Sección 2)
3. ✅ **Configura variables de entorno** (Sección 4)
4. ✅ **Haz push de cambios** y Azure desplegará automáticamente
5. ⚠️ **Decide sobre backend/BD** (mantener Firebase o migrar a Azure)

---

## 🆘 Solución de Problemas

### El deploy falla
- Verifica que las variables de entorno estén configuradas
- Revisa los logs en Azure Portal → Static Web App → Deployment history

### Firebase no funciona en producción
- Verifica que las variables `VITE_FIREBASE_*` estén configuradas
- Revisa las reglas de Firestore en Firebase Console

### La app no carga
- Verifica que `Output location` sea `dist` en la configuración de Static Web App
- Revisa la consola del navegador para errores

---

## 📚 Recursos

- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure DevOps Repos](https://docs.microsoft.com/azure/devops/repos/)
- [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/)
- [Azure Functions](https://docs.microsoft.com/azure/azure-functions/)
