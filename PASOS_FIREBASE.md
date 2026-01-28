# 🔥 Pasos para Agregar App Web en Firebase

## Paso 1: Haz clic en "+ Agregar app"

1. En la pantalla principal de Firebase, verás un botón grande que dice **"+ Agregar app"** (Add app)
2. Haz clic en ese botón

## Paso 2: Selecciona "Web"

1. Después de hacer clic, te aparecerán opciones para diferentes plataformas:
   - **Web** (ícono </>)
   - iOS (ícono de manzana)
   - Android (ícono de robot)
2. Haz clic en el ícono de **Web** (</>)

## Paso 3: Registra tu app

1. Te pedirá un **"App nickname"** (apodo de la app)
   - Puedes poner: "analizador-web" o el nombre que quieras
2. **Firebase Hosting**: Puedes dejarlo desactivado por ahora (no es necesario)
3. Haz clic en **"Register app"** (Registrar app)

## Paso 4: Copia la configuración

1. Después de registrar, te mostrará un código JavaScript con la configuración
2. Se verá algo así:

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

**¡Copia esos valores y me los pasas!**

---

Si no ves la opción de Web después de hacer clic en "Agregar app", avísame y te ayudo de otra forma.
