# 🔍 Debug: Proveedores No Se Guardan

## Pasos para Diagnosticar

### 1. Verificar en la Consola del Navegador

Abre la consola (F12) y busca:
- ✅ Mensajes que digan "Intentando guardar proveedor"
- ✅ Mensajes que digan "Proveedor guardado exitosamente"
- ❌ Errores en rojo

### 2. Verificar Reglas de Firestore

Ve a Firebase Console → Firestore Database → Reglas

Asegúrate de que las reglas incluyan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/settings/appState {
      allow read, write: if true;
    }
    
    // ⚠️ ESTA REGLA ES CRÍTICA
    match /favoriteProviders/{providerId} {
      allow read, write: if true;
    }
  }
}
```

**IMPORTANTE:** Si no tienes la regla para `favoriteProviders`, los datos NO se guardarán.

### 3. Verificar Autenticación

En la consola, verifica:
- ¿Aparece "Firebase auth no está disponible"?
- ¿Hay errores de autenticación?

### 4. Verificar en Firestore Console

1. Ve a Firebase Console → Firestore Database → Datos
2. Busca la colección `favoriteProviders`
3. Si no existe, créala manualmente o verifica las reglas

### 5. Errores Comunes

#### Error: "Missing or insufficient permissions"
**Solución:** Actualiza las reglas de Firestore (ver paso 2)

#### Error: "Firestore no está disponible"
**Solución:** Verifica que Firebase esté configurado correctamente en `vite.config.js`

#### Error: "Collection not found"
**Solución:** La colección se crea automáticamente al guardar el primer documento. Verifica las reglas.

---

## Prueba Rápida

1. Abre la consola del navegador (F12)
2. Haz clic en "Guardar Mejor Proveedor"
3. Revisa los mensajes en la consola
4. Comparte los errores que aparezcan
