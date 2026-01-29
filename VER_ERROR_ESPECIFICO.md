# 🔍 Cómo Ver el Error Específico del Deployment

## 📋 Pasos para Ver el Error

1. **En la página que estás viendo** (donde dice "Build and Deploy Job" falló)
2. **Haz clic en "Build and Deploy Job"** (el que tiene la X roja)
3. Esto te llevará a los logs detallados
4. **Expande cada paso** para ver qué falló:
   - "Install OIDC Client from Core Package"
   - "Get Id Token"
   - "Build And Deploy"
5. **Busca mensajes en rojo** o líneas que digan "Error", "Failed", etc.
6. **Copia el mensaje de error completo** y compártelo conmigo

---

## 🔍 Errores Comunes

### Error 1: "Invalid token"
- **Causa**: El token de Azure es incorrecto o expirado
- **Solución**: Regenerar el token en Azure Portal

### Error 2: "Build failed"
- **Causa**: Error en el build de Vite
- **Solución**: Revisar los logs del build

### Error 3: "Permission denied"
- **Causa**: Problemas de permisos
- **Solución**: Verificar permisos en GitHub y Azure

### Error 4: "Output location not found"
- **Causa**: La carpeta `dist` no existe después del build
- **Solución**: Verificar que el build se complete correctamente

---

## 📝 Información que Necesito

Para ayudarte mejor, necesito:
1. **El mensaje de error completo** que aparece en los logs
2. **En qué paso falla** (Build, Deploy, etc.)
3. **Las últimas líneas del log** antes del error

---

**¿Puedes hacer clic en "Build and Deploy Job" y compartir el error que aparece?** 🔍
