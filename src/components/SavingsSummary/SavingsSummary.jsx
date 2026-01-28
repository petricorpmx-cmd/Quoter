import React from 'react';
import { TrendingDown } from 'lucide-react';

export const SavingsSummary = ({ minCosto, maxCosto, mejorProveedor }) => {
  const diferencia = maxCosto - minCosto;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown size={18} className="text-slate-300" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">
          RESUMEN DE AHORRO
        </h3>
      </div>
      
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 mb-2">Mejor Costo Final</p>
        <p className="text-4xl font-black text-emerald-400">
          ${minCosto.toFixed(2)}
        </p>
      </div>

      {diferencia > 0 && (
        <p className="text-xs text-slate-300 leading-relaxed">
          Hay una diferencia de <span className="font-black text-emerald-400">${diferencia.toFixed(2)}</span> entre el proveedor más caro y el más barato.
        </p>
      )}
    </div>
  );
};
