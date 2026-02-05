# Estructura de Base de Datos - Analizador Pro

## 📊 Estructura Actual de Firestore

### 1. **Colecciones Principales**

Actualmente tu base de datos tiene esta estructura:

```
Firestore Database
│
├── artifacts/
│   └── {appId}/
│       └── public/
│           └── data/
│               └── settings/
│                   └── appState/          # Estado del Analizador Pro
│                       ├── items: []       # Lista de productos
│                       ├── ivaRate: 16    # Tasa de IVA
│                       └── lastUpdated: timestamp
│
└── favoriteProviders/                      # Proveedores guardados
    └── {providerId}/
        ├── nombre: string
        ├── costo: number
        ├── aplicaIva: boolean
        ├── margen: number
        ├── link: string
        ├── productoNombre: string
        ├── productoId: string
        ├── cantidad: number
        ├── calculos: object
        ├── ivaRate: number
        ├── appId: string
        ├── savedAt: ISO string
        └── savedAtTimestamp: number
```

---

## 🚀 Cómo Agregar Módulos Adicionales

### **Opción 1: Estructura por Módulo (Recomendada)**

Cada módulo tiene su propia colección y estructura:

```
Firestore Database
│
├── modules/
│   ├── analizador-pro/                    # Módulo Analizador Pro
│   │   └── users/
│   │       └── {userId}/
│   │           ├── appState/              # Estado del módulo
│   │           │   ├── items: []
│   │           │   ├── ivaRate: 16
│   │           │   └── lastUpdated: timestamp
│   │           └── favoriteProviders/     # Proveedores guardados
│   │               └── {providerId}/
│   │
│   ├── inventario/                        # Nuevo módulo: Inventario
│   │   └── users/
│   │       └── {userId}/
│   │           ├── productos/
│   │           │   └── {productoId}/
│   │           │       ├── nombre: string
│   │           │       ├── cantidad: number
│   │           │       ├── precio: number
│   │           │       └── categoria: string
│   │           └── categorias/
│   │               └── {categoriaId}/
│   │
│   ├── facturacion/                       # Nuevo módulo: Facturación
│   │   └── users/
│   │       └── {userId}/
│   │           ├── facturas/
│   │           │   └── {facturaId}/
│   │           │       ├── numero: string
│   │           │       ├── fecha: timestamp
│   │           │       ├── cliente: object
│   │           │       ├── items: []
│   │           │       └── total: number
│   │           └── clientes/
│   │               └── {clienteId}/
│   │
│   └── reportes/                          # Nuevo módulo: Reportes
│       └── users/
│           └── {userId}/
│               └── reportes/
│                   └── {reporteId}/
│                       ├── tipo: string
│                       ├── fecha: timestamp
│                       └── datos: object
```

### **Opción 2: Estructura por Usuario (Alternativa)**

Todos los módulos bajo el mismo usuario:

```
Firestore Database
│
└── users/
    └── {userId}/
        ├── analizador-pro/
        │   ├── appState/
        │   └── favoriteProviders/
        ├── inventario/
        │   ├── productos/
        │   └── categorias/
        ├── facturacion/
        │   ├── facturas/
        │   └── clientes/
        └── reportes/
            └── reportes/
```

---

## 💻 Implementación en Código

### **1. Crear Servicio para Nuevo Módulo**

Ejemplo: Módulo de Inventario

```javascript
// src/services/firebase/inventarioService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db, appId } from './config';

const INVENTARIO_COLLECTION = 'modules/inventario/users';

export const getInventarioCollection = (userId) => {
  return `${INVENTARIO_COLLECTION}/${userId}/productos`;
};

// Guardar producto
export const saveProducto = async (userId, productoData) => {
  if (!db) throw new Error('Firestore no está disponible');
  
  const collectionRef = collection(db, getInventarioCollection(userId));
  const docRef = await addDoc(collectionRef, {
    ...productoData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    appId
  });
  
  return docRef.id;
};

// Obtener productos
export const getProductos = async (userId) => {
  if (!db) return [];
  
  const collectionRef = collection(db, getInventarioCollection(userId));
  const q = query(collectionRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Suscribirse a cambios en tiempo real
export const subscribeToProductos = (userId, callback, errorCallback) => {
  if (!db) {
    if (errorCallback) errorCallback(new Error('Firestore no está disponible'));
    return () => {};
  }
  
  const collectionRef = collection(db, getInventarioCollection(userId));
  const q = query(collectionRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const productos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(productos);
  }, errorCallback);
};

// Actualizar producto
export const updateProducto = async (userId, productoId, data) => {
  if (!db) throw new Error('Firestore no está disponible');
  
  const docRef = doc(db, getInventarioCollection(userId), productoId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

// Eliminar producto
export const deleteProducto = async (userId, productoId) => {
  if (!db) throw new Error('Firestore no está disponible');
  
  const docRef = doc(db, getInventarioCollection(userId), productoId);
  await deleteDoc(docRef);
};
```

### **2. Crear Hook Personalizado**

```javascript
// src/hooks/useInventario.js
import { useState, useEffect } from 'react';
import { 
  subscribeToProductos, 
  saveProducto, 
  updateProducto, 
  deleteProducto 
} from '../services/firebase/inventarioService';

export const useInventario = (user) => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!user) {
      setProductos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToProductos(
      user.uid,
      (productos) => {
        setProductos(productos);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error al obtener productos:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Guardar producto
  const guardarProducto = async (productoData) => {
    if (!user) return null;
    
    setIsSaving(true);
    try {
      const id = await saveProducto(user.uid, productoData);
      return id;
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Actualizar producto
  const actualizarProducto = async (productoId, data) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProducto(user.uid, productoId, data);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (productoId) => {
    if (!user) return;
    
    try {
      await deleteProducto(user.uid, productoId);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  };

  return {
    productos,
    isLoading,
    isSaving,
    guardarProducto,
    actualizarProducto,
    eliminarProducto
  };
};
```

### **3. Actualizar el Sidebar para Nuevos Módulos**

```javascript
// src/components/Sidebar/Sidebar.jsx
const menuItems = [
  {
    id: 'analizador',
    label: 'Analizador Pro',
    icon: Calculator,
    isMain: true,
    submenu: [
      {
        id: 'guardados',
        label: 'Guardados',
        icon: Star
      }
    ]
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: Package,
    isMain: false,
    submenu: [
      {
        id: 'productos',
        label: 'Productos',
        icon: Box
      },
      {
        id: 'categorias',
        label: 'Categorías',
        icon: Folder
      }
    ]
  },
  {
    id: 'facturacion',
    label: 'Facturación',
    icon: FileText,
    isMain: false,
    submenu: [
      {
        id: 'facturas',
        label: 'Facturas',
        icon: Receipt
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: Users
      }
    ]
  }
];
```

---

## 🔐 Reglas de Seguridad de Firestore

Actualiza las reglas en Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para Analizador Pro
    match /artifacts/{appId}/public/data/settings/appState {
      allow read, write: if request.auth != null;
    }
    
    match /favoriteProviders/{providerId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para módulos adicionales
    match /modules/{moduleId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regla general (más restrictiva)
    match /{document=**} {
      allow read, write: if false; // Denegar todo por defecto
    }
  }
}
```

---

## 📋 Ventajas de Esta Estructura

1. **Escalabilidad**: Fácil agregar nuevos módulos sin afectar los existentes
2. **Separación de Datos**: Cada módulo tiene sus propios datos
3. **Seguridad**: Reglas de Firestore por módulo y usuario
4. **Mantenibilidad**: Código organizado y fácil de mantener
5. **Rendimiento**: Consultas más eficientes al tener datos separados
6. **Multi-usuario**: Cada usuario tiene sus propios datos

---

## 🎯 Ejemplo Completo: Agregar Módulo de Inventario

### Paso 1: Crear el servicio
```bash
src/services/firebase/inventarioService.js
```

### Paso 2: Crear el hook
```bash
src/hooks/useInventario.js
```

### Paso 3: Crear el componente
```bash
src/components/Inventario/Inventario.jsx
```

### Paso 4: Agregar al Sidebar
Actualizar `src/components/Sidebar/Sidebar.jsx`

### Paso 5: Integrar en App.jsx
```javascript
import { useInventario } from './hooks/useInventario';

const App = () => {
  const user = useAuth();
  const inventario = useInventario(user);
  
  // ... resto del código
};
```

---

## 🔄 Migración de Datos Existentes

Si ya tienes datos en la estructura antigua, puedes crear un script de migración:

```javascript
// scripts/migrateToModules.js
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase/config';

const migrateData = async (userId) => {
  // Obtener datos antiguos
  const oldData = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'settings', 'appState'));
  
  // Migrar a nueva estructura
  const newPath = doc(db, 'modules', 'analizador-pro', 'users', userId, 'appState');
  await setDoc(newPath, oldData.data());
  
  console.log('Migración completada');
};
```

---

## 📚 Recursos Adicionales

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
