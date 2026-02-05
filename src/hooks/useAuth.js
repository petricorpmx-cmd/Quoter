import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { createDefaultAdmin } from '../services/firebase/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 useAuth: Inicializando autenticación...');
    console.log('🔐 auth disponible:', !!auth);
    
    if (!auth) {
      console.warn('⚠️ Firebase auth no está disponible');
      setIsLoading(false);
      return;
    }

    // Crear usuario administrador por defecto al iniciar (sin bloquear)
    // Esto se ejecuta en segundo plano y no debe bloquear el inicio de sesión
    createDefaultAdmin().catch(err => {
      // Solo loguear el error, no bloquear la app
      console.warn('⚠️ No se pudo crear/verificar admin por defecto:', err.message);
    });

    console.log('🔐 Suscribiéndose a cambios de autenticación...');
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log('🔐 Estado de autenticación cambió:', user ? `Usuario: ${user.email}` : 'Sin usuario');
        setUser(user);
        setIsLoading(false);
        if (user) {
          console.log('✅ Usuario autenticado:', user.email);
        } else {
          console.log('ℹ️ Usuario no autenticado - mostrando Login');
        }
      },
      (error) => {
        console.error("❌ Error en auth state change:", error);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('🔐 Limpiando suscripción de autenticación');
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return { user, isLoading, logout };
};
