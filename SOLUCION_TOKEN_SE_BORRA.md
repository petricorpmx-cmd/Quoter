# 🔧 Solución: Token se Borra Después de Guardar

## ❌ Problema

Pegas el token, haces clic en "Update secret", pero cuando vuelves a abrir, el campo está vacío.

## ✅ Soluciones

### Solución 1: Verificar que No Haya Saltos de Línea

El token que veo tiene un guión en el medio, pero puede tener saltos de línea ocultos:

1. **Copia el token** desde Azure Portal
2. **Pégalo en Notepad** (o cualquier editor de texto)
3. **Verifica que esté en UNA sola línea** (sin saltos de línea)
4. Si hay saltos de línea, elimínalos
5. **Selecciona TODO** (Ctrl+A) y copia de nuevo
6. **Pega en GitHub**

### Solución 2: Escribir el Token Manualmente

Si copiar/pegar no funciona, escribe el token manualmente:

1. En Azure Portal, muestra el token
2. **Escribe el token carácter por carácter** en el campo "Value" de GitHub
3. Verifica que sea exactamente igual
4. Haz clic en "Update secret"

### Solución 3: Verificar el Token Completo

El token que veo es:
```
9e47e1b5fff1d31608ffe73143dd2128bf7dadee7301c6da1b0b6d04a2176778601-74e2fc14-5742-4ef6-885a-2cac71c8e53701e003001638b01e
```

**Verifica en Azure Portal:**
- ¿Es este el token completo?
- ¿Hay más caracteres después de `...638b01e`?
- ¿El token termina ahí o continúa?

### Solución 4: Probar en Modo Incógnito

1. Abre el navegador en **modo incógnito** (Ctrl+Shift+N)
2. Inicia sesión en GitHub
3. Intenta agregar el secret de nuevo

### Solución 5: Usar GitHub CLI (Alternativa)

Si el navegador no funciona, puedes usar GitHub CLI:

```bash
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_ASHY_BUSH_01638B01E --body "TU_TOKEN_AQUI"
```

Pero esto requiere instalar GitHub CLI.

### Solución 6: Verificar que el Token Sea Válido

1. Ve a Azure Portal → Tu Static Web App
2. Ve a "Manage deployment token" de nuevo
3. Verifica que el token sea el mismo
4. Si es diferente, copia el nuevo

---

## 🔍 Verificación del Token

El token que veo tiene:
- Letras minúsculas (a-z)
- Números (0-9)
- Guiones (-)

**Esto debería estar bien.** El problema puede ser:
- Saltos de línea ocultos
- Espacios al inicio/final
- El token está incompleto

---

## ⚠️ Importante

**GitHub NO muestra el valor del secret por seguridad** (solo verás `••••••••`). 

Pero si el campo está **completamente vacío** cuando editas, entonces el secret no se guardó.

---

## 🆘 Si Nada Funciona

Como última opción, podemos:
1. **Hardcodear el token temporalmente** en el workflow (NO recomendado para producción)
2. O **contactar al dueño del repositorio** para que agregue el secret

---

**¿Puedes verificar en Azure Portal si el token completo es el que mostraste, o hay más caracteres?** 🔍
