import React, { useState, useEffect } from 'react';
import { BarChart3, Trophy, TrendingDown } from 'lucide-react';

export const ComparisonChart = ({ calculados }) => {
  // Filtrar solo proveedores con costo > 0 y ordenar
  const proveedoresValidos = calculados
    .filter(c => c.costoFinal > 0)
    .sort((a, b) => a.costoFinal - b.costoFinal);
  
  const minCosto = proveedoresValidos.length > 0 ? proveedoresValidos[0].costoFinal : 0;
  const maxCosto = proveedoresValidos.length > 0 
    ? proveedoresValidos[proveedoresValidos.length - 1].costoFinal 
    : 0;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [calculados]);

  if (proveedoresValidos.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <BarChart3 size={14} className="text-blue-600" />
          </div>
          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
            Comparativa de Costos
          </h4>
        </div>
        {minCosto > 0 && (
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingDown size={12} />
            <span className="text-xs font-black">Mejor: ${minCosto.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
        {proveedoresValidos.map((c, index) => {
          const percentage = maxCosto > 0 ? (c.costoFinal / maxCosto) * 100 : 0;
          const esMejor = c.costoFinal === minCosto;
          const diferencia = c.costoFinal - minCosto;
          const porcentajeDiferencia = minCosto > 0 ? ((diferencia / minCosto) * 100) : 0;
          
          return (
            <div key={c.id} className="space-y-1.5 animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {esMejor && (
                    <div className="p-0.5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded flex-shrink-0">
                      <Trophy size={10} className="text-white" />
                    </div>
                  )}
                  <span className={`text-xs font-black truncate ${esMejor ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {c.nombre || 'S/N'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!esMejor && diferencia > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      +{porcentajeDiferencia.toFixed(0)}%
                    </span>
                  )}
                  <span className={`text-sm font-black ${esMejor ? 'text-emerald-600' : 'text-slate-800'}`}>
                    ${c.costoFinal.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out rounded-full ${
                    esMejor 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-200/50' 
                      : 'bg-gradient-to-r from-slate-300 to-slate-400'
                  }`}
                  style={{ 
                    width: animated ? `${percentage}%` : '0%',
                    transitionDelay: `${index * 0.05}s`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {proveedoresValidos.length > 5 && (
        <div className="mt-2 text-center">
          <span className="text-[9px] text-slate-400 font-bold">
            Mostrando {proveedoresValidos.length} proveedor(es) con costo
          </span>
        </div>
      )}
    </div>
  );
};
