# 🔧 Solución: El Secret se Borra al Guardar

## ❌ Problema

Cuando intentas actualizar el secret, el valor se borra o no se guarda.

## ✅ Soluciones

### Solución 1: Copiar y Pegar Correctamente

1. **Obtén tu API key de Gemini:**
   - Ve a: https://makersuite.google.com/app/apikey
   - O cópiala de Azure Portal → Static Web App → Configuration
   - La API key debe empezar con `AIzaSy` y tener aproximadamente 39 caracteres

2. **Copia SOLO el valor:**
   - Selecciona SOLO la API key (sin espacios antes o después)
   - Copia con Ctrl+C (o clic derecho → Copiar)
   - NO copies espacios adicionales

3. **Pega en el campo "Value":**
   - Haz clic en el campo "Value"
   - Selecciona TODO el contenido si hay algo (Ctrl+A)
   - Borra todo (Delete o Backspace)
   - Pega la API key (Ctrl+V)
   - Verifica que no haya espacios al inicio o final

4. **Antes de hacer clic en "Update secret":**
   - Verifica que el campo tenga texto (deberías ver puntos `••••••••` o el texto)
   - Si está vacío, pega de nuevo

### Solución 2: Escribir Manualmente (si copiar/pegar no funciona)

1. Obtén tu API key de Gemini
2. En el campo "Value", escribe manualmente la API key
3. Verifica cada carácter
4. Haz clic en "Update secret"

### Solución 3: Eliminar y Crear de Nuevo

Si sigue sin funcionar:

1. **Elimina el secret actual:**
   - Ve a la lista de secrets
   - Haz clic en el ícono de **papelera** (🗑️) al lado de `VITE_GEMINI_API_KEY`
   - Confirma la eliminación

2. **Crea uno nuevo:**
   - Haz clic en "New repository secret"
   - Name: `VITE_GEMINI_API_KEY`
   - Secret: Pega tu API key (sin espacios)
   - Haz clic en "Add secret"

### Solución 4: Verificar el Formato de la API Key

Asegúrate de que la API key:
- ✅ Empieza con `AIzaSy`
- ✅ Tiene aproximadamente 39 caracteres
- ✅ No tiene espacios
- ✅ No tiene saltos de línea
- ✅ No tiene comillas

**Ejemplo de formato correcto:**
```
AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456789
```

**Ejemplo de formato incorrecto:**
```
"AIzaSy..."  ❌ (con comillas)
 AIzaSy...   ❌ (con espacio al inicio)
AIzaSy...    ❌ (con espacio al final)
```

---

## 🔍 Verificar que se Guardó

Después de hacer clic en "Update secret":

1. Deberías volver a la lista de secrets
2. Deberías ver `VITE_GEMINI_API_KEY` en la lista
3. En "Last updated" debería decir "now" o la fecha actual
4. Si haces clic en el lápiz de nuevo, deberías ver `••••••••` (puntos que ocultan el valor)

---

## ⚠️ Notas Importantes

- GitHub NO te permite ver el valor del secret por seguridad (solo verás puntos)
- Si el campo se ve vacío después de guardar, puede ser que:
  - El valor estaba vacío
  - Hubo un error al guardar
  - El navegador tiene problemas

---

## 🆘 Si Nada Funciona

1. **Prueba en otro navegador** (Chrome, Firefox, Edge)
2. **Limpia la caché del navegador** (Ctrl+Shift+Delete)
3. **Prueba en modo incógnito**
4. **Verifica que tengas permisos** de administrador en el repositorio

---

## ✅ Checklist

- [ ] API key obtenida de Google AI Studio o Azure Portal
- [ ] API key empieza con `AIzaSy`
- [ ] API key tiene aproximadamente 39 caracteres
- [ ] Campo "Value" tiene contenido antes de guardar
- [ ] No hay espacios al inicio o final
- [ ] Hiciste clic en "Update secret"
- [ ] Verificaste que apareció "now" en "Last updated"

---

**Intenta la Solución 3 (eliminar y crear de nuevo) si las otras no funcionan.** 🔄
