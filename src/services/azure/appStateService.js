/**
 * Servicio para manejar el estado de la aplicación
 * Reemplaza firestoreService.js usando Azure Functions
 */

import { apiService } from './apiService';

const getAppId = () => {
  return import.meta.env.VITE_APP_ID || 'default-app-id';
};

/**
 * Suscribirse a cambios en el estado de la app
 * Nota: Azure no tiene tiempo real como Firebase, así que usamos polling
 */
export const subscribeToAppState = (callback, errorCallback, pollInterval = 5000) => {
  let intervalId;
  let isSubscribed = true;

  const poll = async () => {
    if (!isSubscribed) return;

    try {
      const data = await apiService.get('/getAppState', { appId: getAppId() });
      callback(data);
    } catch (error) {
      console.error('Error al obtener estado de la app:', error);
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
 * Guardar estado de la aplicación
 */
export const saveAppState = async (data) => {
  try {
    const result = await apiService.post('/saveAppState', {
      appId: getAppId(),
      data: {
        ...data,
        lastUpdated: new Date().toISOString()
      }
    });
    return result;
  } catch (error) {
    console.error('Error al guardar estado de la app:', error);
    throw error;
  }
};
