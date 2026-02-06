import { useState, useEffect } from 'react';
import { 
  subscribeToUsuarios, 
  saveUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../services/firebase/usuariosSistemaService';
import { sendPasswordResetToUser } from '../services/firebase/authService';

export const useUsuariosSistema = (user) => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!user) {
      setUsuarios([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToUsuarios(
      user.uid, // Mantener userId para compatibilidad, aunque ya no se use en la ruta
      (usuarios) => {
        setUsuarios(usuarios);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Guardar usuario
  const guardarUsuario = async (usuarioData) => {
    if (!user) return null;
    
    setIsSaving(true);
    try {
      const result = await saveUsuario(user.uid, usuarioData); // userId se mantiene para compatibilidad
      return result; // Retorna { id, password }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Actualizar usuario
  const actualizarUsuario = async (usuarioId, data) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUsuario(user.uid, usuarioId, data); // userId se mantiene para compatibilidad
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (usuarioId) => {
    if (!user) return;
    
    try {
      await deleteUsuario(user.uid, usuarioId); // userId se mantiene para compatibilidad
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  };

  // Enviar correo de recuperación de contraseña (cuando el usuario olvidó su contraseña)
  // skipVerification=true porque el admin está editando un usuario que ya existe
  const enviarCorreoRecuperacion = async (email) => {
    if (!user) return;
    
    try {
      await sendPasswordResetToUser(email, true);
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      throw error;
    }
  };

  return {
    usuarios,
    isLoading,
    isSaving,
    guardarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    enviarCorreoRecuperacion
  };
};
