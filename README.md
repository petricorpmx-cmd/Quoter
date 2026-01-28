# analizador-pro

App web (Vite + React + Tailwind) para analizar y comparar proveedores con soporte de Firebase y asistente IA (Gemini).

## Requisitos

- Node.js (LTS recomendado)
- **Git** (para subir a GitHub). En Windows: instala “Git for Windows”.

## Configuración de variables de entorno

1. Copia `ENV.example` como `.env`
2. Completa:
   - `VITE_GEMINI_API_KEY`
   - Variables `VITE_FIREBASE_*` (si usarás Firebase)

> Nota: `.env` está ignorado por Git para evitar subir secretos.

## Levantar el proyecto

```bash
npm install
npm run dev
```

## Subir a GitHub (Windows / PowerShell)

1. Crea un repo vacío en GitHub (sin README)
2. Ejecuta:

```powershell
.\scripts\setup-github.ps1 -RemoteUrl "https://github.com/USUARIO/REPO.git"
```

