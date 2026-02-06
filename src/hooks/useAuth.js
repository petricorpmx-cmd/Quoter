import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { createDefaultAdmin } from '../services/firebase/authService';
import { verificarUsuarioSistema } from '../services/firebase/usuariosSistemaService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

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
      async (firebaseUser) => {
        console.log('🔐 Estado de autenticación cambió:', firebaseUser ? `Usuario: ${firebaseUser.email}` : 'Sin usuario');
        
        if (firebaseUser) {
          // Validar que el usuario esté registrado en el sistema
          console.log('🔍 Verificando si el usuario está registrado en el sistema...');
          const verificacion = await verificarUsuarioSistema(firebaseUser.email);
          
          if (!verificacion.existe) {
            console.warn('⚠️ Usuario no está registrado en el sistema:', firebaseUser.email);
            setAuthError('Tu usuario no está registrado en el sistema. Contacta al administrador para obtener acceso.');
            // Cerrar sesión automáticamente
            await signOut(auth);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          if (!verificacion.activo) {
            console.warn('⚠️ Usuario está inactivo:', firebaseUser.email);
            setAuthError('Tu cuenta está inactiva. Contacta al administrador para reactivarla.');
            // Cerrar sesión automáticamente
            await signOut(auth);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          console.log('✅ Usuario verificado y activo:', firebaseUser.email);
          setAuthError(null);
          setUser(firebaseUser);
        } else {
          setAuthError(null);
          setUser(null);
          console.log('ℹ️ Usuario no autenticado - mostrando Login');
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error("❌ Error en auth state change:", error);
        setAuthError('Error de autenticación. Por favor, intenta nuevamente.');
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

  return { user, isLoading, logout, authError };
};
