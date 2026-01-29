import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga .env, .env.local, .env.[mode], etc.
  const env = loadEnv(mode, process.cwd(), '');

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || ''
  };

  return {
    plugins: [react()],
    define: {
      // Mantener compatibilidad con variables globales antiguas (reemplazo en build)
      __firebase_config: JSON.stringify(firebaseConfig),
      __app_id: JSON.stringify(env.VITE_APP_ID || 'default-app-id'),
      __initial_auth_token: JSON.stringify(null),
      __gemini_api_key: JSON.stringify(env.VITE_GEMINI_API_KEY || 'AIzaSyCo-ZyM50ZmwbSsepA-Tdlj5TqzKAeF314')
    },
    server: {
      host: 'localhost',
      port: 5173,
      strictPort: false,
      cors: true,
      open: false
    }
  };
});
