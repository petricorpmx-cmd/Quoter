import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Variables globales - Vite las reemplaza en tiempo de compilación
// Usamos una función para acceder de forma segura
function getGlobalVar(name, defaultValue) {
  try {
    // @ts-ignore
    return typeof window !== 'undefined' && window[name] !== undefined 
      ? window[name] 
      : (typeof globalThis !== 'undefined' && globalThis[name] !== undefined 
          ? globalThis[name] 
          : defaultValue);
  } catch (e) {
    return defaultValue;
  }
}

// Obtener configuración de Firebase
let firebaseConfig;
try {
  // @ts-ignore - Variable global definida en vite.config.js
  let configValue = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
  
  if (configValue) {
    // Vite reemplaza __firebase_config con JSON.stringify(), así que viene como string
    if (typeof configValue === 'string') {
      firebaseConfig = JSON.parse(configValue);
    } else if (typeof configValue === 'object') {
      // Si por alguna razón ya es objeto, usarlo directamente
      firebaseConfig = configValue;
    } else {
      throw new Error('Tipo de configuración no esperado');
    }
  } else {
    throw new Error('__firebase_config no está definido');
  }
  
  // Validar que tenga los campos necesarios
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Configuración de Firebase incompleta');
  }
  
  console.log('✅ Configuración parseada correctamente');
} catch (e) {
  console.error('❌ Error parsing Firebase config:', e);
  console.error('🔍 Tipo de __firebase_config:', typeof __firebase_config);
  console.error('🔍 Valor de __firebase_config:', __firebase_config);
  
  // Usar configuración hardcodeada como fallback
  firebaseConfig = { 
    apiKey: "AIzaSyBdrq8vvhzkEpnHVaGGMSiDuOm_ezEWd3I",
    authDomain: "petricorptest.firebaseapp.com",
    projectId: "petricorptest",
    storageBucket: "petricorptest.firebasestorage.app",
    messagingSenderId: "233916346404",
    appId: "1:233916346404:web:3e6552108905faaeffe8b1"
  };
  console.log('⚠️ Usando configuración hardcodeada como fallback');
}

// Inicializar Firebase solo si hay configuración válida
let app, auth, db;
try {
  console.log('🔥 Inicializando Firebase...');
  console.log('📋 Configuración:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'VACÍA',
    projectId: firebaseConfig.projectId || 'VACÍO',
    authDomain: firebaseConfig.authDomain || 'VACÍO'
  });
  
  // Intentar inicializar Firebase App
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App inicializado');
  } catch (appError) {
    console.error('❌ Error inicializando Firebase App:', appError);
    // Continuar intentando inicializar Auth y Firestore aunque App falle
  }
  
  // Intentar inicializar Auth (puede fallar si apiKey es inválida, pero continuamos)
  try {
    if (app) {
      auth = getAuth(app);
      console.log('✅ Firebase Auth inicializado');
    }
  } catch (authError) {
    console.warn('⚠️ Error inicializando Firebase Auth (continuando sin auth):', authError.message);
    // No bloqueamos la app si auth falla
  }
  
  // Intentar inicializar Firestore (esto es lo más importante)
  try {
    if (app) {
      db = getFirestore(app);
      console.log('✅ Firestore DB inicializado');
      console.log('✅ Firebase completamente configurado');
    } else {
      throw new Error('Firebase App no está disponible');
    }
  } catch (dbError) {
    console.error('❌ Error inicializando Firestore DB:', dbError);
    console.error('📋 Detalles:', {
      code: dbError.code,
      message: dbError.message
    });
    db = null;
  }
} catch (error) {
  console.error('❌ Error general inicializando Firebase:', error);
  console.error('📋 Detalles del error:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
  // Crear objetos mock para que la app no se rompa
  app = app || null;
  auth = auth || null;
  db = db || null;
}

// @ts-ignore
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
export { app, auth, db };
