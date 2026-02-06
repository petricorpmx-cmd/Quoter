import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config';

const PROVEEDORES_COLLECTION = 'modules/compras/proveedores';

export const getProveedoresCollection = () => PROVEEDORES_COLLECTION;

export const getProveedores = async () => {
  if (!db) {
    console.warn('Firestore no está disponible');
    return [];
  }
  
  try {
    const collectionRef = collection(db, PROVEEDORES_COLLECTION);
    const q = query(collectionRef, orderBy('createdAtTimestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return [];
  }
};

export const subscribeToProveedores = (callback, errorCallback) => {
  if (!db) {
    if (errorCallback) errorCallback(new Error('Firestore no está disponible'));
    return () => {};
  }
  
  try {
    const collectionRef = collection(db, PROVEEDORES_COLLECTION);
    const q = query(collectionRef, orderBy('createdAtTimestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const proveedores = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(proveedores);
    }, (error) => {
      console.error('Error en suscripción a proveedores:', error);
      if (errorCallback) errorCallback(error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error al suscribirse a proveedores:', error);
    if (errorCallback) errorCallback(error);
    return () => {};
  }
};

export const saveProveedor = async (proveedorData) => {
  if (!db) throw new Error('Firestore no está disponible');
  
  try {
    const collectionRef = collection(db, PROVEEDORES_COLLECTION);
    const docRef = await addDoc(collectionRef, {
      ...proveedorData,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: new Date().getTime(),
      updatedAt: new Date().toISOString(),
      updatedAtTimestamp: new Date().getTime()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error al guardar proveedor:', error);
    throw error;
  }
};

export const updateProveedor = async (proveedorId, data) => {
  if (!db) throw new Error('Firestore no está disponible');
  
  try {
    const dataToUpdate = { ...data };
    if (dataToUpdate.password === '') {
      delete dataToUpdate.password;
    }
    const docRef = doc(db, PROVEEDORES_COLLECTION, proveedorId);
    await updateDoc(docRef, {
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
      updatedAtTimestamp: new Date().getTime()
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
};

export const deleteProveedor = async (proveedorId) => {
  if (!db) throw new Error('Firestore no está disponible');
  
  try {
    const docRef = doc(db, PROVEEDORES_COLLECTION, proveedorId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    throw error;
  }
};
