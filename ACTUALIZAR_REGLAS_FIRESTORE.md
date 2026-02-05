# Actualizar Reglas de Firestore - Colección Compartida de Usuarios

He cambiado la estructura de la base de datos para que **todos los usuarios del sistema** estén en una **colección compartida** en lugar de subcolecciones por administrador.

## Cambio de Estructura

### Antes:
```
modules/administracion-sistema/users/{userId}/usuarios/{usuarioId}
```
Cada administrador solo veía los usuarios que él creó.

### Ahora:
```
modules/administracion-sistema/usuarios/{usuarioId}
```
Todos los administradores pueden ver y gestionar todos los usuarios del sistema.

## Pasos para Actualizar las Reglas

### 1. Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **petricorptest**

### 2. Ir a Firestore Database
1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en la pestaña **"Rules"** (Reglas)

### 3. Actualizar las Reglas
Reemplaza la regla antigua con la nueva:

**Regla Antigua (eliminar):**
```javascript
match /modules/administracion-sistema/users/{userId}/usuarios/{usuarioId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Regla Nueva (agregar):**
```javascript
match /modules/administracion-sistema/usuarios/{usuarioId} {
  // Permitir lectura y escritura a cualquier usuario autenticado (todos los admins pueden gestionar usuarios)
  allow read, write: if request.auth != null;
}
```

### 4. Reglas Completas Actualizadas

Copia y pega estas reglas completas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para el módulo de administración de sistema - Usuarios (colección compartida)
    match /modules/administracion-sistema/usuarios/{usuarioId} {
      // Permitir lectura y escritura a cualquier usuario autenticado (todos los admins pueden gestionar usuarios)
      allow read, write: if request.auth != null;
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

### 5. Publicar las Reglas
1. Haz clic en el botón **"Publish"** (Publicar)
2. Espera a que se confirme la publicación

## Beneficios del Cambio

✅ **Todos los administradores pueden ver todos los usuarios del sistema**
✅ **Estructura más simple y centralizada**
✅ **Más fácil de mantener y consultar**
✅ **El administrador principal aparece en el listado**

## Nota Importante

Después de publicar las reglas:
1. Espera 2-3 minutos para que se propaguen
2. Recarga la aplicación
3. Ahora deberías ver **todos los usuarios del sistema** en el módulo de administración

Los usuarios que ya estaban en las subcolecciones antiguas seguirán funcionando, pero los nuevos usuarios se guardarán en la colección compartida.
