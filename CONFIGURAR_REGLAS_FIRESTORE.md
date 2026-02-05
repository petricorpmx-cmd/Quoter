# Configurar Reglas de Firestore para Usuarios del Sistema

El error "Missing or insufficient permissions" indica que las reglas de seguridad de Firestore no permiten la operación que se está intentando realizar.

## Pasos para Configurar las Reglas

### 1. Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **petricorptest**

### 2. Ir a Firestore Database
1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en la pestaña **"Rules"** (Reglas)

### 3. Copiar y Pegar las Reglas
Copia y pega el siguiente código en el editor de reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para el módulo de administración de sistema - Usuarios
    match /modules/administracion-sistema/users/{userId}/usuarios/{usuarioId} {
      // Permitir lectura y escritura solo al usuario autenticado que es dueño de la colección
      allow read, write: if request.auth != null && request.auth.uid == userId;
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

## Explicación de las Reglas

- **`modules/administracion-sistema/users/{userId}/usuarios/{usuarioId}`**: 
  - Solo permite acceso al usuario autenticado cuyo `uid` coincide con el `userId` en la ruta
  - Esto asegura que cada usuario solo pueda gestionar sus propios usuarios del sistema

- **`favoriteProviders/{providerId}`**: 
  - Permite acceso a cualquier usuario autenticado
  - Mantiene compatibilidad con la funcionalidad existente

- **`artifacts/{appId}/public/data/settings/appState`**: 
  - Permite acceso a cualquier usuario autenticado
  - Mantiene compatibilidad con la funcionalidad existente

- **`users/{email}`**: 
  - Permite acceso a cualquier usuario autenticado
  - Se usa para almacenar información del perfil de usuario

## Nota Importante

Después de publicar las reglas, puede tomar unos minutos para que se propaguen. Si el error persiste:

1. Espera 2-3 minutos
2. Recarga la aplicación
3. Intenta crear un usuario nuevamente

## Verificación

Para verificar que las reglas están funcionando:

1. Intenta crear un nuevo usuario en el módulo "Usuarios del sistema"
2. Si funciona correctamente, deberías ver el usuario en la lista
3. El administrador también debería aparecer en la lista
