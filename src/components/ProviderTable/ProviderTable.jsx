import React from 'react';
import { Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';

export const ProviderTable = ({ 
  item, 
  itemId, 
  calculados, 
  minCosto, 
  ivaRate, 
  actualizarProveedor, 
  eliminarProveedor 
}) => {
  const calcularConIva = (costo, aplicaIva, margen, cantidad) => {
    const valCosto = Number(costo) || 0;
    const valMargen = Number(margen) || 0;
    const valCant = Number(cantidad) || 0;
    
    const costoMasIva = aplicaIva ? valCosto * (1 + ivaRate / 100) : valCosto;
    const precioPublico = costoMasIva * (1 + valMargen / 100);
    const gananciaUnidad = precioPublico - costoMasIva;
    const totalGanancia = gananciaUnidad * valCant;

    return {
      costoMasIva: parseFloat(costoMasIva.toFixed(2)),
      precioPublico: parseFloat(precioPublico.toFixed(2)),
      totalGanancia: parseFloat(totalGanancia.toFixed(2))
    };
  };

  // Calcular altura máxima basada en número de proveedores
  // Altura por fila aproximada: ~80px (padding + contenido)
  // Mostrar scroll solo si hay más de 3 proveedores
  const numProveedores = item.proveedores.length;
  const maxHeight = numProveedores > 3 ? 'max-h-[280px]' : 'max-h-none';
  const showScroll = numProveedores > 3;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3 p-3">
        {item.proveedores.map((prov, index) => {
          const { costoMasIva, precioPublico, totalGanancia } = calcularConIva(
            prov.costo, 
            prov.aplicaIva, 
            prov.margen, 
            item.cantidad
          );
          const esMejor = costoMasIva === minCosto && prov.costo > 0;
          return (
            <div
              key={prov.id}
              className={`p-4 rounded-xl border-2 transition-all animate-fade-in ${
                esMejor 
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 shadow-lg' 
                  : 'bg-white border-slate-200'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {esMejor && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  )}
                  <input 
                    type="text" 
                    placeholder="Proveedor..." 
                    value={prov.nombre}
                    onChange={(e) => actualizarProveedor(itemId, prov.id, 'nombre', e.target.value)}
                    className={`bg-transparent font-bold outline-none w-full placeholder:text-slate-300 transition-colors text-sm ${
                      esMejor ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  />
                </div>
                <button 
                  onClick={() => eliminarProveedor(itemId, prov.id)}
                  className="p-1.5 text-slate-300 active:text-red-500 active:bg-red-50 rounded-lg transition-all active:scale-110 touch-manipulation flex-shrink-0"
                  title="Eliminar proveedor"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Costo Unit.</label>
                  <div className="flex items-center gap-1 font-black text-slate-700">
                    <span className="opacity-40 text-xs">$</span>
                    <input 
                      type="number" 
                      value={prov.costo || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? 0 : Number(value);
                        actualizarProveedor(itemId, prov.id, 'costo', numValue);
                      }}
                      className="w-full text-sm text-center outline-none bg-slate-50 rounded-lg px-2 py-1.5 focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-all"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Final (+IVA)</label>
                  <div className="font-black text-slate-800 text-sm">${costoMasIva.toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Margen %</label>
                  <div className="flex items-center gap-1 font-bold text-slate-600">
                    <input 
                      type="number" 
                      value={prov.margen}
                      onChange={(e) => actualizarProveedor(itemId, prov.id, 'margen', Number(e.target.value))}
                      className="w-full text-sm text-center outline-none bg-slate-50 rounded-lg px-2 py-1.5 focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <span className="opacity-40 text-xs">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">IVA</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={prov.aplicaIva}
                      onChange={(e) => actualizarProveedor(itemId, prov.id, 'aplicaIva', e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer checked:bg-purple-600 checked:border-purple-600"
                    />
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[9px] font-black text-purple-600 uppercase tracking-wider block mb-1">PVP Sugerido</label>
                  <div className="font-black text-purple-600 text-sm">${precioPublico.toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block mb-1">Utilidad</label>
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black inline-block">
                    ${totalGanancia.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Link</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={prov.link || ''}
                    onChange={(e) => actualizarProveedor(itemId, prov.id, 'link', e.target.value)}
                    className="flex-1 text-xs outline-none bg-slate-50 rounded-lg px-2 py-1.5 focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                  />
                  {prov.link && (
                    <a 
                      href={prov.link} 
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
      <div className={`hidden md:block overflow-x-auto ${showScroll ? 'overflow-y-auto' : 'overflow-y-visible'} ${maxHeight}`}>
        <table className="w-full min-w-[1100px]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-blue-50/30">
          <tr className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-100">
            <th className="p-4">PROVEEDOR</th>
            <th className="p-4 text-center">COSTO UNIT.</th>
            <th className="p-4 text-center">IVA</th>
            <th className="p-4 text-center">FINAL (+IVA)</th>
            <th className="p-4 text-center">GANANCIA %</th>
            <th className="p-4 text-center text-purple-600">PVP SUGERIDO</th>
            <th className="p-4 text-center text-emerald-600">UTILIDAD PROYECTADA</th>
            <th className="p-4 text-center">Link</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {item.proveedores.map((prov, index) => {
            const { costoMasIva, precioPublico, totalGanancia } = calcularConIva(
              prov.costo, 
              prov.aplicaIva, 
              prov.margen, 
              item.cantidad
            );
            const esMejor = costoMasIva === minCosto && prov.costo > 0;
            return (
              <tr 
                key={prov.id} 
                className={`group transition-all duration-200 animate-fade-in ${
                  esMejor 
                    ? 'bg-gradient-to-r from-emerald-50/60 via-emerald-50/40 to-transparent border-l-4 border-emerald-500' 
                    : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/20'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {esMejor ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300 flex-shrink-0"></div>
                    )}
                    <input 
                      type="text" 
                      placeholder="Proveedor..." 
                      value={prov.nombre}
                      onChange={(e) => actualizarProveedor(itemId, prov.id, 'nombre', e.target.value)}
                      className={`bg-transparent font-bold outline-none w-full placeholder:text-slate-300 transition-colors text-sm ${
                        esMejor ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1 font-black text-slate-700">
                    <span className="opacity-40">$</span>
                    <input 
                      type="number" 
                      value={prov.costo || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? 0 : Number(value);
                        actualizarProveedor(itemId, prov.id, 'costo', numValue);
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '' || e.target.value === '0') {
                          actualizarProveedor(itemId, prov.id, 'costo', 0);
                        }
                      }}
                      className="w-20 text-center outline-none bg-transparent rounded-lg px-2 py-1 focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={prov.aplicaIva}
                      onChange={(e) => actualizarProveedor(itemId, prov.id, 'aplicaIva', e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer checked:bg-purple-600 checked:border-purple-600"
                    />
                  </label>
                </td>
                <td className="p-4 text-center">
                  <span className="font-black text-slate-800">${costoMasIva.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1 font-bold text-slate-600">
                    <input 
                      type="number" 
                      value={prov.margen}
                      onChange={(e) => actualizarProveedor(itemId, prov.id, 'margen', Number(e.target.value))}
                      className="w-12 text-center outline-none bg-transparent rounded-lg px-2 py-1 focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    <span className="opacity-40">%</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="font-black text-purple-600 text-sm">
                    ${precioPublico.toFixed(2)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-black inline-block">
                    ${totalGanancia.toFixed(2)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <input 
                      type="url" 
                      placeholder="https://..."
                      value={prov.link || ''}
                      onChange={(e) => actualizarProveedor(itemId, prov.id, 'link', e.target.value)}
                      className="w-28 text-xs text-center outline-none bg-slate-50/50 rounded-lg px-2 py-1 focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                    />
                    {prov.link && (
                      <a 
                        href={prov.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-all"
                        title="Abrir enlace"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => eliminarProveedor(itemId, prov.id)}
                    className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-300 active:text-red-500 active:bg-red-50 rounded-xl transition-all active:scale-110 touch-manipulation"
                    title="Eliminar proveedor"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};
