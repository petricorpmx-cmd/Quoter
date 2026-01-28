import { useState, useEffect } from 'react';
import { signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase auth no está disponible');
      return;
    }

    const initAuth = async () => {
      try {
        // @ts-ignore - Variable global definida en vite.config.js
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Error de autenticación", err);
        // Continuar sin autenticación si falla
      }
    };
    
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser, (error) => {
      console.error("Error en auth state change:", error);
    });
    return () => unsubscribe();
  }, []);

  return user;
};
