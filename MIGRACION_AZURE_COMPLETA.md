# 🚀 Migración Completa: Firebase → Azure Cosmos DB + Azure Functions

Esta guía te ayudará a migrar completamente de Firebase a Azure.

---

## 📋 Índice

1. [Arquitectura Nueva](#arquitectura-nueva)
2. [Paso 1: Crear Azure Cosmos DB](#paso-1-crear-azure-cosmos-db)
3. [Paso 2: Crear Azure Functions](#paso-2-crear-azure-functions)
4. [Paso 3: Modificar Frontend](#paso-3-modificar-frontend)
5. [Paso 4: Migrar Datos](#paso-4-migrar-datos)
6. [Paso 5: Desplegar](#paso-5-desplegar)

---

## 🏗️ Arquitectura Nueva

### Antes (Firebase):
```
Frontend (React)
    ↓
Firebase SDK (directo)
    ↓
Firestore Database
```

### Después (Azure):
```
Frontend (React)
    ↓
HTTP Requests
    ↓
Azure Functions (Backend API)
    ↓
Azure Cosmos DB
```

---

## Paso 1: Crear Azure Cosmos DB

### Opción A: Desde Azure Portal

1. Ve a [Azure Portal](https://portal.azure.com)
2. Busca **"Azure Cosmos DB"** → **"Create"**
3. Completa:
   - **Subscription**: Tu suscripción
   - **Resource Group**: `Quoter_group` (o el que uses)
   - **Account Name**: `quoter-db` (debe ser único globalmente)
   - **API**: Selecciona **"Core (SQL)"** (más simple)
   - **Location**: Elige la más cercana
   - **Capacity mode**: **"Serverless"** (para empezar, más económico)
4. Haz clic en **"Review + create"** → **"Create"**
5. Espera a que se cree (2-3 minutos)

### Opción B: Desde Azure CLI

```bash
az cosmosdb create \
  --name quoter-db \
  --resource-group Quoter_group \
  --default-consistency-level Session \
  --locations regionName=eastus
```

### Crear Base de Datos y Contenedores

Una vez creado:

1. Ve a tu Cosmos DB → **"Data Explorer"**
2. Haz clic en **"New Container"**
3. Crea dos contenedores:

**Contenedor 1: `appState`**
- Database id: `quoter` (crear nueva)
- Container id: `appState`
- Partition key: `/appId`
- Throughput: 400 (o Serverless)

**Contenedor 2: `favoriteProviders`**
- Database id: `quoter` (usar la misma)
- Container id: `favoriteProviders`
- Partition key: `/appId`
- Throughput: 400 (o Serverless)

---

## Paso 2: Crear Azure Functions

### Paso 2.1: Crear Function App

1. Azure Portal → Busca **"Function App"** → **"Create"**
2. Completa:
   - **Subscription**: Tu suscripción
   - **Resource Group**: `Quoter_group`
   - **Function App name**: `quoter-api` (debe ser único)
   - **Publish**: **"Code"**
   - **Runtime stack**: **"Node.js"**
   - **Version**: **"18 LTS"**
   - **Region**: Misma que Cosmos DB
   - **Operating System**: **"Linux"**
   - **Plan type**: **"Consumption (Serverless)"**
3. Haz clic en **"Review + create"** → **"Create"**

### Paso 2.2: Configurar Variables de Entorno

1. Ve a tu Function App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Agrega estas variables:

```
COSMOS_DB_ENDPOINT=https://quoter-db.documents.azure.com:443/
COSMOS_DB_KEY=tu-primary-key-de-cosmos-db
COSMOS_DB_DATABASE=quoter
COSMOS_DB_CONTAINER_APP_STATE=appState
COSMOS_DB_CONTAINER_PROVIDERS=favoriteProviders
```

**Para obtener la key de Cosmos DB:**
- Ve a tu Cosmos DB → **"Keys"**
- Copia **"Primary Key"**

### Paso 2.3: Crear las Functions

He creado la estructura de funciones en la carpeta `backend/`. Sigue las instrucciones en `backend/README.md` para desplegarlas.

---

## Paso 3: Modificar Frontend

He creado nuevos servicios que reemplazan Firebase:

### Archivos Nuevos:
- `src/services/azure/apiService.js` - Cliente HTTP para Azure Functions
- `src/services/azure/appStateService.js` - Reemplaza `firestoreService.js`
- `src/services/azure/favoriteProvidersService.js` - Reemplaza el servicio de Firebase

### Cambios Necesarios:

1. **Actualizar imports en componentes**:
   - Cambiar `useFirestore` para usar el nuevo servicio
   - Cambiar `useFavoriteProviders` para usar el nuevo servicio

2. **Configurar URL de Azure Functions**:
   - Agregar variable `VITE_AZURE_FUNCTIONS_URL` en Azure Portal
   - O usar la URL directamente en el código

---

## Paso 4: Migrar Datos

Si tienes datos en Firebase que quieres migrar:

1. Exporta datos de Firebase (Firebase Console → Firestore → Export)
2. Usa el script `scripts/migrate-firebase-to-cosmos.js` (incluido)
3. Ejecuta el script para migrar los datos

---

## Paso 5: Desplegar

1. **Desplegar Azure Functions**:
   ```bash
   cd backend
   func azure functionapp publish quoter-api
   ```

2. **Configurar Frontend**:
   - Agregar `VITE_AZURE_FUNCTIONS_URL` en Azure Static Web Apps
   - Hacer push a GitHub para redeploy

3. **Verificar**:
   - Probar guardar un proveedor favorito
   - Verificar que aparezca en Cosmos DB
   - Probar el guardado automático del estado

---

## 🔄 Comparación: Firebase vs Azure

| Característica | Firebase | Azure |
|---------------|----------|-------|
| **Base de Datos** | Firestore | Cosmos DB |
| **Backend** | SDK directo | Azure Functions |
| **Tiempo Real** | onSnapshot | Polling o SignalR |
| **Costo** | Gratis hasta límites | Serverless (pago por uso) |
| **Escalabilidad** | Buena | Excelente |
| **Complejidad** | Baja | Media |

---

## ⚠️ Consideraciones

### Tiempo Real

Firebase tiene `onSnapshot` para tiempo real. En Azure puedes:
- Usar **polling** (consultar cada X segundos) - Implementado
- Usar **Azure SignalR** para tiempo real verdadero - Más complejo

### Autenticación

Si usas autenticación de Firebase, necesitarás migrar a:
- **Azure AD B2C** (recomendado)
- O mantener Firebase Auth solo para autenticación

---

## 📝 Próximos Pasos

1. ✅ Crear Cosmos DB
2. ✅ Crear Function App
3. ✅ Desplegar Functions
4. ✅ Actualizar Frontend
5. ✅ Migrar datos (opcional)
6. ✅ Probar todo
7. ✅ Remover dependencias de Firebase (opcional)

---

¿Necesitas ayuda con algún paso específico? Los archivos de código están listos en las carpetas `backend/` y `src/services/azure/`.
