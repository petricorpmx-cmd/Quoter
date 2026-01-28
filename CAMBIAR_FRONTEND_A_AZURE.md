# 🔄 Cambiar Frontend de Firebase a Azure

Esta guía explica cómo modificar el código del frontend para usar Azure Functions en lugar de Firebase.

---

## 📝 Cambios Necesarios

### 1. Actualizar `src/hooks/useFirestore.js`

**Antes (Firebase):**
```javascript
import { subscribeToAppState, saveAppState } from '../services/firebase/firestoreService';
```

**Después (Azure):**
```javascript
import { subscribeToAppState, saveAppState } from '../services/azure/appStateService';
```

### 2. Actualizar `src/hooks/useFavoriteProviders.js`

**Antes (Firebase):**
```javascript
import {
  saveFavoriteProvider,
  getFavoriteProviders,
  subscribeToFavoriteProviders,
  deleteFavoriteProvider
} from '../services/firebase/favoriteProvidersService';
```

**Después (Azure):**
```javascript
import {
  saveFavoriteProvider,
  getFavoriteProviders,
  subscribeToFavoriteProviders,
  deleteFavoriteProvider
} from '../services/azure/favoriteProvidersService';
```

---

## ⚙️ Configurar Variables de Entorno

### En Azure Static Web Apps:

1. Ve a Azure Portal → Tu Static Web App → **"Configuration"**
2. Agrega estas variables:

```
VITE_AZURE_FUNCTIONS_URL=https://quoter-api.azurewebsites.net/api
VITE_APP_ID=default-app-id
```

**Nota**: Reemplaza `quoter-api` con el nombre de tu Function App.

### En desarrollo local:

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_AZURE_FUNCTIONS_URL=http://localhost:7071/api
VITE_APP_ID=default-app-id
```

---

## 🔄 Proceso de Migración Paso a Paso

### Paso 1: Mantener ambos servicios (transición)

Puedes mantener ambos servicios y cambiar gradualmente:

```javascript
// En useFirestore.js
import { subscribeToAppState as subscribeFirebase } from '../services/firebase/firestoreService';
import { subscribeToAppState as subscribeAzure } from '../services/azure/appStateService';

// Usar Azure si está disponible, sino Firebase
const useAzure = import.meta.env.VITE_AZURE_FUNCTIONS_URL;
const subscribeToAppState = useAzure ? subscribeAzure : subscribeFirebase;
```

### Paso 2: Cambiar completamente a Azure

Una vez que Azure Functions esté funcionando:

1. Cambia los imports en `useFirestore.js`
2. Cambia los imports en `useFavoriteProviders.js`
3. Prueba todas las funcionalidades
4. Si todo funciona, puedes remover las dependencias de Firebase (opcional)

---

## ⚠️ Diferencias Importantes

### Tiempo Real

- **Firebase**: Usa `onSnapshot` para tiempo real instantáneo
- **Azure**: Usa polling (consulta cada X segundos)

**Impacto**: Los cambios pueden tardar unos segundos en aparecer en otros dispositivos.

### Manejo de Errores

Los servicios de Azure retornan errores HTTP estándar. Asegúrate de manejar:

```javascript
try {
  await saveAppState(data);
} catch (error) {
  console.error('Error:', error.message);
  // Mostrar mensaje al usuario
}
```

---

## ✅ Checklist de Migración

- [ ] Azure Cosmos DB creado
- [ ] Azure Functions desplegadas y funcionando
- [ ] Variables de entorno configuradas en Azure
- [ ] Imports cambiados en `useFirestore.js`
- [ ] Imports cambiados en `useFavoriteProviders.js`
- [ ] Probado guardar estado de app
- [ ] Probado guardar proveedor favorito
- [ ] Probado eliminar proveedor favorito
- [ ] Verificado que los datos aparecen en Cosmos DB
- [ ] Removido código de Firebase (opcional)

---

## 🆘 Solución de Problemas

### Error: "Failed to fetch"

**Causa**: La URL de Azure Functions no está configurada o es incorrecta.

**Solución**:
1. Verifica que `VITE_AZURE_FUNCTIONS_URL` esté configurada
2. Verifica que la URL sea correcta (debe terminar en `/api`)
3. Verifica que Azure Functions esté desplegado y funcionando

### Error: "CORS policy"

**Causa**: Azure Functions no permite CORS desde tu dominio.

**Solución**:
1. Ve a Azure Functions → **"CORS"**
2. Agrega tu dominio de Static Web App
3. O agrega `*` para desarrollo (no recomendado para producción)

### Los datos no se guardan

**Causa**: Variables de entorno de Cosmos DB no configuradas en Functions.

**Solución**:
1. Ve a Function App → **"Configuration"**
2. Verifica que todas las variables `COSMOS_DB_*` estén configuradas
3. Reinicia la Function App después de agregar variables

---

## 📚 Archivos Modificados

- `src/hooks/useFirestore.js` - Cambiar imports
- `src/hooks/useFavoriteProviders.js` - Cambiar imports
- `.env` - Agregar `VITE_AZURE_FUNCTIONS_URL`

## 📚 Archivos Nuevos (ya creados)

- `src/services/azure/apiService.js` - Cliente HTTP
- `src/services/azure/appStateService.js` - Servicio de estado
- `src/services/azure/favoriteProvidersService.js` - Servicio de proveedores

---

¿Listo para migrar? Sigue los pasos arriba y si tienes dudas, consulta `MIGRACION_AZURE_COMPLETA.md`.
