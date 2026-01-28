# 🔧 Opciones de Backend y Base de Datos en Azure

Tu proyecto actualmente usa **Firebase** como backend/BD. Aquí tienes las opciones para Azure:

---

## 📊 Comparación de Opciones

| Opción | Complejidad | Costo | Tiempo de Migración | Escalabilidad |
|--------|-------------|-------|---------------------|---------------|
| **Mantener Firebase** | ⭐ Baja | 💰 Gratis (hasta límites) | ✅ 0 horas | ⭐⭐⭐ Buena |
| **Azure Cosmos DB** | ⭐⭐ Media | 💰💰 Bajo-Medio | ⏱️ 2-4 horas | ⭐⭐⭐⭐⭐ Excelente |
| **Azure Functions + SQL** | ⭐⭐⭐ Alta | 💰💰💰 Medio-Alto | ⏱️ 4-8 horas | ⭐⭐⭐⭐⭐ Excelente |

---

## Opción 1: Mantener Firebase (Recomendado para empezar) ✅

### ¿Por qué mantener Firebase?

- ✅ **Ya funciona**: Tu código ya está configurado
- ✅ **Sin cambios**: No necesitas modificar código
- ✅ **Gratis**: Plan gratuito generoso
- ✅ **Funciona desde Azure**: Firebase funciona desde cualquier lugar

### Configuración

Solo necesitas configurar las variables de entorno en Azure Static Web Apps (ver `AZURE_SETUP.md`).

**Ventajas:**
- ✅ Cero tiempo de migración
- ✅ Funciona inmediatamente
- ✅ Puedes migrar después si lo necesitas

**Desventajas:**
- ⚠️ No está "todo en Azure"
- ⚠️ Dependes de dos proveedores (Azure + Google)

---

## Opción 2: Migrar a Azure Cosmos DB 🔄

### Arquitectura Propuesta

```
Frontend (Static Web App)
    ↓
Azure Functions (Backend API)
    ↓
Azure Cosmos DB (Base de datos)
```

### Pasos para Migrar

#### 1. Crear Azure Cosmos DB

```bash
# Usando Azure CLI
az cosmosdb create \
  --name analizador-pro-db \
  --resource-group tu-resource-group \
  --locations regionName=eastus
```

O desde Azure Portal:
1. Busca "Azure Cosmos DB"
2. Crea nuevo → Elige API (MongoDB o SQL)
3. Configura región y recursos

#### 2. Crear Azure Functions

Necesitarás crear funciones para:
- `GET /api/products` - Obtener productos
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `GET /api/providers` - Obtener proveedores
- etc.

#### 3. Modificar el Código Frontend

Cambiar de Firebase SDK a llamadas HTTP a Azure Functions:

**Antes (Firebase):**
```javascript
import { collection, getDocs } from 'firebase/firestore';
const products = await getDocs(collection(db, 'products'));
```

**Después (Azure Functions):**
```javascript
const response = await fetch('/api/products');
const products = await response.json();
```

#### 4. Migrar Datos

Script para migrar datos de Firebase a Cosmos DB:

```javascript
// migrate-firebase-to-cosmos.js
import { collection, getDocs } from 'firebase/firestore';
import { CosmosClient } from '@azure/cosmos';

// Leer de Firebase
const firebaseData = await getDocs(collection(db, 'products'));

// Escribir a Cosmos DB
const client = new CosmosClient({ endpoint, key });
const { database } = await client.databases.createIfNotExists({ id: 'analizador-pro' });
const { container } = await database.containers.createIfNotExists({ id: 'products' });

for (const doc of firebaseData.docs) {
  await container.items.create(doc.data());
}
```

### Estructura de Proyecto Propuesta

```
proyecto/
├── frontend/          # Tu código React actual
├── backend/          # Nuevo: Azure Functions
│   ├── functions/
│   │   ├── products.js
│   │   ├── providers.js
│   │   └── ...
│   └── package.json
└── azure-pipelines.yml
```

---

## Opción 3: Azure Functions + Azure SQL Database 🗄️

### Arquitectura

```
Frontend (Static Web App)
    ↓
Azure Functions (Backend API)
    ↓
Azure SQL Database (Base de datos relacional)
```

### Ventajas

- ✅ Base de datos relacional (SQL)
- ✅ Transacciones ACID
- ✅ Consultas SQL complejas
- ✅ Integración con herramientas SQL existentes

### Desventajas

- ⚠️ Más complejo de configurar
- ⚠️ Requiere más código backend
- ⚠️ Más costoso que Cosmos DB

### Estructura de Base de Datos Propuesta

```sql
-- Tabla de Productos
CREATE TABLE Products (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(255),
    Description NVARCHAR(MAX),
    CreatedAt DATETIME2,
    UpdatedAt DATETIME2
);

-- Tabla de Proveedores
CREATE TABLE Providers (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(255),
    ContactInfo NVARCHAR(MAX),
    CreatedAt DATETIME2
);

-- Tabla de Precios (relación muchos a muchos)
CREATE TABLE ProductPrices (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    ProductId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Products(Id),
    ProviderId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Providers(Id),
    Price DECIMAL(18,2),
    Currency NVARCHAR(10),
    ValidFrom DATETIME2,
    ValidTo DATETIME2
);
```

---

## 🎯 Recomendación

### Para empezar rápido:
**Mantén Firebase** → Configura variables de entorno en Azure y listo.

### Para producción a largo plazo:
**Migra a Azure Cosmos DB** → Todo en Azure, mejor escalabilidad.

### Si necesitas SQL:
**Azure Functions + SQL Database** → Para casos específicos que requieren SQL.

---

## 📝 Plan de Migración (si decides migrar)

### Fase 1: Preparación (1 hora)
- [ ] Crear Azure Cosmos DB
- [ ] Crear Azure Functions App
- [ ] Configurar variables de entorno

### Fase 2: Desarrollo Backend (2-3 horas)
- [ ] Crear funciones CRUD básicas
- [ ] Probar endpoints con Postman
- [ ] Documentar API

### Fase 3: Migración Frontend (1-2 horas)
- [ ] Crear servicio para llamadas API
- [ ] Reemplazar llamadas Firebase
- [ ] Probar funcionalidad

### Fase 4: Migración de Datos (30 min)
- [ ] Script de migración
- [ ] Validar datos migrados
- [ ] Hacer backup

### Fase 5: Despliegue (30 min)
- [ ] Deploy de Functions
- [ ] Actualizar variables de entorno
- [ ] Probar en producción

**Total estimado: 5-7 horas**

---

## 🆘 ¿Necesitas ayuda?

Si decides migrar, puedo ayudarte a:
1. Crear la estructura de Azure Functions
2. Modificar el código frontend
3. Crear scripts de migración
4. Configurar CI/CD

Solo dime qué opción prefieres y empezamos.
