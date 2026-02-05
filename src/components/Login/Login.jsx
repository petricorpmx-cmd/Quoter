import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase/config';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!auth) {
      setError('Firebase Auth no está disponible. Verifica la configuración de Firebase.');
      setIsLoading(false);
      console.error('❌ Firebase Auth no está inicializado');
      return;
    }

    try {
      console.log('🔐 Intentando iniciar sesión con:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Usuario autenticado:', userCredential.user.email);
      if (onLoginSuccess) {
        onLoginSuccess(userCredential.user);
      }
    } catch (error) {
      console.error('❌ Error de autenticación:', error);
      console.error('❌ Código del error:', error.code);
      console.error('❌ Mensaje del error:', error.message);
      let errorMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Usuario deshabilitado';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase Authentication no está configurado. Contacta al administrador.';
          break;
        default:
          errorMessage = error.message || 'Error al iniciar sesión';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fade-in-scale">
          {/* Logo y Título */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-blue-500 p-4 rounded-lg text-white shadow-lg">
                <LogIn size={32} strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ANALIZADOR PRO
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Inicia sesión para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="form-label">
                Email
              </label>
              <div className="relative">
                {!email && (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} strokeWidth={2} />
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${email ? 'pl-4' : 'pl-11'} pr-4`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label className="form-label">
                Contraseña
              </label>
              <div className="relative">
                {!password && (
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} strokeWidth={2} />
                )}
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input ${password ? 'pl-4' : 'pl-11'} pr-12`}
                  required
                  disabled={isLoading}
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none z-10"
                    tabIndex={-1}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2} />
                    ) : (
                      <Eye size={18} strokeWidth={2} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-fade-in">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3.5 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} strokeWidth={2} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Si olvidaste tu contraseña, contacta al administrador del sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
