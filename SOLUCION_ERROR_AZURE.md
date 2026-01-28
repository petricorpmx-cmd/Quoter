# 🔧 Solución: Error "repositoryUrl not provided" en Azure Static Web Apps

## ❌ Error que aparece

```
Deployment template validation failed: 'The value for the template parameter 'repositoryUrl' at line '1' and column '697' is not provided.
```

## ✅ Solución Paso a Paso

### Opción 1: Usar Azure DevOps (Recomendado si ya tienes el repo ahí)

#### Paso 1: Verificar que el repositorio esté en Azure DevOps

1. Ve a https://dev.azure.com
2. Selecciona tu organización y proyecto
3. Ve a **Repos** → **Files**
4. Si NO ves tu repositorio, impórtalo:
   - Haz clic en **"Import"** (o "Import repository")
   - Selecciona **"Git"**
   - Ingresa: `https://github.com/petricorpmx-cmd/Quoter.git`
   - Haz clic en **"Import"**

#### Paso 2: Configurar Azure Static Web App correctamente

1. **Ve a Azure Portal** → **Static Web Apps** → **Create**
2. En la pestaña **"Datos básicos"**:
   - Subscription: Tu suscripción
   - Resource Group: `Quoter_group` (o crea uno nuevo)
   - Name: `Quoter`
   - Plan type: `Free` (para empezar)
   - Region: `westus2` (o la que prefieras)

3. En la pestaña **"Configuración de la implementación"** (¡IMPORTANTE!):
   - **Source**: Selecciona **"Azure DevOps"** (NO GitHub)
   - **Organization**: Tu organización de Azure DevOps (ej: `tu-organizacion`)
   - **Project**: Tu proyecto en Azure DevOps
   - **Repository**: Selecciona el repositorio que importaste
   - **Branch**: `main`
   - **Build Presets**: `Vite`
   - **App location**: `/`
   - **Api location**: (dejar vacío)
   - **Output location**: `dist`

4. Haz clic en **"Revisar y crear"** → **"Crear"**

---

### Opción 2: Usar GitHub (Más simple si prefieres GitHub)

#### Paso 1: Autorizar Azure con GitHub

1. En la pestaña **"Configuración de la implementación"**:
   - **Source**: Selecciona **"GitHub"**
   - Haz clic en **"Sign in with GitHub"** o **"Authorize"**
   - Autoriza Azure Static Web Apps en GitHub

#### Paso 2: Configurar repositorio

Después de autorizar, completa:
   - **Organization**: `petricorpmx-cmd`
   - **Repository**: `Quoter`
   - **Branch**: `main`
   - **Build Presets**: `Vite`
   - **App location**: `/`
   - **Api location**: (vacío)
   - **Output location**: `dist`

---

## 🔍 Verificación

Antes de hacer clic en "Crear", verifica que:

- ✅ El campo **"Repositorio"** NO esté vacío
- ✅ El campo **"Rama"** tenga `main`
- ✅ El campo **"Ubicación de salida"** tenga `dist`
- ✅ Si usas Azure DevOps, el repositorio ya esté importado

---

## 🆘 Si el error persiste

### Verificar que el repositorio existe

**Para Azure DevOps:**
```powershell
# Verificar remotos configurados
& "C:\Program Files\Git\cmd\git.exe" remote -v
```

**Para GitHub:**
- Ve a: https://github.com/petricorpmx-cmd/Quoter
- Verifica que el repositorio exista y sea público (o que tengas acceso)

### Alternativa: Crear sin conexión y configurar después

1. Crea el Static Web App con **"Other"** como Source
2. Después de crearlo, ve a **"Deployment Center"**
3. Configura la conexión manualmente

---

## 📝 Notas Importantes

- **Azure DevOps**: Requiere que el repositorio ya esté importado en Azure DevOps
- **GitHub**: Requiere autorización de GitHub (se hace automáticamente al seleccionar GitHub)
- **Output location**: Debe ser `dist` porque Vite genera los archivos ahí
- **Branch**: Debe ser `main` (o la rama que uses en tu repo)

---

## ✅ Después de crear exitosamente

Una vez creado el Static Web App:

1. Ve a **Configuration** → **Application settings**
2. Agrega las variables de entorno (ver `AZURE_SETUP.md`)
3. Haz un push a tu repositorio y Azure desplegará automáticamente
