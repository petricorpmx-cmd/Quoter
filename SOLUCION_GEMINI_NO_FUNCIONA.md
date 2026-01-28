# 🔧 Solución: Gemini API Key no funciona después de configurarla

## ❌ Problema

Agregaste `VITE_GEMINI_API_KEY` en Azure Portal pero sigue apareciendo el mensaje de que falta la API key.

## 🔍 Causa

Las variables de entorno con prefijo `VITE_` se inyectan **durante el BUILD**, no en runtime. Esto significa:

- ✅ Si agregas la variable **antes** del deployment → Funciona
- ❌ Si agregas la variable **después** del deployment → No funciona hasta hacer un nuevo build

## ✅ Solución Paso a Paso

### Paso 1: Verificar que la variable esté configurada

1. Azure Portal → Tu Static Web App → **"Configuration"**
2. Pestaña **"Application settings"**
3. Busca `VITE_GEMINI_API_KEY`
4. Verifica que:
   - ✅ Esté en la lista
   - ✅ Tenga un valor (no esté vacía)
   - ✅ El nombre sea exactamente `VITE_GEMINI_API_KEY` (case-sensitive)

### Paso 2: Forzar un nuevo deployment

Después de agregar la variable, necesitas hacer un nuevo build. Tienes 3 opciones:

#### Opción A: Hacer un push a GitHub (Recomendado)

```powershell
cd "G:\Mi unidad\Rolando Martinez\9.-Aplicaciones web\analizador-pro - copia"
& "C:\Program Files\Git\cmd\git.exe" commit --allow-empty -m "Trigger rebuild with Gemini API key"
& "C:\Program Files\Git\cmd\git.exe" push origin main
```

Esto activará GitHub Actions y hará un nuevo build con la variable.

#### Opción B: Desde Azure Portal

1. Ve a tu Static Web App → **"Deployment Center"**
2. Haz clic en **"Sync"** o **"Sincronizar"**
3. Esto forzará un nuevo deployment

#### Opción C: Esperar al próximo push

Si haces cualquier cambio y haces push, se hará un nuevo build automáticamente.

### Paso 3: Verificar el deployment

1. Ve a GitHub → Tu repo → **"Actions"**
2. Verifica que haya un workflow ejecutándose o completado recientemente
3. Espera a que termine (2-5 minutos)

### Paso 4: Probar

1. Espera 1-2 minutos después de que termine el deployment
2. Recarga tu sitio web (Ctrl+F5 para limpiar caché)
3. Prueba el chat de IA
4. Abre la consola (F12) y busca mensajes de debug

---

## 🔍 Verificar en la Consola del Navegador

Abre la consola (F12) y busca:

### Si funciona:
```
🔍 Debug Gemini API Key: { existe: true, valor: "AIzaSy..." }
```

### Si no funciona:
```
⚠️ Gemini API Key no configurada...
```

---

## ⚠️ Errores Comunes

### Error 1: Variable con nombre incorrecto

**Síntoma**: La variable está configurada pero no funciona

**Solución**: 
- Verifica que sea exactamente `VITE_GEMINI_API_KEY` (con mayúsculas)
- No debe tener espacios al inicio o final

### Error 2: Variable agregada después del deployment

**Síntoma**: Agregaste la variable pero el sitio sigue sin detectarla

**Solución**: 
- Haz un nuevo push (Opción A arriba)
- O espera al próximo cambio que hagas

### Error 3: Variable vacía

**Síntoma**: La variable existe pero está vacía

**Solución**:
- Verifica que copiaste correctamente la API key
- No debe tener comillas alrededor del valor
- Debe empezar con `AIzaSy`

---

## 📝 Checklist

- [ ] Variable `VITE_GEMINI_API_KEY` agregada en Azure Portal
- [ ] Variable tiene un valor (no está vacía)
- [ ] Nombre es exactamente `VITE_GEMINI_API_KEY`
- [ ] Hiciste un push nuevo o sincronizaste el deployment
- [ ] Deployment completado exitosamente
- [ ] Esperaste 1-2 minutos después del deployment
- [ ] Recargaste el sitio (Ctrl+F5)
- [ ] Probaste el chat de IA

---

## 🆘 Si aún no funciona

### Verificar en GitHub Actions

1. Ve a GitHub → Tu repo → **"Actions"**
2. Selecciona el último workflow
3. Revisa los logs del paso "Build And Deploy"
4. Busca si hay errores relacionados con variables de entorno

### Verificar en Azure Portal

1. Static Web App → **"Deployment History"**
2. Verifica que haya un deployment reciente
3. Si hay errores, haz clic para ver los detalles

### Debug en el código

He agregado logs de debug. Abre la consola (F12) y verifica qué muestra:

```javascript
🔍 Debug Gemini API Key: {
  existe: true/false,
  valor: "...",
  desdeEnv: "..."
}
```

---

## ✅ Solución Rápida (Resumen)

1. **Agrega la variable** en Azure Portal → Configuration → Application settings
2. **Haz un push nuevo** para forzar rebuild:
   ```powershell
   git commit --allow-empty -m "Rebuild with Gemini API key"
   git push origin main
   ```
3. **Espera** a que termine el deployment (2-5 min)
4. **Recarga** el sitio (Ctrl+F5)
5. **Prueba** el chat de IA

---

¿Seguiste estos pasos y aún no funciona? Comparte:
- ¿Qué muestra la consola del navegador?
- ¿Hay algún error en GitHub Actions?
- ¿Cuándo agregaste la variable (antes o después del último deployment)?
