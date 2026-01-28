import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, appId } from './config';

const APP_STATE_PATH = ['artifacts', appId, 'public', 'data', 'settings', 'appState'];

export const subscribeToAppState = (callback, errorCallback) => {
  if (!db) {
    console.warn('Firestore no está disponible');
    if (errorCallback) {
      errorCallback(new Error('Firestore no está disponible'));
    }
    return () => {}; // Retornar función vacía para unsubscribe
  }

  try {
    const docRef = doc(db, ...APP_STATE_PATH);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    }, errorCallback);
  } catch (error) {
    console.error('Error al suscribirse a Firestore:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return () => {}; // Retornar función vacía para unsubscribe
  }
};

export const saveAppState = async (data) => {
  if (!db) {
    console.warn('Firestore no está disponible, no se puede guardar');
    return;
  }

  try {
    const docRef = doc(db, ...APP_STATE_PATH);
    await setDoc(docRef, {
      ...data,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    throw error;
  }
};
