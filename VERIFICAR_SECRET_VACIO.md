# 🔍 Verificar si el Secret está Vacío

## ❌ Problema Actual

El debug muestra:
```
__gemini_api_key: 'DEFINIDA (longitud: 0)'
valorRaw: '""'
```

Esto significa que el secret existe pero está **vacío**.

## ✅ Solución: Verificar y Corregir el Secret

### Paso 1: Verificar el Secret en GitHub

1. Ve a GitHub → Tu repo → **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Busca `VITE_GEMINI_API_KEY` en la lista
3. Haz clic en el secret (o en el ícono de ojo 👁️ si está disponible)
4. **Verifica que tenga un valor**

### Paso 2: Si el Secret está Vacío

Si el secret está vacío o no tiene valor:

1. Haz clic en **"Update"** (Actualizar) o elimínalo y créalo de nuevo
2. Asegúrate de pegar **todo el valor** de la API key:
   - Debe empezar con `AIzaSy`
   - Debe tener aproximadamente 39 caracteres
   - No debe tener espacios al inicio o final
   - No debe tener comillas

### Paso 3: Obtener la API Key (si no la tienes)

1. Ve a: **https://makersuite.google.com/app/apikey**
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"** o **"Get API Key"**
4. Copia la API key completa
5. Pégala en el secret de GitHub

### Paso 4: Verificar que el Workflow esté Actualizado

He actualizado el workflow para hacer el build explícitamente con las variables de entorno. Esto asegura que las variables estén disponibles durante el build.

### Paso 5: Hacer un Push Nuevo

Después de verificar/corregir el secret:

```powershell
git commit --allow-empty -m "Build explícito con variables de entorno"
git push origin main
```

---

## 🔍 Cómo Saber si el Secret Tiene Valor

En GitHub, cuando editas un secret:
- Si tiene valor: Verás `••••••••` (puntos que ocultan el valor)
- Si está vacío: El campo estará completamente vacío

**Nota**: GitHub no te permite ver el valor del secret por seguridad, pero puedes actualizarlo.

---

## ✅ Checklist

- [ ] Secret `VITE_GEMINI_API_KEY` existe en GitHub
- [ ] Secret tiene un valor (no está vacío)
- [ ] El valor es la API key completa (empieza con `AIzaSy`)
- [ ] Workflow actualizado (ya lo hice)
- [ ] Push nuevo hecho
- [ ] Deployment completado
- [ ] Verificado en consola del navegador

---

## 🆘 Si el Secret Tiene Valor pero Sigue Sin Funcionar

1. Verifica que el nombre sea exactamente `VITE_GEMINI_API_KEY` (case-sensitive)
2. Verifica que no tenga espacios al inicio o final
3. Elimina el secret y créalo de nuevo
4. Haz un push nuevo después de recrearlo

---

**El problema más común es que el secret está vacío o tiene espacios. Verifica esto primero.** 🔍
