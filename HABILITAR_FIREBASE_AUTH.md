# Cómo Habilitar Firebase Authentication

El error `auth/configuration-not-found` indica que Firebase Authentication no está habilitado en tu proyecto de Firebase.

## Pasos para Habilitar Firebase Authentication

### 1. Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **petricorptest**

### 2. Habilitar Authentication
1. En el menú lateral, haz clic en **"Authentication"** (Autenticación)
2. Si es la primera vez, verás un botón **"Get Started"** (Comenzar)
3. Haz clic en **"Get Started"**

### 3. Habilitar Email/Password
1. En la pestaña **"Sign-in method"** (Método de inicio de sesión)
2. Haz clic en **"Email/Password"**
3. Activa el toggle **"Enable"** (Habilitar)
4. Haz clic en **"Save"** (Guardar)

### 4. Verificar Configuración
1. Asegúrate de que el **authDomain** en tu configuración sea: `petricorptest.firebaseapp.com`
2. Verifica que el **projectId** sea: `petricorptest`

## Después de Habilitar

Una vez habilitado Firebase Authentication:
1. Recarga la aplicación
2. El error `auth/configuration-not-found` debería desaparecer
3. Podrás iniciar sesión con:
   - Email: `Rolando.martinez@petricorp.com.mx`
   - Contraseña: `Rolando01M`

## Nota Importante

Si el usuario administrador no existe, se creará automáticamente la primera vez que uses la aplicación (después de habilitar Authentication).
