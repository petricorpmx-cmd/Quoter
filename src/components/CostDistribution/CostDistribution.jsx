import React from 'react';
import { BarChart3 } from 'lucide-react';

export const CostDistribution = ({ calculados, minCosto }) => {
  // Filtrar solo proveedores con costo > 0 y tomar los 2 más relevantes
  const proveedoresValidos = calculados
    .filter(c => c.costoFinal > 0)
    .sort((a, b) => a.costoFinal - b.costoFinal)
    .slice(0, 2);

  const maxCosto = proveedoresValidos.length > 0 
    ? Math.max(...proveedoresValidos.map(p => p.costoFinal))
    : 0;

  if (proveedoresValidos.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-slate-600" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-600">
          DISTRIBUCIÓN DE COSTOS
        </h3>
      </div>
      
      <div className="space-y-4">
        {proveedoresValidos.map((proveedor, index) => {
          const percentage = maxCosto > 0 ? (proveedor.costoFinal / maxCosto) * 100 : 0;
          const esMejor = proveedor.costoFinal === minCosto;
          
          return (
            <div key={proveedor.id || index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {esMejor && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded uppercase">
                      MEJOR
                    </span>
                  )}
                  <span className={`text-sm font-black ${esMejor ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {proveedor.nombre || 'S/N'}
                  </span>
                </div>
                <span className={`text-sm font-black ${esMejor ? 'text-emerald-600' : 'text-slate-600'}`}>
                  ${proveedor.costoFinal.toFixed(2)}
                </span>
              </div>
              <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    esMejor 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
