import React, { useState } from 'react';
import { Star, Trash2, Calendar, Database, Download, CheckSquare, Square, ExternalLink } from 'lucide-react';

export const FavoriteProviders = ({ favoriteProviders, onDelete, isLoading, onDeleteMultiple }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  // Manejar selección individual
  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // Seleccionar/deseleccionar todos
  const toggleSelectAll = () => {
    if (selectedIds.length === favoriteProviders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favoriteProviders.map(p => p.id));
    }
  };

  // Eliminar seleccionados
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    
    // Usar la función onDeleteMultiple que ya tiene la confirmación integrada
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedIds);
      setSelectedIds([]);
    } else {
      // Si no hay función para eliminar múltiples, eliminar uno por uno
      selectedIds.forEach(id => {
        onDelete(id);
      });
      setSelectedIds([]);
    }
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    const headers = [
      'Proveedor',
      'Producto',
      'Cantidad',
      'Costo Base',
      'Costo + IVA',
      'IVA %',
      'Aplica IVA',
      'Margen %',
      'Ganancia',
      'Link',
      'Fecha Guardado'
    ];

    const rows = favoriteProviders.map(provider => {
      const fecha = provider.savedAt 
        ? new Date(provider.savedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'N/A';

      return [
        provider.nombre || 'Sin nombre',
        provider.productoNombre || 'N/A',
        provider.cantidad || 0,
        (provider.costo || 0).toFixed(2),
        (provider.calculos?.costoMasIva || 0).toFixed(2),
        provider.ivaRate || 16,
        provider.aplicaIva ? 'Sí' : 'No',
        provider.margen || 0,
        (provider.calculos?.totalGanancia || 0).toFixed(2),
        provider.link || '',
        fecha
      ];
    });

    // Crear contenido CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Crear BOM para Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `proveedores_guardados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-16 text-center animate-fade-in">
        <div className="relative mx-auto w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Cargando proveedores guardados...</p>
      </div>
    );
  }

  if (favoriteProviders.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-16 text-center animate-fade-in">
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full blur-xl opacity-50"></div>
          <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-full flex items-center justify-center">
            <Database size={48} className="text-emerald-400" />
          </div>
        </div>
        <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
          No hay proveedores guardados
        </h3>
        <p className="text-slate-500 text-sm font-bold">Los proveedores que guardes aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden animate-fade-in">
      {/* Barra de herramientas */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b-2 border-slate-200 p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all hover-lift text-xs"
            title={selectedIds.length === favoriteProviders.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
          >
            {selectedIds.length === favoriteProviders.length ? (
              <CheckSquare size={14} className="text-blue-600" />
            ) : (
              <Square size={14} className="text-slate-400" />
            )}
            <span className="font-black text-slate-700 uppercase tracking-wider text-[10px]">
              {selectedIds.length === favoriteProviders.length ? 'Deseleccionar' : 'Seleccionar'} Todos
            </span>
          </button>
          
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-all hover-lift text-xs"
            >
              <Trash2 size={14} />
              <span className="font-black uppercase tracking-wider text-[10px]">
                Eliminar ({selectedIds.length})
              </span>
            </button>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md shadow-blue-200/50 hover-lift text-xs"
        >
          <Download size={14} />
          <span className="font-black uppercase tracking-wider text-[10px]">Exportar CSV</span>
        </button>
      </div>

      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3 p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {favoriteProviders.map((provider, index) => {
          const fecha = provider.savedAt ? new Date(provider.savedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'N/A';
          const isSelected = selectedIds.includes(provider.id);
          return (
            <div
              key={provider.id}
              className={`p-4 rounded-xl border-2 transition-all animate-fade-in ${
                isSelected 
                  ? 'bg-blue-50 border-blue-300 shadow-lg' 
                  : 'bg-white border-slate-200'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(provider.id)}
                    className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-1 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <Star size={14} className="text-emerald-500 fill-current flex-shrink-0" />
                    <span className="font-black text-slate-900 text-sm truncate">{provider.nombre || 'Sin nombre'}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(provider.id)}
                  className="p-1.5 text-slate-300 active:text-red-500 active:bg-red-50 rounded-lg transition-all active:scale-110 touch-manipulation flex-shrink-0"
                  title="Eliminar proveedor guardado"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Producto:</span>
                  <span className="font-black text-slate-900">{provider.productoNombre || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Cantidad</span>
                    <span className="font-black text-slate-900">{provider.cantidad || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Costo Base</span>
                    <span className="font-black text-slate-900">${(provider.costo || 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold block mb-1">Costo + IVA</span>
                    <span className="font-black text-blue-600">${provider.calculos?.costoMasIva?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div>
                    <span className="text-emerald-600 font-bold block mb-1">Ganancia</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                      ${provider.calculos?.totalGanancia?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">{fecha}</span>
                  </div>
                  {provider.link && (
                    <a 
                      href={provider.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-600 active:text-blue-700 active:bg-blue-50 rounded transition-all touch-manipulation"
                      title="Abrir enlace"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista de Tabla para Desktop */}
      <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-300px)]">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b-2 border-slate-200">
              <th className="p-2 text-center w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === favoriteProviders.length && favoriteProviders.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="p-2 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-emerald-600 fill-current" />
                  Proveedor
                </div>
              </th>
              <th className="p-2 text-left text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">Producto</th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">Cantidad</th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">Costo Base</th>
              <th className="p-2 text-center text-[10px] font-black text-blue-600 uppercase tracking-wider whitespace-nowrap">Costo + IVA</th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">IVA</th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">Margen %</th>
              <th className="p-2 text-center text-[10px] font-black text-emerald-600 uppercase tracking-wider whitespace-nowrap">Ganancia</th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <Calendar size={12} />
                  <span className="hidden sm:inline">Fecha</span>
                </div>
              </th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">Link</th>
              <th className="p-2 text-center text-[10px] font-black text-slate-600 uppercase tracking-wider whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {favoriteProviders.map((provider, index) => {
              const fecha = provider.savedAt ? new Date(provider.savedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A';

              const isSelected = selectedIds.includes(provider.id);

              return (
                <tr 
                  key={provider.id} 
                  className={`group transition-all duration-200 animate-fade-in ${
                    isSelected 
                      ? 'bg-blue-50/50 border-l-4 border-blue-500' 
                      : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/20'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(provider.id)}
                      className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-1.5">
                      <Star size={12} className="text-emerald-500 fill-current flex-shrink-0" />
                      <span className="font-black text-slate-900 text-xs truncate max-w-[120px]">{provider.nombre || 'Sin nombre'}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="font-bold text-slate-700 text-xs truncate max-w-[120px]">{provider.productoNombre || 'N/A'}</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="font-black text-slate-900 text-sm">{provider.cantidad || 0}</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="font-black text-slate-900 text-xs">${(provider.costo || 0).toFixed(2)}</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="font-black text-blue-600 text-sm">
                      ${provider.calculos?.costoMasIva?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-bold text-slate-700 text-xs">{provider.ivaRate || 16}%</span>
                      {provider.aplicaIva && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[8px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <span className="font-bold text-slate-700 text-xs">{provider.margen || 0}%</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="font-black text-emerald-600 text-sm bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                      ${provider.calculos?.totalGanancia?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <Calendar size={10} className="hidden sm:inline" />
                      <span className="text-[10px] font-bold whitespace-nowrap">{fecha}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      {provider.link ? (
                        <>
                          <input 
                            type="url" 
                            value={provider.link}
                            readOnly
                            className="w-28 text-xs text-center outline-none bg-slate-50/50 rounded-lg px-2 py-1 text-slate-600 truncate"
                            title={provider.link}
                          />
                          <a 
                            href={provider.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-all"
                            title="Abrir enlace"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => onDelete(provider.id)}
                      className="p-1.5 text-slate-300 active:text-red-500 active:bg-red-50 rounded-lg transition-all active:scale-110 opacity-0 group-hover:opacity-100 touch-manipulation"
                      title="Eliminar proveedor guardado"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer con resumen */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-t-2 border-slate-200 p-2 sticky bottom-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-slate-600 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Database size={12} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Total: {favoriteProviders.length}
              </span>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-1.5 text-blue-600">
                <CheckSquare size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Seleccionados: {selectedIds.length}
                </span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-bold">
            Actualizado: {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>
      </div>
    </div>
  );
};
