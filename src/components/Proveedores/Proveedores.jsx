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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-16 text-center animate-fade-in">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Cargando proveedores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Gestión de Proveedores
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Base de datos de proveedores
            </p>
          </div>
          <button onClick={() => initForm()} className="btn btn-primary">
            <Plus size={18} strokeWidth={2} />
            <span>Agregar Proveedor</span>
          </button>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, email, teléfono, website o usuario..."
          className="form-input"
        />
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="card max-w-md w-full my-8 animate-fade-in-scale">
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

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="table-wrap">
        {filteredProveedores.length === 0 ? (
          <div className="p-16 text-center">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-full flex items-center justify-center">
                <Truck size={48} className="text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer proveedor'}
            </p>
            {!searchTerm && (
              <button onClick={() => initForm()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                Agregar Proveedor
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
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
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
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
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(proveedor.id, proveedor.nombre)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
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
