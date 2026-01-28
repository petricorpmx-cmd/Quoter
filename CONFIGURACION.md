# 🔧 Guía de Configuración - Analizador Pro

## 📋 Índice
1. [¿Por qué la IA no funciona?](#por-qué-la-ia-no-funciona)
2. [¿Para qué sirve Firebase en esta app?](#para-qué-sirve-firebase-en-esta-app)
3. [Cómo configurar la IA (Gemini)](#configurar-ia-gemini)
4. [Cómo configurar Firebase](#configurar-firebase)
5. [Modo sin configuración (funciona sin nada)](#modo-sin-configuración)

---

## ❓ ¿Por qué la IA no funciona?

La IA **no funciona** porque **falta la API Key de Google Gemini**. 

La aplicación está diseñada para usar el asistente de IA de Google (Gemini) para ayudarte a:
- Analizar comparativas de proveedores
- Sugerir ahorros
- Responder preguntas sobre tus productos

**Sin la API Key**, el chat de IA mostrará un mensaje informativo en lugar de funcionar, pero **todas las demás funciones de la app funcionan perfectamente** (comparar proveedores, calcular costos, exportar PDF, etc.).

---

## 🔥 ¿Para qué sirve Firebase en esta app?

Firebase en esta aplicación tiene **2 funciones principales**:

### 1. **Guardado en la Nube (Firestore)**
   - Guarda automáticamente todos tus productos y proveedores en la nube
   - Tus datos se sincronizan en tiempo real
   - Si cierras y abres la app, tus datos siguen ahí
   - Puedes acceder desde diferentes dispositivos

### 2. **Autenticación de Usuarios**
   - Identifica quién está usando la app
   - Permite que múltiples usuarios tengan sus propios datos
   - Soporta autenticación anónima (no necesitas crear cuenta)

### ⚠️ **Importante:**
- **La app FUNCIONA SIN Firebase** - Si no configuras Firebase, la app usa datos locales (solo en tu navegador)
- **Con Firebase**: Tus datos se guardan en la nube y puedes acceder desde cualquier dispositivo
- **Sin Firebase**: Tus datos solo están en tu navegador (se pierden si borras el caché)

---

## 🤖 Configurar IA (Gemini)

### Paso 1: Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key" (Crear API Key)
4. Copia la API key que te dan

### Paso 2: Configurar en la app

Edita el archivo `vite.config.js` y busca esta línea:

```javascript
__gemini_api_key: JSON.stringify("") // API key de Gemini (vacía por defecto)
```

Reemplaza las comillas vacías con tu API key:

```javascript
__gemini_api_key: JSON.stringify("TU_API_KEY_AQUI")
```

### Paso 3: Reiniciar el servidor

```bash
# Detén el servidor (Ctrl+C) y vuelve a ejecutar:
npm run dev
```

---

## 🔥 Configurar Firebase

### Paso 1: Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Add project" (Agregar proyecto)
3. Sigue los pasos para crear tu proyecto
4. Una vez creado, haz clic en el ícono de configuración (⚙️) → "Project settings"
5. Baja hasta "Your apps" y haz clic en el ícono de web (</>)
6. Registra tu app y copia la configuración

### Paso 2: Configurar en la app

Edita el archivo `vite.config.js` y busca esta sección:

```javascript
__firebase_config: JSON.stringify({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
}),
```

Reemplaza con tus datos de Firebase:

```javascript
__firebase_config: JSON.stringify({
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}),
```

### Paso 3: Configurar Firestore

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige una ubicación para tu base de datos

### Paso 4: Reiniciar el servidor

```bash
npm run dev
```

---

## ✅ Modo sin Configuración

**La aplicación funciona perfectamente sin configurar nada:**

- ✅ Comparar proveedores
- ✅ Calcular costos y ganancias
- ✅ Ver gráficas comparativas
- ✅ Exportar a PDF
- ✅ Todas las funciones de análisis

**Lo que NO funcionará sin configuración:**
- ❌ Chat de IA (mostrará mensaje informativo)
- ❌ Guardado en la nube (solo datos locales)

---

## 🎯 Resumen

| Funcionalidad | Requiere Configuración | Funciona sin Config |
|--------------|----------------------|---------------------|
| Comparar proveedores | ❌ No | ✅ Sí |
| Calcular costos | ❌ No | ✅ Sí |
| Gráficas | ❌ No | ✅ Sí |
| Exportar PDF | ❌ No | ✅ Sí |
| Chat de IA | ✅ Sí (Gemini API) | ❌ No |
| Guardado en nube | ✅ Sí (Firebase) | ❌ No (solo local) |

---

## 💡 Recomendaciones

1. **Para desarrollo/pruebas**: No necesitas configurar nada, la app funciona
2. **Para uso personal**: Configura Firebase para guardar tus datos
3. **Para usar IA**: Configura Gemini API key
4. **Para producción**: Configura ambos (Firebase + Gemini)

---

¿Necesitas ayuda? Revisa los archivos de configuración o consulta la documentación oficial:
- [Firebase Docs](https://firebase.google.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
