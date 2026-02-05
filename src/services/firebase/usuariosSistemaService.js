import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db, appId } from './config';
import { createUserWithTemporaryPassword, generateTemporaryPassword } from './authService';

// Colección compartida para todos los usuarios del sistema
const USUARIOS_COLLECTION = 'modules/administracion-sistema/usuarios';

export const getUsuariosCollection = () => {
  return USUARIOS_COLLECTION;
};

// Obtener el administrador del sistema
const getAdminUser = async () => {
  if (!db) return null;
  
  try {
    const adminEmail = 'Rolando.martinez@petricorp.com.mx';
    const adminDocRef = doc(db, 'users', adminEmail);
    const adminDoc = await getDoc(adminDocRef);
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      return {
        id: 'admin-default',
        email: adminEmail,
        nombre: adminData.nombre || 'Rolando Martinez',
        telefono: adminData.telefono || '',
        rol: adminData.rol || 'admin',
        activo: adminData.activo !== undefined ? adminData.activo : true,
        isDefaultAdmin: true,
        createdAt: adminData.createdAt || new Date().toISOString(),
        createdAtTimestamp: adminData.createdAtTimestamp || new Date().getTime()
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener administrador:', error);
    return null;
  }
};

// Guardar usuario del sistema
export const saveUsuario = async (userId, usuarioData) => {
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  
  try {
    // Primero verificar si el usuario ya existe en la colección
    const collectionRef = collection(db, getUsuariosCollection());
    const q = query(collectionRef, where('email', '==', usuarioData.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // El usuario ya existe en la colección, actualizar información
      const existingDoc = querySnapshot.docs[0];
      await updateDoc(existingDoc.ref, {
        nombre: usuarioData.nombre,
        telefono: usuarioData.telefono || '',
        rol: usuarioData.rol || 'usuario',
        activo: usuarioData.activo !== undefined ? usuarioData.activo : true,
        updatedAt: new Date().toISOString(),
        updatedAtTimestamp: new Date().getTime()
      });
      console.log('✅ Usuario actualizado en la colección:', existingDoc.id);
      throw new Error(`El email "${usuarioData.email}" ya está registrado en el sistema. Se actualizó la información del usuario existente.`);
    }
    
    // El usuario no existe en la colección, intentar crearlo en Firebase Auth
    // Generar contraseña temporal si no se proporciona
    const password = usuarioData.password || generateTemporaryPassword();
    
    try {
      // Crear usuario en Firebase Auth con contraseña temporal
      const result = await createUserWithTemporaryPassword(
        usuarioData.email,
        password,
        {
          nombre: usuarioData.nombre,
          telefono: usuarioData.telefono || '',
          rol: usuarioData.rol || 'usuario',
          activo: usuarioData.activo !== undefined ? usuarioData.activo : true,
          appId
        }
      );

      // Si el usuario ya existía en Auth pero no en la colección, agregarlo
      if (!result.isNew) {
        // Crear nuevo documento en la colección aunque el usuario ya exista en Auth
        const docRef = await addDoc(collectionRef, {
          ...usuarioData,
          email: usuarioData.email,
          authUid: result.user?.uid || 'existing-user',
          passwordTemporary: true,
          password: password,
          appId,
          createdAt: new Date().toISOString(),
          createdAtTimestamp: new Date().getTime(),
          updatedAt: new Date().toISOString(),
          updatedAtTimestamp: new Date().getTime()
        });
        console.log('✅ Usuario agregado a la colección con ID:', docRef.id);
        return { id: docRef.id, password, isNew: false };
      }

      // Usuario nuevo - guardar información adicional en la colección de usuarios del sistema
      const usuarioDataToSave = {
        ...usuarioData,
        email: usuarioData.email,
        authUid: result.user.uid,
        passwordTemporary: true,
        password: password, // Guardar temporalmente para mostrarla al usuario
        appId,
        createdAt: new Date().toISOString(),
        createdAtTimestamp: new Date().getTime(),
        updatedAt: new Date().toISOString(),
        updatedAtTimestamp: new Date().getTime()
      };
      
      console.log('💾 Guardando usuario en colección:', getUsuariosCollection());
      console.log('📋 Datos del usuario:', { ...usuarioDataToSave, password: '***' });
      
      const docRef = await addDoc(collectionRef, usuarioDataToSave);
      
      console.log('✅ Usuario creado exitosamente con ID:', docRef.id);
      console.log('✅ Usuario guardado en:', `${getUsuariosCollection()}/${docRef.id}`);
      return { id: docRef.id, password, isNew: true }; // Retornar también la contraseña temporal
    } catch (authError) {
      // Si el error es que el email ya está en uso, informar al usuario
      if (authError.message && authError.message.includes('ya está registrado')) {
        throw new Error(`El email "${usuarioData.email}" ya está registrado en Firebase Authentication. Por favor, usa otro email o contacta al administrador para resetear la contraseña.`);
      }
      throw authError;
    }
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    // Si el error ya es un Error personalizado, lanzarlo tal cual
    if (error.message) {
      throw error;
    }
    // Si es un error de Firebase, convertirlo a mensaje legible
    throw new Error(error.message || 'Error al guardar usuario');
  }
};

// Obtener usuarios de la estructura antigua (para migración)
const getUsuariosFromOldStructure = async () => {
  if (!db) return [];
  
  const allUsuarios = [];
  
  try {
    // 1. Buscar en la colección 'users' directamente (estructura más antigua)
    console.log('🔍 Buscando usuarios en colección "users"...');
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);
    
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      // Excluir el administrador por defecto (ya lo manejamos por separado)
      if (userData.email !== 'Rolando.martinez@petricorp.com.mx' && userData.email) {
        allUsuarios.push({
          id: doc.id,
          ...userData,
          _needsMigration: true, // Marcar para migración
          _source: 'users' // Indicar de dónde viene
        });
      }
    });
    
    console.log(`📦 Encontrados ${usersSnapshot.docs.length} documentos en colección "users"`);
    console.log(`📦 Usuarios para migrar desde "users": ${allUsuarios.length}`);
  } catch (error) {
    console.error('⚠️ Error al obtener usuarios de colección "users":', error);
  }
  
  try {
    // 2. Buscar en subcolecciones de administración (estructura intermedia)
    console.log('🔍 Buscando usuarios en "modules/administracion-sistema/users"...');
    const oldCollectionRef = collection(db, 'modules/administracion-sistema/users');
    const usersDocs = await getDocs(oldCollectionRef);
    
    // Iterar sobre cada documento de usuario (cada admin)
    for (const userDoc of usersDocs.docs) {
      const usuariosSubcollection = collection(db, `modules/administracion-sistema/users/${userDoc.id}/usuarios`);
      const usuariosSnapshot = await getDocs(usuariosSubcollection);
      
      usuariosSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        // Evitar duplicados por email
        const exists = allUsuarios.some(u => u.email === userData.email);
        if (!exists) {
          allUsuarios.push({
            id: doc.id,
            ...userData,
            _needsMigration: true, // Marcar para migración
            _source: 'modules/administracion-sistema/users' // Indicar de dónde viene
          });
        }
      });
    }
    
    console.log(`📦 Usuarios adicionales encontrados en subcolecciones: ${allUsuarios.length - (usersSnapshot.docs.length > 0 ? usersSnapshot.docs.length : 0)}`);
  } catch (error) {
    console.error('⚠️ Error al obtener usuarios de subcolecciones:', error);
  }
  
  console.log(`✅ Total de usuarios encontrados para migración: ${allUsuarios.length}`);
  return allUsuarios;
};

// Migrar usuarios de estructura antigua a nueva
const migrateUsuarios = async (usuariosAntiguos) => {
  if (!db || usuariosAntiguos.length === 0) return;
  
  try {
    const newCollectionRef = collection(db, getUsuariosCollection());
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const usuario of usuariosAntiguos) {
      try {
        // Verificar si ya existe en la nueva colección
        const q = query(newCollectionRef, where('email', '==', usuario.email));
        const existing = await getDocs(q);
        
        if (existing.empty) {
          // Preparar datos para migración (excluir campos internos)
          const { _needsMigration, _source, ...usuarioData } = usuario;
          
          // Migrar el usuario a la nueva colección
          await addDoc(newCollectionRef, {
            ...usuarioData,
            migratedAt: new Date().toISOString(),
            migratedAtTimestamp: new Date().getTime(),
            migratedFrom: _source || 'unknown'
          });
          console.log(`✅ Usuario migrado: ${usuario.email} (desde: ${_source || 'unknown'})`);
          migratedCount++;
        } else {
          console.log(`⏭️ Usuario ya existe en nueva estructura: ${usuario.email}`);
          skippedCount++;
        }
      } catch (userError) {
        console.error(`❌ Error al migrar usuario ${usuario.email}:`, userError);
      }
    }
    
    console.log(`📊 Migración completada: ${migratedCount} migrados, ${skippedCount} omitidos`);
  } catch (error) {
    console.error('❌ Error general al migrar usuarios:', error);
  }
};

// Obtener usuarios del sistema (incluyendo administrador)
export const getUsuarios = async (userId) => {
  if (!db) {
    console.warn('Firestore no está disponible');
    return [];
  }
  
  try {
    // 1. Obtener usuarios de la nueva estructura
    const collectionRef = collection(db, getUsuariosCollection());
    const q = query(collectionRef, orderBy('createdAtTimestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let usuarios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 2. Siempre intentar obtener de estructura antigua y migrar (por si acaso hay usuarios ahí)
    console.log('🔍 Buscando usuarios en estructura antigua...');
    const usuariosAntiguos = await getUsuariosFromOldStructure();
    
    if (usuariosAntiguos.length > 0) {
      console.log(`📦 Encontrados ${usuariosAntiguos.length} usuarios en estructura antigua`);
      console.log('📋 Emails de usuarios antiguos:', usuariosAntiguos.map(u => u.email));
      
      // Migrar usuarios
      await migrateUsuarios(usuariosAntiguos);
      
      // Volver a obtener de la nueva estructura después de migración
      const newQuerySnapshot = await getDocs(q);
      usuarios = newQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📊 Usuarios después de migración: ${usuarios.length}`);
      
      // No agregar usuarios antiguos temporalmente - ya fueron migrados o están en la nueva estructura
      // Si no aparecen después de la migración, es porque ya existían
    } else {
      console.log('ℹ️ No se encontraron usuarios en estructura antigua');
    }
    
    // 3. Agregar el administrador al inicio de la lista
    const admin = await getAdminUser();
    if (admin) {
      // Verificar si el admin ya está en la lista para evitar duplicados
      const adminExists = usuarios.some(u => u.email === admin.email);
      if (!adminExists) {
        console.log('➕ Agregando administrador a la lista');
        usuarios.unshift(admin);
      } else {
        console.log('ℹ️ Administrador ya está en la lista');
      }
    }
    
    // 4. Eliminar duplicados por email (mantener el primero que encuentre)
    const usuariosUnicos = [];
    const emailsVistos = new Set();
    
    for (const usuario of usuarios) {
      if (usuario.email && !emailsVistos.has(usuario.email)) {
        emailsVistos.add(usuario.email);
        usuariosUnicos.push(usuario);
      } else if (!usuario.email) {
        // Si no tiene email, agregarlo de todas formas (puede ser un caso especial)
        usuariosUnicos.push(usuario);
      }
    }
    
    console.log(`✅ Total de usuarios a mostrar: ${usuariosUnicos.length} (${usuarios.length - usuariosUnicos.length} duplicados eliminados)`);
    console.log('📋 Lista de usuarios únicos:', usuariosUnicos.map(u => ({ id: u.id, email: u.email, nombre: u.nombre })));
    return usuariosUnicos;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    // Si hay error de permisos, intentar al menos obtener el admin
    try {
      const admin = await getAdminUser();
      return admin ? [admin] : [];
    } catch (adminError) {
      console.error('Error al obtener administrador:', adminError);
      return [];
    }
  }
};

// Suscribirse a cambios en tiempo real (incluyendo administrador)
export const subscribeToUsuarios = (userId, callback, errorCallback) => {
  if (!db) {
    console.warn('Firestore no está disponible');
    if (errorCallback) {
      errorCallback(new Error('Firestore no está disponible'));
    }
    return () => {};
  }
  
  try {
    const collectionRef = collection(db, getUsuariosCollection());
    const q = query(collectionRef, orderBy('createdAtTimestamp', 'desc'));
    
    // Primera carga: obtener todos los usuarios incluyendo migración
    getUsuarios(userId).then(usuariosIniciales => {
      callback(usuariosIniciales);
    }).catch(err => {
      console.error('Error en carga inicial de usuarios:', err);
      if (errorCallback) errorCallback(err);
    });
    
    // Suscripción a cambios en tiempo real
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let usuarios = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Si hay pocos usuarios, verificar estructura antigua y migrar
      if (usuarios.length <= 1) {
        console.log('🔍 Pocos usuarios encontrados, buscando en estructura antigua...');
        const usuariosAntiguos = await getUsuariosFromOldStructure();
        if (usuariosAntiguos.length > 0) {
          console.log(`📦 Encontrados ${usuariosAntiguos.length} usuarios en estructura antigua, migrando...`);
          await migrateUsuarios(usuariosAntiguos);
          
          // Volver a obtener después de migración
          const newQuerySnapshot = await getDocs(q);
          usuarios = newQuerySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // No agregar usuarios antiguos temporalmente - ya fueron migrados
        }
      }
      
      // Agregar el administrador al inicio de la lista
      try {
        const admin = await getAdminUser();
        if (admin) {
          // Verificar si el admin ya está en la lista para evitar duplicados
          const adminExists = usuarios.some(u => u.email === admin.email);
          if (!adminExists) {
            usuarios.unshift(admin);
          }
        }
      } catch (adminError) {
        console.error('Error al obtener administrador en suscripción:', adminError);
      }
      
      // Eliminar duplicados por email antes de llamar al callback
      const usuariosUnicos = [];
      const emailsVistos = new Set();
      
      for (const usuario of usuarios) {
        if (usuario.email && !emailsVistos.has(usuario.email)) {
          emailsVistos.add(usuario.email);
          usuariosUnicos.push(usuario);
        } else if (!usuario.email) {
          usuariosUnicos.push(usuario);
        }
      }
      
      callback(usuariosUnicos);
    }, (error) => {
      console.error('Error en suscripción a usuarios:', error);
      // Si hay error de permisos, intentar al menos obtener el admin
      if (error.code === 'permission-denied') {
        getAdminUser().then(admin => {
          if (admin) {
            callback([admin]);
          } else if (errorCallback) {
            errorCallback(error);
          }
        }).catch(adminError => {
          if (errorCallback) {
            errorCallback(error);
          }
        });
      } else if (errorCallback) {
        errorCallback(error);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error al suscribirse a usuarios:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return () => {};
  }
};

// Actualizar usuario
export const updateUsuario = async (userId, usuarioId, data) => {
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  
  try {
    // Si es el administrador (admin-default), actualizar en la colección users
    if (usuarioId === 'admin-default' || data.isDefaultAdmin) {
      const adminEmail = 'Rolando.martinez@petricorp.com.mx';
      const adminDocRef = doc(db, 'users', adminEmail);
      
      // Verificar si el documento existe
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        // Actualizar el documento existente
        await updateDoc(adminDocRef, {
          nombre: data.nombre,
          telefono: data.telefono || '',
          rol: data.rol || 'admin',
          activo: data.activo !== undefined ? data.activo : true,
          updatedAt: new Date().toISOString(),
          updatedAtTimestamp: new Date().getTime()
        });
        console.log('✅ Administrador actualizado en users');
      } else {
        // Crear el documento si no existe
        await setDoc(adminDocRef, {
          email: adminEmail,
          nombre: data.nombre || 'Rolando Martinez',
          telefono: data.telefono || '',
          rol: data.rol || 'admin',
          activo: data.activo !== undefined ? data.activo : true,
          isDefaultAdmin: true,
          createdAt: new Date().toISOString(),
          createdAtTimestamp: new Date().getTime(),
          updatedAt: new Date().toISOString(),
          updatedAtTimestamp: new Date().getTime()
        });
        console.log('✅ Documento del administrador creado en users');
      }
      
      // También crear/actualizar en la colección de usuarios del sistema para mantener consistencia
      try {
        const usuariosCollectionRef = collection(db, getUsuariosCollection());
        const q = query(usuariosCollectionRef, where('email', '==', adminEmail));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Actualizar el documento existente en la colección de usuarios
          const existingDoc = querySnapshot.docs[0];
          await updateDoc(existingDoc.ref, {
            nombre: data.nombre,
            telefono: data.telefono || '',
            rol: data.rol || 'admin',
            activo: data.activo !== undefined ? data.activo : true,
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          });
        } else {
          // Crear el documento en la colección de usuarios del sistema
          await addDoc(usuariosCollectionRef, {
            email: adminEmail,
            nombre: data.nombre || 'Rolando Martinez',
            telefono: data.telefono || '',
            rol: data.rol || 'admin',
            activo: data.activo !== undefined ? data.activo : true,
            isDefaultAdmin: true,
            createdAt: new Date().toISOString(),
            createdAtTimestamp: new Date().getTime(),
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          });
        }
      } catch (collectionError) {
        console.warn('⚠️ Error al actualizar administrador en colección de usuarios:', collectionError);
        // No lanzar error, ya actualizamos en users
      }
      
      return;
    }
    
    // Para usuarios normales, actualizar en la colección de usuarios del sistema
    const docRef = doc(db, getUsuariosCollection(), usuarioId);
    
    // Verificar si el documento existe
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      // Si no existe con ese ID, buscar por email (puede ser un usuario migrado con ID diferente)
      console.log(`⚠️ Usuario con ID "${usuarioId}" no encontrado, buscando por email...`);
      
      if (data.email) {
        const collectionRef = collection(db, getUsuariosCollection());
        const q = query(collectionRef, where('email', '==', data.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Actualizar el documento encontrado por email
          const existingDoc = querySnapshot.docs[0];
          await updateDoc(existingDoc.ref, {
            ...data,
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          });
          console.log('✅ Usuario actualizado por email:', data.email);
          return;
        }
      }
      
      throw new Error(`El usuario con ID "${usuarioId}" no existe en la base de datos.`);
    }
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedAtTimestamp: new Date().getTime()
    });
    console.log('✅ Usuario actualizado:', usuarioId);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUsuario = async (userId, usuarioId) => {
  if (!db) {
    throw new Error('Firestore no está disponible');
  }
  
  try {
    // Si es el administrador por defecto, no permitir eliminarlo
    if (usuarioId === 'admin-default') {
      throw new Error('No se puede eliminar al administrador principal del sistema');
    }
    
    let usuarioEliminado = false;
    let emailUsuario = null;
    
    // 1. Intentar eliminar de la colección de usuarios del sistema
    const collectionRef = collection(db, getUsuariosCollection());
    const docRef = doc(db, getUsuariosCollection(), usuarioId);
    
    // Verificar si el documento existe con ese ID
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      const usuarioData = docSnapshot.data();
      emailUsuario = usuarioData.email || usuarioId;
      await deleteDoc(docRef);
      console.log('✅ Usuario eliminado de modules/administracion-sistema/usuarios:', usuarioId);
      usuarioEliminado = true;
    } else {
      // Si no existe con ese ID, buscar por email en la colección de usuarios del sistema
      if (usuarioId.includes('@')) {
        const q = query(collectionRef, where('email', '==', usuarioId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docToDelete = querySnapshot.docs[0];
          const usuarioData = docToDelete.data();
          emailUsuario = usuarioData.email || usuarioId;
          await deleteDoc(docToDelete.ref);
          console.log('✅ Usuario eliminado de modules/administracion-sistema/usuarios por email:', usuarioId);
          usuarioEliminado = true;
        }
      }
    }
    
    // 2. También intentar eliminar de la colección 'users' (estructura antigua)
    // Si el usuarioId es un email o tenemos el email del usuario
    const emailToDelete = emailUsuario || (usuarioId.includes('@') ? usuarioId : null);
    
    if (emailToDelete) {
      try {
        const userDocRef = doc(db, 'users', emailToDelete);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userDocSnapshot.exists()) {
          await deleteDoc(userDocRef);
          console.log('✅ Usuario eliminado de users:', emailToDelete);
          usuarioEliminado = true;
        }
      } catch (userError) {
        console.warn('⚠️ No se pudo eliminar de users (puede que no exista):', userError.message);
        // No lanzar error, solo registrar advertencia
      }
    }
    
    // 3. Si no se eliminó de ninguna colección, lanzar error
    if (!usuarioEliminado) {
      throw new Error(`El usuario con ID "${usuarioId}" no existe en la base de datos.`);
    }
    
    console.log('✅ Usuario eliminado completamente de todas las colecciones');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
