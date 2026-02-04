/**
 * Servicio para manejar proveedores favoritos
 * Reemplaza favoriteProvidersService.js usando Azure Functions
 */

import { apiService } from './apiService';

const getAppId = () => {
  return import.meta.env.VITE_APP_ID || 'default-app-id';
};

/**
 * Guardar un proveedor favorito
 */
export const saveFavoriteProvider = async (providerData) => {
  try {
    const result = await apiService.post('/saveFavoriteProvider', {
      appId: getAppId(),
      ...providerData
    });
    return result.id;
  } catch (error) {
    console.error('Error al guardar proveedor favorito:', error);
    throw error;
  }
};

/**
 * Obtener todos los proveedores favoritos
 */
export const getFavoriteProviders = async () => {
  try {
    const providers = await apiService.get('/getFavoriteProviders', {
      appId: getAppId()
    });
    return providers || [];
  } catch (error) {
    console.error('Error al obtener proveedores favoritos:', error);
    return [];
  }
};

/**
 * Suscribirse a cambios en proveedores favoritos
 * Nota: Usa polling ya que Azure no tiene tiempo real como Firebase
 */
export const subscribeToFavoriteProviders = (callback, errorCallback, pollInterval = 3000) => {
  let intervalId;
  let isSubscribed = true;

  const poll = async () => {
    if (!isSubscribed) return;

    try {
      const providers = await getFavoriteProviders();
      callback(providers);
    } catch (error) {
      console.error('Error al obtener proveedores favoritos:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  };

  // Poll inmediatamente
  poll();

  // Luego cada X segundos
  intervalId = setInterval(poll, pollInterval);

  // Retornar función para desuscribirse
  return () => {
    isSubscribed = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};

/**
 * Eliminar un proveedor favorito
 */
export const deleteFavoriteProvider = async (providerId) => {
  try {
    await apiService.delete('/deleteFavoriteProvider', { id: providerId });
  } catch (error) {
    console.error('Error al eliminar proveedor favorito:', error);
    throw error;
  }
};
