import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Mail, Phone, Search, KeyRound } from 'lucide-react';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';

export const UsuariosSistema = ({ 
  usuarios, 
  isLoading, 
  onSave, 
  onUpdate, 
  onDelete,
  onSendPasswordReset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: 'usuario',
    activo: true,
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createdPassword, setCreatedPassword] = useState(null);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: null
  });
  
  // Estado para el diálogo de error
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: 'Error',
    message: ''
  });

  // Filtrar usuarios por búsqueda
  const filteredUsuarios = usuarios.filter(usuario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.nombre?.toLowerCase().includes(searchLower) ||
      usuario.email?.toLowerCase().includes(searchLower) ||
      usuario.telefono?.toLowerCase().includes(searchLower) ||
      usuario.rol?.toLowerCase().includes(searchLower)
    );
  });

  // Inicializar formulario
  const initForm = (usuario = null) => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        rol: usuario.rol || 'usuario',
        activo: usuario.activo !== undefined ? usuario.activo : true,
        password: ''
      });
      setEditingId(usuario.id);
      setShowPassword(false);
      setCreatedPassword(null);
      setResetEmailSent(false);
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        rol: 'usuario',
        activo: true,
        password: ''
      });
      setEditingId(null);
      setShowPassword(true);
      setCreatedPassword(null);
    }
    setShowForm(true);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Al editar, no incluimos la contraseña (se usa "Enviar correo de recuperación" en su lugar)
        const { password, ...dataToUpdate } = formData;
        if (editingId === 'admin-default') {
          dataToUpdate.isDefaultAdmin = true;
        }
        
        await onUpdate(editingId, dataToUpdate);
        setShowForm(false);
        setEditingId(null);
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          rol: 'usuario',
          activo: true,
          password: ''
        });
      } else {
        // Al crear, guardamos y mostramos la contraseña temporal
        const result = await onSave(formData);
        if (result && result.password) {
          setCreatedPassword(result.password);
          // No cerramos el formulario para que el usuario vea la contraseña
        } else {
          setShowForm(false);
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            rol: 'usuario',
            activo: true,
            password: ''
          });
        }
      }
    } catch (error) {
      console.error('Error al procesar usuario:', error);
      let errorMessage = 'Error al procesar usuario';
      
      if (error.message) {
        if (error.message.includes('ya está registrado')) {
          errorMessage = error.message;
          // Si es un error de usuario ya registrado, cerrar el formulario
          if (!editingId) {
            setShowForm(false);
            setFormData({
              nombre: '',
              email: '',
              telefono: '',
              rol: 'usuario',
              activo: true,
              password: ''
            });
          }
        } else if (error.message.includes('Email inválido')) {
          errorMessage = 'El formato del email no es válido. Por favor, verifica el email ingresado.';
        } else if (error.message.includes('contraseña')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrorDialog({
        isOpen: true,
        title: editingId ? 'Error al actualizar usuario' : 'Error al guardar usuario',
        message: errorMessage
      });
    }
  };

  // Enviar correo de recuperación de contraseña
  const handleSendPasswordReset = async (e) => {
    e.preventDefault();
    if (!formData.email || !onSendPasswordReset) return;
    
    setSendingResetEmail(true);
    setResetEmailSent(false);
    try {
      await onSendPasswordReset(formData.email);
      setResetEmailSent(true);
    } catch (error) {
      setErrorDialog({
        isOpen: true,
        title: 'Error al enviar correo',
        message: error.message || 'No se pudo enviar el correo de recuperación.'
      });
    } finally {
      setSendingResetEmail(false);
    }
  };

  // Manejar eliminación
  const handleDeleteClick = (usuarioId, usuarioNombre) => {
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que deseas eliminar a "${usuarioNombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          await onDelete(usuarioId);
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          setErrorDialog({
            isOpen: true,
            title: 'Error al eliminar usuario',
            message: error.message || 'No se pudo eliminar el usuario. Por favor, intenta nuevamente.'
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8 sm:p-16 text-center animate-fade-in">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Header */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Usuarios del Sistema
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => initForm()}
            className="btn btn-primary w-full sm:w-auto min-h-[44px] py-3 sm:py-2"
          >
            <Plus size={18} strokeWidth={2} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          {!searchTerm && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={18} strokeWidth={2} />
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o rol..."
            className={`form-input ${searchTerm ? 'pl-4' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto my-0 sm:my-8 rounded-t-2xl sm:rounded-xl animate-fade-in-scale p-4 sm:p-6 safe-area-inset-bottom">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="form-input"
                />
              </div>
              {!editingId ? (
                <div>
                  <label className="form-label">
                    Contraseña Temporal <span className="text-xs text-gray-400 font-normal">(se generará automáticamente si se deja vacío)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Dejar vacío para generar automáticamente"
                    className="form-input"
                  />
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    ¿El usuario olvidó su contraseña?
                  </p>
                  <button
                    type="button"
                    onClick={handleSendPasswordReset}
                    disabled={sendingResetEmail || !formData.email}
                    className="btn btn-secondary w-full text-sm flex items-center justify-center gap-2 min-h-[44px] py-3"
                  >
                    <KeyRound size={16} />
                    {sendingResetEmail ? 'Enviando...' : 'Enviar correo de recuperación'}
                  </button>
                  {resetEmailSent && (
                    <p className="text-xs text-emerald-700 mt-2 font-medium">
                      ✅ Correo enviado. El usuario recibirá un enlace para restablecer su contraseña.
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="form-label">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="form-input"
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Usuario Activo
                </label>
              </div>
              {/* Mostrar contraseña generada al crear usuario */}
              {createdPassword && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm font-bold text-blue-900 mb-2">
                    ✅ Usuario creado exitosamente
                  </p>
                  <p className="text-xs text-blue-700 mb-2">
                    Contraseña temporal generada. Compártela con el usuario:
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-blue-300">
                    <code className="flex-1 text-sm font-mono font-black text-blue-900">
                      {createdPassword}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdPassword);
                        alert('Contraseña copiada al portapapeles');
                      }}
                      className="btn btn-primary text-xs"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    ⚠️ Esta contraseña solo se mostrará una vez. El usuario deberá cambiarla al iniciar sesión.
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                {!createdPassword && (
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1 min-h-[44px] py-3"
                    >
                      {editingId ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setCreatedPassword(null);
                      }}
                      className="btn btn-secondary flex-1 min-h-[44px] py-3"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {createdPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setCreatedPassword(null);
                      setFormData({
                        nombre: '',
                        email: '',
                        telefono: '',
                        rol: 'usuario',
                        activo: true,
                        password: ''
                      });
                    }}
                    className="btn btn-primary w-full min-h-[44px] py-3"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Usuarios: Cards móvil / Tabla desktop */}
      <div className="table-wrap overflow-hidden">
        {filteredUsuarios.length === 0 ? (
          <div className="p-8 sm:p-16 text-center">
            <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-full flex items-center justify-center">
                <Users size={40} className="sm:w-12 sm:h-12 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {searchTerm 
                ? 'Intenta con otros términos' 
                : 'Comienza agregando tu primer usuario'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => initForm()}
                className="px-6 py-3 min-h-[44px] bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
              >
                Agregar Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards para móvil */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredUsuarios.map((usuario) => (
                <div key={usuario.id} className="p-4 hover:bg-gray-50/50 active:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black flex-shrink-0">
                        {usuario.nombre?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{usuario.nombre || 'Sin nombre'}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
                          usuario.rol === 'admin' 
                            ? 'bg-red-100 text-red-700' 
                            : usuario.rol === 'editor'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {usuario.rol || 'usuario'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => initForm(usuario)}
                        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg active:scale-95"
                        title="Editar"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(usuario.id, usuario.nombre)}
                        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg active:scale-95"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    {usuario.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="flex-shrink-0 text-gray-400" />
                        <a href={`mailto:${usuario.email}`} className="truncate text-blue-600">{usuario.email}</a>
                      </div>
                    )}
                    {usuario.telefono && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="flex-shrink-0 text-gray-400" />
                        <a href={`tel:${usuario.telefono}`} className="text-slate-700">{usuario.telefono}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        usuario.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla para desktop */}
            <div className="hidden md:block overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black">
                          {usuario.nombre?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-slate-900">{usuario.nombre || 'Sin nombre'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} />
                        <span>{usuario.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} strokeWidth={2} />
                        <span>{usuario.telefono || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        usuario.rol === 'admin' 
                          ? 'bg-red-100 text-red-700' 
                          : usuario.rol === 'editor'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {usuario.rol || 'usuario'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        usuario.activo 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => initForm(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
                          title="Editar usuario"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(usuario.id, usuario.nombre)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
      />

      {/* Diálogo de Error */}
      <ConfirmDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        onConfirm={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        confirmText="Entendido"
        cancelText=""
        type="warning"
      />
    </div>
  );
};
