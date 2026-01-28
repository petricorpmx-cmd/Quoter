# 🔥 Pasos para Crear Firestore Database

## Paso 1: Crear la Base de Datos

1. Haz clic en el botón naranja que dice **"Crear base de datos"** (Create database)

## Paso 2: Configurar la Base de Datos

Después de hacer clic, te aparecerá un modal con opciones:

1. **Modo de producción o modo de prueba:**
   - Selecciona **"Modo de prueba"** (Start in test mode)
   - Esto permite leer y escribir sin autenticación (perfecto para desarrollo)

2. **Ubicación:**
   - Elige una ubicación cercana a ti
   - Opciones recomendadas:
     - **"us-central"** (Estados Unidos - Central)
     - **"southamerica-east1"** (Brasil - Este)
     - **"us-east1"** (Estados Unidos - Este)
   - Haz clic en **"Siguiente"** o **"Next"**

3. **Habilitar:**
   - Haz clic en **"Habilitar"** o **"Enable"**
   - Espera unos segundos a que se cree la base de datos

## Paso 3: Configurar Reglas de Seguridad

Una vez creada la base de datos:

1. En la parte superior, verás pestañas: **"Datos"** (Data) y **"Reglas"** (Rules)
2. Haz clic en la pestaña **"Reglas"** (Rules)
3. Verás un editor de código con reglas por defecto
4. Reemplaza todo el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/settings/appState {
      allow read, write: if true;
    }
  }
}
```

5. Haz clic en **"Publicar"** (Publish)

## Paso 4: ¡Listo!

Una vez que hayas creado la base de datos y configurado las reglas, avísame y reiniciaré el servidor para que todo funcione.

---

**¿Ya creaste la base de datos?** Si tienes alguna duda, avísame.
