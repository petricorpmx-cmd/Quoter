import React from 'react';
import { Tag, Trash2, ChevronDown, Plus, Star } from 'lucide-react';
import { ProviderTable } from '../ProviderTable/ProviderTable';
import { SavingsSummary } from '../SavingsSummary/SavingsSummary';
import { CostDistribution } from '../CostDistribution/CostDistribution';
import { calcularValores } from '../../utils/calculations';
import { findBestProvider } from '../../utils/findBestProvider';

export const ProductItem = ({ 
  item, 
  ivaRate, 
  expandedItems, 
  setExpandedItems, 
  setItems, 
  items,
  actualizarProveedor,
  eliminarProveedor,
  agregarProveedor,
  onSaveBestProvider
}) => {
  const calcularConIva = (costo, aplicaIva, margen, cantidad) => 
    calcularValores(costo, aplicaIva, margen, cantidad, ivaRate);

  const calculados = item.proveedores.map(p => ({
    id: p.id, 
    nombre: String(p.nombre || 'S/N'),
    costoFinal: calcularConIva(p.costo, p.aplicaIva, p.margen, item.cantidad).costoMasIva
  }));
  
  const costosValidos = calculados.filter(c => c.costoFinal > 0).map(c => c.costoFinal);
  const minCosto = costosValidos.length > 0 ? Math.min(...costosValidos) : 0;
  const maxCosto = costosValidos.length > 0 ? Math.max(...costosValidos) : 0;
  const isExpanded = expandedItems.includes(item.id);
  const bestProvider = findBestProvider(item, ivaRate);

  const handleSaveBestProvider = (e) => {
    e.stopPropagation();
    if (bestProvider && onSaveBestProvider) {
      onSaveBestProvider(bestProvider);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/50 overflow-hidden transition-all duration-300 active:shadow-2xl active:border-blue-200/50 animate-scale-in active:scale-[0.99] touch-manipulation">
      <div 
        className="p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group"
        onClick={() => setExpandedItems(prev => 
          prev.includes(item.id) 
            ? prev.filter(i => i !== item.id) 
            : [...prev, item.id]
        )}
      >
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl text-blue-600 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                <Tag size={22} />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <input 
                type="text" 
                placeholder="Ejemplo: Laptop Pro X" 
                value={item.nombre}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setItems(items.map(i => 
                  i.id === item.id ? {...i, nombre: e.target.value} : i
                ))}
                className="font-black text-lg sm:text-xl text-slate-800 bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none w-full placeholder:text-slate-300 transition-colors"
              />
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold mt-1">NOMBRE DEL ITEM</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider hidden sm:inline">CANTIDAD</span>
            <div className="bg-slate-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <input 
                type="number" 
                value={item.cantidad}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setItems(items.map(i => 
                  i.id === item.id ? {...i, cantidad: Number(e.target.value)} : i
                ))}
                className="w-10 sm:w-12 bg-transparent text-center font-black text-slate-900 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              setItems(items.filter(i => i.id !== item.id)); 
            }} 
            className="p-2 sm:p-2.5 text-slate-300 active:text-red-500 active:bg-red-50 rounded-xl transition-all active:scale-110 touch-manipulation"
            title="Eliminar producto"
          >
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
          </button>
          <div className={`p-2 sm:p-2.5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl transition-all duration-300 ${
            isExpanded ? 'rotate-180 text-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50' : 'text-slate-400 group-active:text-blue-500'
          }`}>
            <ChevronDown size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 bg-white animate-fade-in">
          {/* Cards de Resumen y Distribución */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <SavingsSummary 
              minCosto={minCosto}
              maxCosto={maxCosto}
              mejorProveedor={bestProvider}
            />
            <CostDistribution 
              calculados={calculados}
              minCosto={minCosto}
            />
          </div>
          
          {/* Tabla de Proveedores */}
          <div className="mb-6">
            <ProviderTable 
              item={item}
              itemId={item.id}
              calculados={calculados}
              minCosto={minCosto}
              ivaRate={ivaRate}
              actualizarProveedor={actualizarProveedor}
              eliminarProveedor={eliminarProveedor}
            />
          </div>
          
          {/* Botones */}
          <div className="space-y-4">
            {bestProvider && (
              <button 
                onClick={handleSaveBestProvider}
                className="w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white font-black active:from-emerald-600 active:via-emerald-700 active:to-emerald-600 transition-all shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-[0.15em] sm:tracking-[0.2em] active:scale-98 relative overflow-hidden group touch-manipulation text-xs sm:text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-1000"></div>
                <Star size={18} className="sm:w-5 sm:h-5 fill-current relative z-10" />
                <span className="relative z-10">Guardar Mejor Proveedor</span>
              </button>
            )}
            
            <button 
              onClick={() => agregarProveedor(item.id)}
              className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-[10px] sm:text-xs font-black text-slate-500 active:text-slate-700 active:border-slate-400 active:bg-slate-100 transition-all uppercase tracking-wider active:scale-98 flex items-center justify-center gap-2 touch-manipulation"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">AÑADIR PROVEEDOR ESTRATÉGICO</span>
              <span className="sm:hidden">AÑADIR PROVEEDOR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
