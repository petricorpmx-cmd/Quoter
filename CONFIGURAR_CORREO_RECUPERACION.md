# Configurar correo de recuperación de contraseña

Guía para configurar el correo que Firebase envía cuando un administrador usa "Enviar correo de recuperación" para un usuario.

## 1. Dominios autorizados

Los correos de restablecimiento solo funcionan desde dominios autorizados.

1. Ve a: https://console.firebase.google.com/project/petricorptest/authentication/settings
2. En **"Authorized domains"** (Dominios autorizados), verifica que estén:
   - `localhost` – para desarrollo local
   - Tu dominio de producción (ej: `tudominio.com`, `tudominio.web.app`)
3. Si falta alguno, haz clic en **"Add domain"** y agrégalo.

## 2. Plantilla del correo

1. Ve a: https://console.firebase.google.com/project/petricorptest/authentication/templates
2. En **"Password reset"** (Restablecimiento de contraseña), haz clic en el lápiz (editar)
3. Puedes personalizar:
   - **Nombre del remitente**: ej. "Equipo Petricorp"
   - **Asunto del correo**: ej. "Restablece tu contraseña - Petricorp"
   - **Cuerpo del mensaje**: texto que verá el usuario
4. Haz clic en **"Save"** (Guardar).

## 3. Método Email/Password activo

1. Ve a: https://console.firebase.google.com/project/petricorptest/authentication/providers
2. Confirma que **"Email/Password"** esté **habilitado**.
3. Si no lo está, actívalo y guarda los cambios.

## 4. Verificación rápida

- El usuario debe existir en Firebase Authentication (creado al agregarlo en Usuarios del Sistema).
- El correo del usuario debe ser correcto.
- Revisa la carpeta de spam si no llega el correo.

## Verificación de emails registrados

Para evitar que usuarios no registrados reciban un mensaje falso de "correo enviado":

- Los emails se validan contra la colección `registroEmails` antes de enviar.
- Los emails se añaden automáticamente cuando:
  - Creas un nuevo usuario en Usuarios del Sistema
  - Un administrador entra en Usuarios del Sistema (se sincronizan los usuarios existentes)

**Usuarios ya existentes:** Un administrador debe abrir la sección "Usuarios del Sistema" al menos una vez para que sus emails queden registrados y puedan recuperar contraseña.

## Errores frecuentes

| Error | Causa | Qué hacer |
|-------|-------|-----------|
| "Este email no está registrado" | El email no está en el sistema | Crea al usuario en Usuarios del Sistema o contacta al administrador |
| `auth/invalid-email` | Formato de email incorrecto | Comprueba que el email sea válido |
| El correo no llega | Spam o filtros del correo | Revisa spam, carpetas de promociones o bloqueados |
