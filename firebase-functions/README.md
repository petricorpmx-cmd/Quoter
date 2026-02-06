# Cloud Functions - Actualización de contraseña

Esta función permite que los administradores restablezcan la contraseña temporal de un usuario cuando la ha olvidado.

## Despliegue

1. Instala las dependencias:
   ```bash
   cd firebase-functions
   npm install
   ```

2. Despliega las funciones en Firebase:
   ```bash
   npm run deploy
   ```
   
   O desde la raíz del proyecto:
   ```bash
   firebase deploy --only functions
   ```

**Nota:** Necesitas el plan Blaze (facturación) de Firebase para desplegar Cloud Functions.

## Función disponible

- `updateUserPassword`: Permite a los administradores establecer una nueva contraseña temporal para cualquier usuario del sistema.
