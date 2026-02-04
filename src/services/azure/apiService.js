/**
 * Cliente HTTP para Azure Functions
 * Reemplaza las llamadas directas a Firebase SDK
 */

const getFunctionsUrl = () => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:7071/api';
  }
  
  // En producción, usar la URL de Azure Functions
  // Esta variable debe configurarse en Azure Static Web Apps
  return import.meta.env.VITE_AZURE_FUNCTIONS_URL || 'https://quoter-api.azurewebsites.net/api';
};

const getAppId = () => {
  return import.meta.env.VITE_APP_ID || 'default-app-id';
};

/**
 * Realiza una petición HTTP a Azure Functions
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${getFunctionsUrl()}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en API request a ${endpoint}:`, error);
    throw error;
  }
};

export const apiService = {
  /**
   * GET request
   */
  get: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiRequest(url, { method: 'GET' });
  },

  /**
   * POST request
   */
  post: async (endpoint, data) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * DELETE request
   */
  delete: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiRequest(url, { method: 'DELETE' });
  }
};
