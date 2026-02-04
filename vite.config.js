import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Mantener compatibilidad con variables globales antiguas
    __firebase_config: JSON.stringify({
      apiKey: "AIzaSyBdrq8vvhzkEpnHVaGGMSiDuOm_ezEWd3I",
      authDomain: "petricorptest.firebaseapp.com",
      projectId: "petricorptest",
      storageBucket: "petricorptest.firebasestorage.app",
      messagingSenderId: "233916346404",
      appId: "1:233916346404:web:3e6552108905faaeffe8b1"
    }),
    __app_id: JSON.stringify('default-app-id'),
    __initial_auth_token: JSON.stringify(null),
    __gemini_api_key: JSON.stringify("AIzaSyCEgcHLUI-ZQ0Y9MEp78Q8rh1bRh7hj66s") // API key de Gemini
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
    cors: true,
    open: false
  }
});
