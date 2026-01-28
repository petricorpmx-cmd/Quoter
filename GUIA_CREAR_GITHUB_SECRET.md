# 🔐 Guía Paso a Paso: Crear GitHub Secret

## 📝 Pasos Detallados

### Paso 1: Ir a la Configuración del Repositorio

1. Ve a tu repositorio en GitHub: **https://github.com/petricorpmx-cmd/Quoter**
2. En la parte superior de la página, haz clic en la pestaña **"Settings"** (Configuración)
   - Está al lado de "Code", "Issues", "Pull requests", etc.

### Paso 2: Navegar a Secrets and Variables

1. En el menú izquierdo, busca la sección **"Security"** (Seguridad)
2. Dentro de "Security", haz clic en **"Secrets and variables"**
3. Luego haz clic en **"Actions"**

### Paso 3: Crear el Nuevo Secret

1. Verás una página con dos pestañas: **"Secrets"** y **"Variables"**
2. Asegúrate de estar en la pestaña **"Secrets"**
3. Haz clic en el botón verde **"New repository secret"** (Nuevo secret del repositorio)

### Paso 4: Completar el Formulario

1. En el campo **"Name"** (Nombre), escribe exactamente:
   ```
   VITE_GEMINI_API_KEY
   ```
   ⚠️ **Importante**: Debe ser exactamente así, con mayúsculas y guiones bajos.

2. En el campo **"Secret"** (Secreto), pega tu API key de Gemini:
   - Ve a Azure Portal → Tu Static Web App → Configuration → Application settings
   - Copia el valor de `VITE_GEMINI_API_KEY`
   - O si no la tienes ahí, ve a [Google AI Studio](https://makersuite.google.com/app/apikey) y obtén una nueva
   - Pega el valor completo (algo como: `AIzaSy...`)

3. Haz clic en el botón verde **"Add secret"** (Agregar secret)

### Paso 5: Verificar

1. Deberías ver una lista de secrets
2. Deberías ver `VITE_GEMINI_API_KEY` en la lista
3. El valor está oculto por seguridad (solo verás `••••••••`)

---

## 🎯 Ruta Completa Visual

```
GitHub → Tu Repositorio (Quoter)
  ↓
Settings (arriba, en las pestañas)
  ↓
Menú izquierdo → Security → Secrets and variables → Actions
  ↓
Pestaña "Secrets" → Botón "New repository secret"
  ↓
Completar formulario → Add secret
```

---

## 📸 Ubicación Exacta

**En la página de Settings:**
- Menú izquierdo → Sección **"Security"**
- Dentro de Security → **"Secrets and variables"**
- Dentro de Secrets and variables → **"Actions"**

**En la página de Secrets:**
- Botón verde **"New repository secret"** (arriba a la derecha)

---

## ✅ Checklist

Antes de continuar, verifica:

- [ ] Estás en la página correcta: `https://github.com/petricorpmx-cmd/Quoter/settings/secrets/actions`
- [ ] Estás en la pestaña **"Secrets"** (no "Variables")
- [ ] El nombre del secret es exactamente: `VITE_GEMINI_API_KEY`
- [ ] El valor del secret es tu API key completa (empieza con `AIzaSy`)
- [ ] El secret aparece en la lista después de crearlo

---

## 🔍 Obtener la API Key de Gemini (si no la tienes)

Si no tienes la API key:

1. Ve a: **https://makersuite.google.com/app/apikey**
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"** o **"Get API Key"**
4. Copia la API key que te aparece
5. Úsala en el paso 4 arriba

---

## ⚠️ Importante

- El nombre del secret debe ser **exactamente** `VITE_GEMINI_API_KEY` (case-sensitive)
- No debe tener espacios al inicio o final
- El valor debe ser la API key completa (sin comillas)
- Una vez creado, el valor está oculto por seguridad (no podrás verlo de nuevo)

---

## 🚀 Después de Crear el Secret

Una vez que hayas creado el secret:

1. Haz un push nuevo para activar el build:
   ```powershell
   git commit --allow-empty -m "Build con GitHub Secret configurado"
   git push origin main
   ```

2. O simplemente haz cualquier cambio y push

3. Espera a que termine el deployment (2-5 minutos)

4. Prueba tu sitio web - debería funcionar ahora

---

## 🆘 Si No Puedes Ver "Settings"

Si no ves la pestaña "Settings":
- Verifica que tengas permisos de administrador en el repositorio
- Si no eres el dueño, pide al dueño que te dé permisos o que cree el secret

---

## 📝 Nota Adicional

Si también quieres configurar Firebase (opcional), puedes agregar estos secrets adicionales:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Pero por ahora, solo necesitas `VITE_GEMINI_API_KEY` para que funcione la IA.

---

¿Necesitas ayuda con algún paso específico? 🚀
