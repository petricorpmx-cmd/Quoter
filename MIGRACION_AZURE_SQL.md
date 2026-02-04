# 🗄️ Migración de Firebase a Azure SQL Database

## 📋 Resumen

Esta guía te ayudará a migrar de Firebase/Cosmos DB a Azure SQL Database.

---

## ✅ Paso 1: Crear Azure SQL Database

### En Azure Portal:

1. Ve a **Azure Portal** → **Create a resource**
2. Busca **"SQL Database"**
3. Haz clic en **"Create"**
4. Completa el formulario:
   - **Subscription**: Tu suscripción
   - **Resource group**: Crea uno nuevo o usa existente
   - **Database name**: `quoter-db` (o el nombre que prefieras)
   - **Server**: Crea un nuevo servidor SQL
     - **Server name**: `quoter-sql-server` (debe ser único)
     - **Location**: Elige la región más cercana
     - **Authentication method**: SQL authentication
     - **Admin username**: `quoteradmin` (o el que prefieras)
     - **Password**: Crea una contraseña segura (guárdala)
   - **Compute + storage**: 
     - **Service tier**: Basic (para empezar, puedes escalar después)
     - **Compute tier**: Serverless (ahorra costos)
5. Haz clic en **"Review + create"** → **"Create"**

### Obtener la cadena de conexión:

1. Ve a tu SQL Database → **"Connection strings"**
2. Copia la cadena de conexión de **ADO.NET** o **ODBC**
3. O anota estos valores:
   - **Server**: `tu-servidor.database.windows.net`
   - **Database**: `quoter-db`
   - **User**: `quoteradmin`
   - **Password**: (la que creaste)

---

## ✅ Paso 2: Crear el Esquema de Base de Datos

### Opción A: Usando Azure Portal Query Editor

1. Ve a tu SQL Database → **"Query editor"**
2. Inicia sesión con tu usuario y contraseña
3. Copia y pega el contenido de `backend/database/schema.sql`
4. Ejecuta el script (F5)

### Opción B: Usando Azure Data Studio o SQL Server Management Studio

1. Conecta a tu servidor SQL
2. Abre `backend/database/schema.sql`
3. Ejecuta el script

---

## ✅ Paso 3: Configurar Azure Functions

### Variables de Entorno en Azure Portal:

1. Ve a tu **Azure Function App** → **Configuration** → **Application settings**
2. Agrega estas variables:
   - `SQL_SERVER`: `tu-servidor.database.windows.net`
   - `SQL_DATABASE`: `quoter-db`
   - `SQL_USER`: `quoteradmin`
   - `SQL_PASSWORD`: `tu-contraseña`

### O en local.settings.json (para desarrollo local):

Copia `backend/local.settings.json.example` a `backend/local.settings.json` y completa los valores.

---

## ✅ Paso 4: Actualizar Frontend

El frontend ya está preparado para usar Azure Functions. Solo necesitas:

1. **Actualizar la URL base de las APIs** en `src/services/azure/apiService.js`
2. **Asegurarte de que las Azure Functions estén desplegadas**

---

## ✅ Paso 5: Desplegar Azure Functions

### Opción A: Desde Visual Studio Code

1. Instala la extensión **"Azure Functions"**
2. Abre la carpeta `backend`
3. Haz clic derecho en `backend` → **"Deploy to Function App"**
4. Selecciona tu Function App o créala nueva

### Opción B: Desde Azure Portal

1. Ve a tu **Function App** → **Deployment Center**
2. Conecta tu repositorio de GitHub
3. Configura el build para usar la carpeta `backend`

### Opción C: Desde CLI

```bash
cd backend
func azure functionapp publish tu-function-app-name
```

---

## ✅ Paso 6: Configurar Firewall de Azure SQL

Por defecto, Azure SQL bloquea todas las conexiones externas. Necesitas permitir:

1. Ve a tu **SQL Server** → **Security** → **Networking**
2. En **"Public network access"**: Selecciona **"Selected networks"**
3. En **"Firewall rules"**:
   - Agrega una regla para permitir servicios de Azure: **"Allow Azure services and resources to access this server"** = **Yes**
   - Agrega tu IP actual si quieres probar desde local
4. Haz clic en **"Save"**

---

## ✅ Paso 7: Probar la Migración

1. **Prueba las Azure Functions**:
   - Ve a tu Function App → **Functions**
   - Prueba cada función manualmente

2. **Prueba el Frontend**:
   - Abre tu aplicación
   - Intenta guardar items
   - Intenta guardar proveedores favoritos
   - Verifica que los datos se guarden en SQL

3. **Verifica en SQL Database**:
   - Ve a tu SQL Database → **Query editor**
   - Ejecuta: `SELECT * FROM AppState`
   - Ejecuta: `SELECT * FROM FavoriteProviders`

---

## 🔍 Troubleshooting

### Error: "Cannot connect to SQL Server"

- Verifica que el firewall permita conexiones de Azure
- Verifica que las credenciales sean correctas
- Verifica que el servidor SQL esté activo

### Error: "Login failed for user"

- Verifica el usuario y contraseña
- Asegúrate de usar SQL authentication, no Azure AD

### Error: "Invalid object name 'AppState'"

- Verifica que ejecutaste el script `schema.sql`
- Verifica que estás conectado a la base de datos correcta

---

## 📊 Comparación: Firebase vs Azure SQL

| Característica | Firebase/Firestore | Azure SQL |
|---------------|-------------------|------------|
| Tipo | NoSQL (Documento) | SQL (Relacional) |
| Escalabilidad | Automática | Manual (pero más control) |
| Costo | Pay-as-you-go | Más predecible |
| Consultas | Limitadas | SQL completo |
| Transacciones | Limitadas | ACID completo |
| Migración | Fácil | Requiere esquema |

---

## 🎯 Próximos Pasos

1. ✅ Crear Azure SQL Database
2. ✅ Ejecutar schema.sql
3. ✅ Configurar variables de entorno
4. ✅ Desplegar Azure Functions
5. ✅ Probar la aplicación
6. ⚠️ Remover dependencias de Firebase del frontend (opcional)

---

**Una vez completados estos pasos, tu aplicación usará Azure SQL Database en lugar de Firebase.** 🚀
