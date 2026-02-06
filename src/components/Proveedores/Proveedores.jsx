import React, { useState } from 'react';
import { Truck, Plus, Trash2, Edit2, Mail, Phone, Globe, User, Eye, EyeOff } from 'lucide-react';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';

export const Proveedores = ({ proveedores, isLoading, onSave, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    website: '',
    usuario: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'danger',
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: null
  });
  
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: 'Error',
    message: ''
  });

  const filteredProveedores = proveedores.filter(proveedor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      proveedor.nombre?.toLowerCase().includes(searchLower) ||
      proveedor.email?.toLowerCase().includes(searchLower) ||
      proveedor.telefono?.toLowerCase().includes(searchLower) ||
      proveedor.website?.toLowerCase().includes(searchLower) ||
      proveedor.usuario?.toLowerCase().includes(searchLower)
    );
  });

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const initForm = (proveedor = null) => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre || '',
        email: proveedor.email || '',
        telefono: proveedor.telefono || '',
        website: proveedor.website || '',
        usuario: proveedor.usuario || '',
        password: proveedor.password || ''
      });
      setEditingId(proveedor.id);
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        website: '',
        usuario: '',
        password: ''
      });
      setEditingId(null);
    }
    setShowForm(true);
    setShowPasswordInForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onUpdate(editingId, formData);
      } else {
        await onSave(formData);
      }
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      setErrorDialog({
        isOpen: true,
        title: editingId ? 'Error al actualizar' : 'Error al guardar',
        message: error.message || 'No se pudo completar la operación.'
      });
    }
  };

  const handleDeleteClick = (id, nombre) => {
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      title: 'Eliminar Proveedor',
      message: `¿Estás seguro de que deseas eliminar a "${nombre}"?`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          await onDelete(id);
        } catch (error) {
          setErrorDialog({
            isOpen: true,
            title: 'Error al eliminar',
            message: error.message || 'No se pudo eliminar.'
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
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Cargando proveedores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Gestión de Proveedores
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Base de datos de proveedores
            </p>
          </div>
          <button onClick={() => initForm()} className="btn btn-primary w-full sm:w-auto min-h-[44px] py-3 sm:py-2">
            <Plus size={18} strokeWidth={2} />
            <span>Agregar Proveedor</span>
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, email, teléfono..."
          className="form-input"
        />
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto my-0 sm:my-8 rounded-t-2xl sm:rounded-xl animate-fade-in-scale p-4 sm:p-6 safe-area-inset-bottom">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">
                  Contraseña {editingId && <span className="text-xs text-gray-400">(vacío = no cambiar)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPasswordInForm ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingId ? '••••••••' : ''}
                    className="form-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPasswordInForm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1 min-h-[44px] py-3">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="btn btn-secondary flex-1 min-h-[44px] py-3"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenido: Cards móvil / Tabla desktop */}
      <div className="table-wrap overflow-hidden">
        {filteredProveedores.length === 0 ? (
          <div className="p-8 sm:p-16 text-center">
            <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-full flex items-center justify-center">
                <Truck size={40} className="sm:w-12 sm:h-12 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {searchTerm ? 'Intenta con otros términos' : 'Agrega tu primer proveedor'}
            </p>
            {!searchTerm && (
              <button onClick={() => initForm()} className="px-6 py-3 min-h-[44px] bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-98">
                Agregar Proveedor
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards para móvil */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredProveedores.map((proveedor) => (
                <div key={proveedor.id} className="p-4 hover:bg-gray-50/50 active:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-slate-900 text-base truncate flex-1">{proveedor.nombre || 'N/A'}</h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => initForm(proveedor)}
                        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg active:scale-95"
                        title="Editar"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(proveedor.id, proveedor.nombre)}
                        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg active:scale-95"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    {proveedor.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="flex-shrink-0 text-gray-400" />
                        <a href={`mailto:${proveedor.email}`} className="truncate text-blue-600">{proveedor.email}</a>
                      </div>
                    )}
                    {proveedor.telefono && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="flex-shrink-0 text-gray-400" />
                        <a href={`tel:${proveedor.telefono}`} className="text-slate-700">{proveedor.telefono}</a>
                      </div>
                    )}
                    {proveedor.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="flex-shrink-0 text-gray-400" />
                        <a href={proveedor.website.startsWith('http') ? proveedor.website : `https://${proveedor.website}`} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600">Ver sitio</a>
                      </div>
                    )}
                    {proveedor.usuario && (
                      <div className="flex items-center gap-2">
                        <User size={14} className="flex-shrink-0 text-gray-400" />
                        <span className="truncate">{proveedor.usuario}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">
                        {visiblePasswords[proveedor.id] ? (proveedor.password || '—') : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(proveedor.id)}
                        className="p-2 min-w-[36px] min-h-[36px] text-gray-500 rounded"
                        title={visiblePasswords[proveedor.id] ? 'Ocultar' : 'Mostrar'}
                      >
                        {visiblePasswords[proveedor.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
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
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Website</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.map((proveedor) => (
                  <tr key={proveedor.id}>
                    <td className="px-4 py-4 font-bold text-slate-900">{proveedor.nombre || 'N/A'}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} />
                        {proveedor.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} />
                        {proveedor.telefono || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {proveedor.website ? (
                        <a href={proveedor.website.startsWith('http') ? proveedor.website : `https://${proveedor.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                          <Globe size={14} />
                          {proveedor.website}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User size={14} />
                        {proveedor.usuario || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {visiblePasswords[proveedor.id] ? (proveedor.password || '—') : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(proveedor.id)}
                          className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          title={visiblePasswords[proveedor.id] ? 'Ocultar' : 'Mostrar'}
                        >
                          {visiblePasswords[proveedor.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => initForm(proveedor)}
                          className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg transition-colors active:scale-95"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(proveedor.id, proveedor.nombre)}
                          className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
      />

      <ConfirmDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setErrorDialog(prev => ({ ...prev, isOpen: false }))}
        title={errorDialog.title}
        message={errorDialog.message}
        confirmText="Entendido"
        cancelText=""
        type="warning"
      />
    </div>
  );
};
