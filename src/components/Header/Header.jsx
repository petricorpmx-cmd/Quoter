import React from 'react';
import { Calculator, Cloud, Check, Download, Sparkles, Star, Percent } from 'lucide-react';

export const Header = ({ ivaRate, setIvaRate, onExportPDF, isChatOpen, setIsChatOpen, isSaving, onShowFavorites, showFavorites }) => {
  return (
    <header className="mb-10 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl text-white shadow-xl">
                <Calculator size={28} className="drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
                ANALIZADOR PRO
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {isSaving ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                    <Cloud size={12} className="animate-pulse text-blue-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Sincronizado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 px-5 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all hover-lift">
            <Percent size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">IVA</label>
            <input 
              type="number" 
              value={ivaRate}
              onChange={(e) => setIvaRate(Number(e.target.value))}
              className="w-12 border-b-2 border-slate-200 text-center font-black outline-none focus:border-blue-500 text-slate-800 transition-colors bg-transparent"
            />
            <span className="text-slate-400 font-bold">%</span>
          </div>
          
          <button 
            onClick={onExportPDF}
            className="group flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl font-black text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95 hover-lift"
          >
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform text-blue-600" />
            <span>Exportar PDF</span>
          </button>

          <button 
            onClick={onShowFavorites}
            className={`group flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 hover-lift ${
              showFavorites 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200/50' 
                : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/50 hover:from-emerald-50 hover:to-emerald-100'
            }`}
          >
            <Star size={18} className={showFavorites ? 'fill-current' : 'text-emerald-600'} />
            <span>Guardados</span>
          </button>

          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all shadow-xl active:scale-95 hover-lift ${
              isChatOpen 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-blue-200/50'
            }`}
          >
            <Sparkles size={18} className={isChatOpen ? 'text-blue-600' : ''} />
            <span>{isChatOpen ? 'Cerrar IA' : 'Asistente IA'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
