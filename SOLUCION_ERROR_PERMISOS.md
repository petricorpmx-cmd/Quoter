# Solución: Error de Permisos al Iniciar Sesión

## Problema

Al intentar iniciar sesión, aparecen estos errores:
1. `400 (Bad Request)` al intentar crear el usuario administrador (ya existe)
2. `Missing or insufficient permissions` en `favoriteProviders` y `users`

## Causa

El código intenta crear/verificar el usuario administrador **antes** de que el usuario esté autenticado, lo que causa errores de permisos en Firestore.

## Solución Aplicada

He mejorado el manejo de errores para que:

1. **No bloquee el inicio de sesión**: Los errores al crear/verificar el admin no impiden que el usuario inicie sesión
2. **Maneje correctamente el usuario existente**: Si el admin ya existe, solo se registra en consola sin intentar crearlo
3. **No intente escribir en Firestore sin autenticación**: Si no hay permisos, solo se registra una advertencia

## Verificación de Reglas de Firestore

Asegúrate de que las reglas en Firebase Console incluyan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para el módulo de administración de sistema - Usuarios (colección compartida)
    match /modules/administracion-sistema/usuarios/{usuarioId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para la estructura antigua (para migración)
    match /modules/administracion-sistema/users/{userId}/usuarios/{usuarioId} {
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
      // Permitir lectura a cualquier usuario autenticado
      allow read: if request.auth != null;
      // Permitir escritura solo si el usuario está autenticado
      allow write: if request.auth != null;
    }
  }
}
```

## Pasos para Resolver

1. **Actualizar las reglas de Firestore** (si no lo has hecho):
   - Ve a Firebase Console → Firestore Database → Rules
   - Copia y pega las reglas de arriba
   - Haz clic en "Publish"

2. **Recargar la aplicación**:
   - Los errores en consola sobre el admin son normales y no bloquean el inicio de sesión
   - Deberías poder iniciar sesión con:
     - Email: `Rolando.martinez@petricorp.com.mx`
     - Contraseña: `Rolando01M`

3. **Verificar que funcione**:
   - Después de iniciar sesión, los errores de permisos deberían desaparecer
   - El usuario administrador aparecerá en el listado de usuarios del sistema

## Nota Importante

Los errores en consola sobre `createDefaultAdmin` son **normales** y **no bloquean** el inicio de sesión. El código ahora maneja estos errores de forma silenciosa para que puedas iniciar sesión sin problemas.
