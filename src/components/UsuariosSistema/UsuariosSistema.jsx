import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Mail, Phone, User, Calendar, Search, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';

export const UsuariosSistema = ({ 
  usuarios, 
  isLoading, 
  onSave, 
  onUpdate, 
  onDelete 
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
        // Al editar, no cambiamos la contraseña
        const { password, ...dataToUpdate } = formData;
        
        // Si es el administrador, agregar el flag isDefaultAdmin
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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-16 text-center animate-fade-in">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Usuarios del Sistema
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => initForm()}
            className="btn btn-primary"
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
            className={`form-input ${searchTerm ? 'pl-4' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full animate-fade-in-scale">
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
              {!editingId && (
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
              {/* Mostrar contraseña generada */}
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

              <div className="flex gap-3 pt-2">
                {!createdPassword && (
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
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
                      className="btn btn-secondary flex-1"
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
                    className="btn btn-primary w-full"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Usuarios */}
      <div className="table-wrap">
        {filteredUsuarios.length === 0 ? (
          <div className="p-16 text-center">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-full flex items-center justify-center">
                <Users size={48} className="text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza agregando tu primer usuario del sistema'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => initForm()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
              >
                Agregar Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
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
