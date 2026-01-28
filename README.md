# analizador-pro

App web (Vite + React + Tailwind) para analizar y comparar proveedores con soporte de Firebase y asistente IA (Gemini).

## 📋 Requisitos

- Node.js (LTS recomendado)
- **Git** (para subir a GitHub/Azure DevOps). En Windows: instala "Git for Windows".

## 🚀 Configuración Rápida

### 1. Variables de entorno

1. Copia `ENV.example` como `.env`
2. Completa:
   - `VITE_GEMINI_API_KEY`
   - Variables `VITE_FIREBASE_*` (si usarás Firebase)

> ⚠️ Nota: `.env` está ignorado por Git para evitar subir secretos.

### 2. Levantar el proyecto localmente

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## ☁️ Desplegar en Azure

### Opción 1: Azure DevOps + Azure Static Web Apps

1. **Conecta el repositorio a Azure DevOps**:
   - Ve a [Azure DevOps](https://dev.azure.com)
   - Importa el repo desde GitHub o agrega Azure DevOps como remoto adicional
   - Ver guía completa en [`AZURE_SETUP.md`](./AZURE_SETUP.md)

2. **Crea Azure Static Web App**:
   - Ve a [Azure Portal](https://portal.azure.com)
   - Busca "Static Web Apps" → Create
   - Conecta con Azure DevOps
   - Configura variables de entorno (ver sección abajo)

3. **Configura variables de entorno en Azure**:
   ```
   VITE_GEMINI_API_KEY=tu-api-key
   VITE_FIREBASE_API_KEY=tu-firebase-key
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### Opción 2: GitHub Actions (alternativa)

El proyecto incluye configuración para GitHub Actions si prefieres usarla.

---

## 🔧 Backend y Base de Datos

Actualmente el proyecto usa **Firebase** como backend/BD. Tienes estas opciones:

### ✅ Mantener Firebase (Recomendado para empezar)
- Ya está configurado y funcionando
- Solo configura variables de entorno en Azure
- Ver [`AZURE_SETUP.md`](./AZURE_SETUP.md)

### 🔄 Migrar a Azure Cosmos DB
- Todo en Azure
- Mejor escalabilidad
- Ver [`AZURE_BACKEND_OPTIONS.md`](./AZURE_BACKEND_OPTIONS.md)

### 🗄️ Azure Functions + SQL Database
- Base de datos relacional
- Para casos específicos
- Ver [`AZURE_BACKEND_OPTIONS.md`](./AZURE_BACKEND_OPTIONS.md)

---

## 📚 Documentación Adicional

- [`AZURE_SETUP.md`](./AZURE_SETUP.md) - Guía completa para configurar Azure
- [`AZURE_BACKEND_OPTIONS.md`](./AZURE_BACKEND_OPTIONS.md) - Opciones de backend/BD en Azure
- [`CONFIGURACION.md`](./CONFIGURACION.md) - Configuración local (Firebase/Gemini)
- [`GUIA_RAPIDA.md`](./GUIA_RAPIDA.md) - Guía rápida de configuración

---

## 🔗 Repositorios

- **GitHub**: https://github.com/petricorpmx-cmd/Quoter.git
- **Azure DevOps**: (configura siguiendo [`AZURE_SETUP.md`](./AZURE_SETUP.md))

---

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🆘 Solución de Problemas

### El proyecto no inicia
- Verifica que Node.js esté instalado: `node --version`
- Instala dependencias: `npm install`

### Firebase no funciona
- Verifica que las variables `VITE_FIREBASE_*` estén en `.env`
- Revisa [`CONFIGURACION.md`](./CONFIGURACION.md)

### El deploy en Azure falla
- Verifica que las variables de entorno estén configuradas en Azure Portal
- Revisa los logs en Azure Portal → Static Web App → Deployment history

