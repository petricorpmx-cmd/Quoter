import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db as firestoreDb, appId } from './config';

const FAVORITE_PROVIDERS_COLLECTION = 'favoriteProviders';

export const saveFavoriteProvider = async (providerData) => {
  // Verificar si db está disponible
  if (!firestoreDb) {
    const error = new Error('Firestore no está disponible. Verifica la configuración de Firebase.');
    console.error('❌ Firestore DB no disponible');
    console.error('🔍 Diagnóstico:');
    console.error('  - Verifica que Firebase esté configurado en vite.config.js');
    console.error('  - Verifica que las credenciales sean correctas');
    console.error('  - Revisa la consola al cargar la página para errores de inicialización');
    console.error('  - Busca mensajes que digan "🔥 Inicializando Firebase..." en la consola');
    throw error;
  }
  
  const db = firestoreDb;

  try {
    console.log('📦 Preparando datos para guardar:', providerData);
    
    // Validar que los datos necesarios estén presentes
    if (!providerData || !providerData.nombre) {
      throw new Error('Datos del proveedor incompletos');
    }
    
    const providerWithMetadata = {
      nombre: providerData.nombre || 'Sin nombre',
      costo: providerData.costo || 0,
      aplicaIva: providerData.aplicaIva !== undefined ? providerData.aplicaIva : true,
      margen: providerData.margen || 0,
      link: providerData.link || '',
      productoNombre: providerData.productoNombre || 'Producto sin nombre',
      productoId: providerData.productoId || '',
      cantidad: providerData.cantidad || 1,
      calculos: providerData.calculos || {},
      ivaRate: providerData.ivaRate || 16,
      appId,
      savedAt: new Date().toISOString(),
      savedAtTimestamp: new Date().getTime()
    };

    console.log('✅ Datos con metadata:', providerWithMetadata);
    console.log('📁 Colección:', FAVORITE_PROVIDERS_COLLECTION);
    console.log('🔗 DB disponible:', !!db);

    const docRef = await addDoc(collection(db, FAVORITE_PROVIDERS_COLLECTION), providerWithMetadata);
    console.log('✅ Documento creado exitosamente con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error al guardar proveedor favorito:', error);
    console.error('📋 Código del error:', error.code);
    console.error('💬 Mensaje del error:', error.message);
    
    // Mensajes más específicos según el tipo de error
    if (error.code === 'permission-denied') {
      console.error('🔒 ERROR DE PERMISOS: Las reglas de Firestore no permiten escribir en favoriteProviders');
      console.error('💡 Solución: Actualiza las reglas en Firebase Console para incluir:');
      console.error('   match /favoriteProviders/{providerId} { allow read, write: if true; }');
    } else if (error.code === 'unavailable') {
      console.error('🌐 ERROR DE CONEXIÓN: Firestore no está disponible');
    }
    
    throw error;
  }
};

export const getFavoriteProviders = async () => {
  if (!firestoreDb) {
    console.warn('Firestore no está disponible');
    return [];
  }
  
  const db = firestoreDb;

  try {
    const q = query(
      collection(db, FAVORITE_PROVIDERS_COLLECTION),
      orderBy('savedAtTimestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener proveedores favoritos:', error);
    return [];
  }
};

export const subscribeToFavoriteProviders = (callback, errorCallback) => {
  if (!firestoreDb) {
    console.warn('Firestore no está disponible');
    if (errorCallback) {
      errorCallback(new Error('Firestore no está disponible'));
    }
    return () => {};
  }
  
  const db = firestoreDb;

  try {
    const q = query(
      collection(db, FAVORITE_PROVIDERS_COLLECTION),
      orderBy('savedAtTimestamp', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const providers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(providers);
    }, errorCallback);
  } catch (error) {
    console.error('Error al suscribirse a proveedores favoritos:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return () => {};
  }
};

export const deleteFavoriteProvider = async (providerId) => {
  if (!firestoreDb) {
    console.warn('Firestore no está disponible');
    return;
  }
  
  const db = firestoreDb;

  try {
    await deleteDoc(doc(db, FAVORITE_PROVIDERS_COLLECTION, providerId));
  } catch (error) {
    console.error('Error al eliminar proveedor favorito:', error);
    throw error;
  }
};
