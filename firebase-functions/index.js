const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true }); // Permite localhost y cualquier origen

admin.initializeApp();

/**
 * Cloud Function HTTP para que un administrador pueda establecer una contraseña
 * temporal para un usuario que olvidó su contraseña.
 * Solo usuarios con rol 'admin' pueden ejecutar esta función.
 * Usamos HTTP + CORS en lugar de onCall para evitar errores CORS con localhost.
 */
exports.updateUserPassword = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Solo permitir POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Método no permitido' });
      return;
    }

    try {
      // Obtener token de autorización
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Debes estar autenticado para realizar esta acción' });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1];
      let decodedToken;
      try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
      } catch (authError) {
        res.status(401).json({ error: 'Token de autenticación inválido o expirado' });
        return;
      }

      const callerEmail = decodedToken.email;
      if (!callerEmail) {
        res.status(401).json({ error: 'No se pudo obtener el email del usuario' });
        return;
      }

      const { email, newPassword } = req.body || {};

      if (!email || !newPassword) {
        res.status(400).json({ error: 'Se requieren email y nueva contraseña' });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        return;
      }

      // Verificar que el usuario que llama sea administrador
      const db = admin.firestore();
      const usersCollection = db.collection('modules/administracion-sistema/usuarios');
      const usersLegacyCollection = db.collection('users');

      let isAdmin = false;

      const usuariosQuery = await usersCollection.where('email', '==', callerEmail).limit(1).get();
      if (!usuariosQuery.empty) {
        const userData = usuariosQuery.docs[0].data();
        isAdmin = userData.rol === 'admin';
      }

      if (!isAdmin) {
        const adminEmail = 'Rolando.martinez@petricorp.com.mx';
        if (callerEmail.toLowerCase() === adminEmail.toLowerCase()) {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        const legacyDoc = await usersLegacyCollection.doc(callerEmail).get();
        if (legacyDoc.exists && legacyDoc.data().rol === 'admin') {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        res.status(403).json({ error: 'Solo los administradores pueden restablecer contraseñas' });
        return;
      }

      // Obtener usuario por email y actualizar contraseña
      const auth = admin.auth();
      let userRecord;

      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (userError) {
        if (userError.code === 'auth/user-not-found') {
          res.status(404).json({ error: `No se encontró un usuario con el email ${email}` });
          return;
        }
        throw userError;
      }

      await auth.updateUser(userRecord.uid, { password: newPassword });

      // Actualizar flag passwordTemporary en Firestore si el usuario está en la colección
      try {
        const targetUserQuery = await usersCollection.where('email', '==', email).limit(1).get();
        if (!targetUserQuery.empty) {
          await targetUserQuery.docs[0].ref.update({
            passwordTemporary: true,
            updatedAt: new Date().toISOString(),
            updatedAtTimestamp: new Date().getTime()
          });
        }
      } catch (firestoreError) {
        console.warn('No se pudo actualizar Firestore (no crítico):', firestoreError.message);
      }

      res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      res.status(500).json({
        error: error.message || 'Error al actualizar la contraseña'
      });
    }
  });
});
