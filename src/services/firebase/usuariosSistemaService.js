import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
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

// Colección para verificar emails registrados (lectura pública desde login sin auth)
const REGISTRO_EMAILS_COLLECTION = 'registroEmails';

/**
 * Verifica si un email está registrado en el sistema.
 * Puede ser llamada sin autenticación (para recuperación de contraseña en login).
 */
export const verificarEmailRegistrado = async (email) => {
  if (!db || !email) return false;
  try {
    const emailNorm = email.toLowerCase().trim();
    const docRef = doc(db, REGISTRO_EMAILS_COLLECTION, emailNorm);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  } catch (error) {
    console.warn('Error al verificar email registrado:', error);
    return false;
  }
};

/**
 * Registra un email en la colección de verificación (para recuperación de contraseña).
 * Se llama al crear usuarios y al sincronizar la lista.
 */
export const registrarEmailEnRegistro = async (email) => {
  if (!db || !email) return;
  try {
    const emailNorm = email.toLowerCase().trim();
    const docRef = doc(db, REGISTRO_EMAILS_COLLECTION, emailNorm);
    await setDoc(docRef, { registeredAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Error al registrar email:', error);
  }
};

// Verificar si un usuario existe y está activo en el sistema
export const verificarUsuarioSistema = async (email) => {
  if (!db) {
    console.warn('⚠️ Firestore no está disponible');
    return { existe: false, activo: false, usuario: null };
  }
  
  if (!email) {
    console.warn('⚠️ Email no proporcionado para verificación');
    return { existe: false, activo: false, usuario: null };
  }
  
  // Normalizar email a minúsculas para comparación
  const emailLower = email.toLowerCase().trim();
  console.log('🔍 Verificando usuario:', email, '(normalizado:', emailLower, ')');
  
  try {
    // 1. Verificar en la colección 'users' primero (donde está el admin por defecto)
    // Intentar con el email original y con minúsculas
    console.log('🔍 Buscando en colección "users" con email original...');
    let userDocRef = doc(db, 'users', email);
    let userDoc = await getDoc(userDocRef);
    
    // Si no existe con el email original, intentar con minúsculas
    if (!userDoc.exists() && email !== emailLower) {
      console.log('🔍 Intentando con email en minúsculas...');
      userDocRef = doc(db, 'users', emailLower);
      userDoc = await getDoc(userDocRef);
    }
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const activo = userData.activo !== false && userData.activo !== undefined ? userData.activo : true;
      console.log('✅ Usuario encontrado en "users":', email, 'Activo:', activo, 'Datos:', userData);
      return {
        existe: true,
        activo: activo,
        usuario: {
          id: email,
          email: email,
          ...userData
        }
      };
    }
    
    // 2. Verificar en la colección de usuarios del sistema (búsqueda case-insensitive)
    console.log('🔍 Buscando en colección "modules/administracion-sistema/usuarios"...');
    const collectionRef = collection(db, getUsuariosCollection());
    
    // Buscar con el email original
    let q = query(collectionRef, where('email', '==', email));
    let querySnapshot = await getDocs(q);
    
    // Si no se encuentra, buscar con minúsculas
    if (querySnapshot.empty && email !== emailLower) {
      console.log('🔍 Intentando búsqueda con email en minúsculas...');
      q = query(collectionRef, where('email', '==', emailLower));
      querySnapshot = await getDocs(q);
    }
    
    if (!querySnapshot.empty) {
      const usuarioDoc = querySnapshot.docs[0];
      const usuarioData = usuarioDoc.data();
      const activo = usuarioData.activo !== false && usuarioData.activo !== undefined ? usuarioData.activo : true;
      console.log('✅ Usuario encontrado en "modules/administracion-sistema/usuarios":', email, 'Activo:', activo);
      return {
        existe: true,
        activo: activo,
        usuario: {
          id: usuarioDoc.id,
          ...usuarioData
        }
      };
    }
    
    // 3. Como último recurso, listar todos los usuarios y buscar manualmente (case-insensitive)
    console.log('🔍 Búsqueda manual en todas las colecciones...');
    try {
      // Buscar en users (todos los documentos)
      const usersCollectionRef = collection(db, 'users');
      const allUsersSnapshot = await getDocs(usersCollectionRef);
      
      for (const userDocSnap of allUsersSnapshot.docs) {
        const userData = userDocSnap.data();
        const userEmail = userData.email || userDocSnap.id;
        if (userEmail && userEmail.toLowerCase() === emailLower) {
          const activo = userData.activo !== false && userData.activo !== undefined ? userData.activo : true;
          console.log('✅ Usuario encontrado en búsqueda manual (users):', userEmail, 'Activo:', activo);
          return {
            existe: true,
            activo: activo,
            usuario: {
              id: userDocSnap.id,
              email: userEmail,
              ...userData
            }
          };
        }
      }
      
      // Buscar en modules/administracion-sistema/usuarios (todos los documentos)
      const usuariosSnapshot = await getDocs(collectionRef);
      for (const usuarioDocSnap of usuariosSnapshot.docs) {
        const usuarioData = usuarioDocSnap.data();
        const usuarioEmail = usuarioData.email;
        if (usuarioEmail && usuarioEmail.toLowerCase() === emailLower) {
          const activo = usuarioData.activo !== false && usuarioData.activo !== undefined ? usuarioData.activo : true;
          console.log('✅ Usuario encontrado en búsqueda manual (usuarios):', usuarioEmail, 'Activo:', activo);
          return {
            existe: true,
            activo: activo,
            usuario: {
              id: usuarioDocSnap.id,
              ...usuarioData
            }
          };
        }
      }
    } catch (manualError) {
      console.warn('⚠️ Error en búsqueda manual:', manualError);
    }
    
    console.warn('⚠️ Usuario no encontrado en ninguna colección:', email);
    return { existe: false, activo: false, usuario: null };
  } catch (error) {
    console.error('❌ Error al verificar usuario del sistema:', error);
    console.error('📋 Detalles:', {
      code: error.code,
      message: error.message,
      email: email
    });
    // En caso de error de permisos, permitir acceso (fallback) solo para el admin
    if (error.code === 'permission-denied') {
      const emailLower = email.toLowerCase();
      if (emailLower === 'rolando.martinez@petricorp.com.mx') {
        console.warn('⚠️ Error de permisos al verificar admin, permitiendo acceso como fallback');
        return { existe: true, activo: true, usuario: null };
      }
    }
    return { existe: false, activo: false, usuario: null };
  }
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
        await registrarEmailEnRegistro(usuarioData.email);
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
      
      await registrarEmailEnRegistro(usuarioData.email);
      
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
        
        if (existing.empty && usuario.email) {
          await registrarEmailEnRegistro(usuario.email);
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
    
    // 5. Sincronizar emails a registro (para recuperación de contraseña desde login)
    for (const u of usuariosUnicos) {
      if (u.email) await registrarEmailEnRegistro(u.email);
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
    const { password, ...dataToUpdate } = data;
    
    // Si es el administrador (admin-default), actualizar en la colección users
    if (usuarioId === 'admin-default' || dataToUpdate.isDefaultAdmin) {
      const adminEmail = 'Rolando.martinez@petricorp.com.mx';
      const adminDocRef = doc(db, 'users', adminEmail);
      
      // Verificar si el documento existe
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        // Actualizar el documento existente
        await updateDoc(adminDocRef, {
          nombre: dataToUpdate.nombre,
          telefono: dataToUpdate.telefono || '',
          rol: dataToUpdate.rol || 'admin',
          activo: dataToUpdate.activo !== undefined ? dataToUpdate.activo : true,
          updatedAt: new Date().toISOString(),
          updatedAtTimestamp: new Date().getTime()
        });
        console.log('✅ Administrador actualizado en users');
      } else {
        // Crear el documento si no existe
        await setDoc(adminDocRef, {
          email: adminEmail,
          nombre: dataToUpdate.nombre || 'Rolando Martinez',
          telefono: dataToUpdate.telefono || '',
          rol: dataToUpdate.rol || 'admin',
          activo: dataToUpdate.activo !== undefined ? dataToUpdate.activo : true,
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
            nombre: dataToUpdate.nombre,
            telefono: dataToUpdate.telefono || '',
            rol: dataToUpdate.rol || 'admin',
            activo: dataToUpdate.activo !== undefined ? dataToUpdate.activo : true,
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          });
        } else {
          // Crear el documento en la colección de usuarios del sistema
          await addDoc(usuariosCollectionRef, {
            email: adminEmail,
            nombre: dataToUpdate.nombre || 'Rolando Martinez',
            telefono: dataToUpdate.telefono || '',
            rol: dataToUpdate.rol || 'admin',
            activo: dataToUpdate.activo !== undefined ? dataToUpdate.activo : true,
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
      
      if (dataToUpdate.email) {
        const collectionRef = collection(db, getUsuariosCollection());
        const q = query(collectionRef, where('email', '==', dataToUpdate.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Actualizar el documento encontrado por email
          const existingDoc = querySnapshot.docs[0];
          await updateDoc(existingDoc.ref, {
            ...dataToUpdate,
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          });
          console.log('✅ Usuario actualizado por email:', dataToUpdate.email);
          return;
        }
      }
      
      throw new Error(`El usuario con ID "${usuarioId}" no existe en la base de datos.`);
    }
    
    await updateDoc(docRef, {
      ...dataToUpdate,
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
