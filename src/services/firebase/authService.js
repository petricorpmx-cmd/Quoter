import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

const ADMIN_EMAIL = 'Rolando.martinez@petricorp.com.mx';
const ADMIN_PASSWORD = 'Rolando01M';

// Crear usuario administrador por defecto si no existe
// Esta función se ejecuta ANTES de que el usuario esté autenticado, por lo que no puede escribir en Firestore
export const createDefaultAdmin = async () => {
  if (!auth || !db) {
    console.warn('⚠️ Firebase Auth o DB no está disponible');
    return null;
  }

  try {
    // Intentar crear usuario en Firebase Auth directamente
    // Si ya existe, Firebase lanzará un error que manejaremos
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        ADMIN_EMAIL,
        ADMIN_PASSWORD
      );

      console.log('✅ Usuario administrador creado exitosamente en Firebase Auth');
      
      // Intentar guardar información del usuario en Firestore
      // Nota: Esto puede fallar si no hay permisos, pero no es crítico
      try {
        const adminDocRef = doc(db, 'users', ADMIN_EMAIL);
        await setDoc(adminDocRef, {
          email: ADMIN_EMAIL,
          nombre: 'Rolando Martinez',
          rol: 'admin',
          activo: true,
          createdAt: new Date().toISOString(),
          createdAtTimestamp: new Date().getTime(),
          isDefaultAdmin: true
        });
        console.log('✅ Información del administrador guardada en Firestore');
      } catch (firestoreError) {
        // Si hay error de permisos al escribir en Firestore, no es crítico
        // El usuario puede autenticarse y luego se guardará la información
        console.warn('⚠️ No se pudo guardar información del admin en Firestore (se guardará después del login):', firestoreError.message);
      }

      return userCredential.user;
    } catch (authError) {
      // Si el usuario ya existe en Auth o hay un error 400 (Bad Request)
      if (authError.code === 'auth/email-already-in-use' || 
          (authError.code === 'auth/invalid-argument' && authError.message?.includes('400'))) {
        console.log('ℹ️ Usuario administrador ya existe en Firebase Auth');
        
        // Intentar verificar/crear en Firestore (puede fallar si no hay permisos)
        try {
          const adminDocRef = doc(db, 'users', ADMIN_EMAIL);
          const adminDoc = await getDoc(adminDocRef);
          
          if (!adminDoc.exists()) {
            console.log('📝 Intentando crear registro en Firestore...');
            try {
              await setDoc(adminDocRef, {
                email: ADMIN_EMAIL,
                nombre: 'Rolando Martinez',
                rol: 'admin',
                activo: true,
                createdAt: new Date().toISOString(),
                createdAtTimestamp: new Date().getTime(),
                isDefaultAdmin: true
              });
              console.log('✅ Información del administrador guardada en Firestore');
            } catch (writeError) {
              // Si hay error de permisos, no es crítico
              console.warn('⚠️ No se pudo guardar información del admin en Firestore (se guardará después del login):', writeError.message);
            }
          } else {
            console.log('ℹ️ Usuario administrador ya existe en Firestore');
          }
        } catch (readError) {
          // Si hay error de permisos al leer, no es crítico
          console.warn('⚠️ No se pudo verificar información del admin en Firestore:', readError.message);
        }
        
        return null; // No retornamos usuario porque no estamos autenticados
      } else {
        // Otro error de Auth - solo loguear, no bloquear
        console.warn('⚠️ Error al crear usuario administrador en Auth:', authError.message);
        return null;
      }
    }
  } catch (error) {
    // Cualquier error - solo loguear, no bloquear la app
    console.warn('⚠️ Error al verificar/crear usuario administrador:', error.message);
    return null;
  }
};

// Verificar si un usuario existe en Firebase Auth
export const checkUserExists = async (email) => {
  if (!auth) {
    return false;
  }
  
  // Firebase Auth no tiene un método directo para verificar si un email existe
  // sin intentar crear el usuario. Por ahora retornamos false
  // y manejaremos el error cuando intentemos crear el usuario
  return false;
};

// Crear nuevo usuario con contraseña temporal
export const createUserWithTemporaryPassword = async (email, password, userData) => {
  if (!auth || !db) {
    throw new Error('Firebase Auth o DB no está disponible');
  }

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Guardar información adicional en Firestore
    const userDocRef = doc(db, 'users', email);
    await setDoc(userDocRef, {
      ...userData,
      email: email,
      passwordTemporary: true,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: new Date().getTime(),
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Usuario creado exitosamente:', email);
    return { user: userCredential.user, isNew: true };
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      // El usuario ya existe en Firebase Auth
      console.log('ℹ️ Usuario ya existe en Firebase Auth, actualizando información...');
      
      // Actualizar información en Firestore si existe
      try {
        const userDocRef = doc(db, 'users', email);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Actualizar información existente
          await setDoc(userDocRef, {
            ...userData,
            email: email,
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          }, { merge: true });
          console.log('✅ Información del usuario actualizada en Firestore');
        } else {
          // Crear documento en Firestore si no existe
          await setDoc(userDocRef, {
            ...userData,
            email: email,
            passwordTemporary: true,
            createdAt: new Date().toISOString(),
            createdAtTimestamp: new Date().getTime(),
            updatedAt: new Date().toISOString()
          });
          console.log('✅ Documento creado en Firestore para usuario existente');
        }
        
        // Retornar indicando que el usuario ya existía
        return { user: null, isNew: false, message: 'El usuario ya existe en el sistema' };
      } catch (firestoreError) {
        console.error('❌ Error al actualizar información en Firestore:', firestoreError);
        throw new Error('El email ya está registrado. No se pudo actualizar la información.');
      }
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido. Por favor, verifica el formato del email.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña es muy débil. Debe tener al menos 6 caracteres.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('La operación no está permitida. Verifica la configuración de Firebase.');
    }
    
    throw new Error(error.message || 'Error al crear usuario');
  }
};

// Cambiar contraseña de usuario
export const changeUserPassword = async (email, newPassword) => {
  if (!auth) {
    throw new Error('Firebase Auth no está disponible');
  }

  try {
    // Para cambiar la contraseña, necesitamos que el usuario esté autenticado
    // O usar Admin SDK en el backend
    // Por ahora, usaremos sendPasswordResetEmail como alternativa
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    throw error;
  }
};

// Generar contraseña temporal
export const generateTemporaryPassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  
  // Asegurar al menos una mayúscula, una minúscula, un número y un carácter especial
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%'[Math.floor(Math.random() * 5)];
  
  // Completar el resto
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Mezclar los caracteres
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
