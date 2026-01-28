# Backend Azure Functions para Analizador Pro

Este backend reemplaza Firebase con Azure Cosmos DB + Azure Functions.

## 📋 Requisitos Previos

1. Azure Cosmos DB creado (ver `MIGRACION_AZURE_COMPLETA.md`)
2. Azure Function App creado
3. Node.js 18+ instalado
4. Azure Functions Core Tools instalado

## 🚀 Instalación Local

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copia `local.settings.json.example` a `local.settings.json`
2. Completa las variables de entorno con tus valores de Cosmos DB

## 🧪 Probar Localmente

```bash
npm start
```

Las funciones estarán disponibles en:
- `http://localhost:7071/api/getAppState`
- `http://localhost:7071/api/saveAppState`
- `http://localhost:7071/api/getFavoriteProviders`
- `http://localhost:7071/api/saveFavoriteProvider`
- `http://localhost:7071/api/deleteFavoriteProvider`

## 📦 Desplegar a Azure

### Opción 1: Desde VS Code

1. Instala la extensión "Azure Functions"
2. Haz clic derecho en la carpeta `backend`
3. Selecciona "Deploy to Function App"
4. Selecciona tu Function App

### Opción 2: Desde CLI

```bash
# Instalar Azure Functions Core Tools
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Login a Azure
az login

# Desplegar
cd backend
func azure functionapp publish quoter-api
```

### Opción 3: Desde Azure Portal

1. Ve a tu Function App
2. Ve a "Deployment Center"
3. Conecta con GitHub o Azure DevOps
4. Configura el build para usar la carpeta `backend`

## 🔧 Configurar Variables de Entorno en Azure

1. Ve a tu Function App → "Configuration"
2. Agrega estas variables:
   - `COSMOS_DB_ENDPOINT`
   - `COSMOS_DB_KEY`
   - `COSMOS_DB_DATABASE`
   - `COSMOS_DB_CONTAINER_APP_STATE`
   - `COSMOS_DB_CONTAINER_PROVIDERS`

## 📝 Endpoints Disponibles

### App State
- `GET /api/getAppState?appId=default-app-id` - Obtener estado
- `POST /api/saveAppState` - Guardar estado

### Favorite Providers
- `GET /api/getFavoriteProviders?appId=default-app-id` - Obtener proveedores
- `POST /api/saveFavoriteProvider` - Guardar proveedor
- `DELETE /api/deleteFavoriteProvider?id=provider-id` - Eliminar proveedor

## 🔒 Seguridad

Actualmente todas las funciones tienen `authLevel: 'anonymous'`. Para producción, considera:
- Agregar autenticación con Azure AD
- Validar tokens JWT
- Implementar rate limiting
