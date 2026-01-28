# 🔥 Guía Rápida: Configurar Firebase

## Paso 1: Crear Proyecto en Firebase

1. Ve a: https://console.firebase.google.com/
2. Haz clic en "Add project" (Agregar proyecto)
3. **Nombre del proyecto**: Ponle el nombre que quieras (ej: "analizador-pro")
4. **Google Analytics**: Puedes desactivarlo si quieres (no es necesario)
5. Haz clic en "Create project" (Crear proyecto)
6. Espera a que se cree (unos segundos)

## Paso 2: Registrar la App Web

1. Una vez creado el proyecto, verás la pantalla de inicio
2. Haz clic en el ícono de **Web** (</>) que dice "Add app"
3. **App nickname**: Ponle un nombre (ej: "analizador-web")
4. **Firebase Hosting**: Puedes desactivarlo por ahora
5. Haz clic en "Register app"
6. **¡IMPORTANTE!** Copia la configuración que aparece (algo como esto):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Paso 3: Activar Firestore Database

1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Create database"**
3. Selecciona **"Start in test mode"** (modo de prueba - para desarrollo)
4. Elige una **ubicación** (elige la más cercana a ti, ej: "us-central")
5. Haz clic en **"Enable"** (Habilitar)
6. Espera a que se cree (unos segundos)

## Paso 4: Listo!

Una vez que tengas la configuración, me la pasas y la configuro en el código.

---

**¿Necesitas ayuda en algún paso?** Avísame y te guío.
