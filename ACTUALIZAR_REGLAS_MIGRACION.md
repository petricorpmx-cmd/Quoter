# Actualizar Reglas de Firestore - Permitir Migración

El error "Missing or insufficient permissions" indica que las reglas de Firestore no permiten leer la estructura antigua para migrar los usuarios.

## Pasos para Actualizar las Reglas

### 1. Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **petricorptest**

### 2. Ir a Firestore Database
1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en la pestaña **"Rules"** (Reglas)

### 3. Reemplazar las Reglas Completas

Copia y pega estas reglas completas (incluyen permisos para la estructura antigua):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para el módulo de administración de sistema - Usuarios (colección compartida)
    match /modules/administracion-sistema/usuarios/{usuarioId} {
      // Permitir lectura y escritura a cualquier usuario autenticado (todos los admins pueden gestionar usuarios)
      allow read, write: if request.auth != null;
    }
    
    // Reglas para la estructura antigua (para migración)
    match /modules/administracion-sistema/users/{userId}/usuarios/{usuarioId} {
      // Permitir lectura para migración, escritura solo al dueño
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permitir listar los documentos de users para migración
    match /modules/administracion-sistema/users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Reglas para proveedores favoritos (mantener compatibilidad)
    match /favoriteProviders/{providerId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para artifacts (mantener compatibilidad)
    match /artifacts/{appId}/public/data/settings/appState {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para users (perfil de usuario)
    match /users/{email} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Publicar las Reglas
1. Haz clic en el botón **"Publish"** (Publicar)
2. Espera a que se confirme la publicación

## Explicación de las Nuevas Reglas

Las reglas ahora incluyen:

1. **`modules/administracion-sistema/users/{userId}/usuarios/{usuarioId}`**:
   - `allow read`: Cualquier usuario autenticado puede leer (para migración)
   - `allow write`: Solo el dueño puede escribir (seguridad)

2. **`modules/administracion-sistema/users/{userId}`**:
   - `allow read`: Permite listar los documentos de usuarios para encontrar todas las subcolecciones

## Después de Actualizar

1. Espera 2-3 minutos para que las reglas se propaguen
2. Recarga la aplicación (F5)
3. Abre la consola del navegador (F12) para ver los mensajes de migración
4. Deberías ver mensajes como:
   - "🔍 Buscando usuarios en estructura antigua..."
   - "📦 Encontrados X usuarios en estructura antigua, migrando..."
   - "✅ Usuario migrado: [email]"

Después de la migración, todos los usuarios aparecerán en el listado.
