# 🔥 Configurar Firestore Database

## Paso 1: Activar Firestore

1. En el menú lateral izquierdo de Firebase Console, busca **"Firestore Database"**
2. Haz clic en **"Firestore Database"**
3. Si es la primera vez, haz clic en **"Create database"** (Crear base de datos)
4. Selecciona **"Start in test mode"** (Iniciar en modo de prueba)
5. Elige una **ubicación** (elige la más cercana a ti, por ejemplo: "us-central" o "southamerica-east1")
6. Haz clic en **"Enable"** (Habilitar)
7. Espera unos segundos a que se cree

## Paso 2: Configurar Reglas de Seguridad

Después de crear la base de datos, necesitamos configurar las reglas para que funcione con nuestra estructura.

1. En Firestore Database, ve a la pestaña **"Rules"** (Reglas)
2. Reemplaza las reglas por defecto con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a usuarios autenticados
    match /artifacts/{appId}/public/data/settings/appState {
      allow read, write: if request.auth != null;
    }
    
    // También permitir acceso anónimo (para desarrollo)
    match /artifacts/{appId}/public/data/settings/appState {
      allow read, write: if true;
    }
  }
}
```

3. Haz clic en **"Publish"** (Publicar)

## Paso 3: Listo!

Una vez que hayas activado Firestore y configurado las reglas, avísame y reiniciaré el servidor para que todo funcione.

---

**¿Ya activaste Firestore?** Si tienes alguna duda en algún paso, avísame.
