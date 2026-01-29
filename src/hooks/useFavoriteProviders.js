import { useState, useEffect } from 'react';
// Usar Azure Functions en lugar de Firebase
import { 
  subscribeToFavoriteProviders, 
  saveFavoriteProvider, 
  deleteFavoriteProvider 
} from '../services/azure/favoriteProvidersService';

export const useFavoriteProviders = (user) => {
  const [favoriteProviders, setFavoriteProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronización con Firestore
  useEffect(() => {
    // Permitir funcionar incluso sin usuario (modo de prueba de Firestore)
    setIsLoading(true);
    const unsubscribe = subscribeToFavoriteProviders(
      (providers) => {
        console.log('Proveedores favoritos recibidos:', providers);
        setFavoriteProviders(providers);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error al obtener proveedores favoritos:', error);
        console.error('Detalles:', {
          code: error.code,
          message: error.message
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveProvider = async (providerData) => {
    setIsSaving(true);
    try {
      console.log('Intentando guardar proveedor:', providerData);
      const result = await saveFavoriteProvider(providerData);
      console.log('Proveedor guardado exitosamente:', result);
      return true;
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      console.error('Detalles del error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProvider = async (providerId) => {
    try {
      await deleteFavoriteProvider(providerId);
      return true;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      return false;
    }
  };

  return {
    favoriteProviders,
    isLoading,
    isSaving,
    saveProvider,
    deleteProvider
  };
};
