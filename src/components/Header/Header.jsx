import React from 'react';
import { Calculator, Cloud, Check, Download, Sparkles, Star, Percent } from 'lucide-react';

export const Header = ({ ivaRate, setIvaRate, onExportPDF, isChatOpen, setIsChatOpen, isSaving, onShowFavorites, showFavorites }) => {
  return (
    <header className="mb-6 sm:mb-10 animate-slide-in">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white shadow-xl">
                <Calculator size={24} className="sm:w-7 sm:h-7 drop-shadow-lg" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight truncate">
                ANALIZADOR PRO
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {isSaving ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 rounded-full">
                    <Cloud size={10} className="sm:w-3 sm:h-3 animate-pulse text-blue-600" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-blue-600">Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-600">Sincronizado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="group flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm p-2 sm:p-3 px-3 sm:px-5 rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 active:shadow-xl transition-all active:scale-98 touch-manipulation">
            <Percent size={14} className="sm:w-4 sm:h-4 text-slate-400 group-active:text-blue-600 transition-colors flex-shrink-0" />
            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter hidden sm:inline">IVA</label>
            <input 
              type="number" 
              value={ivaRate}
              onChange={(e) => setIvaRate(Number(e.target.value))}
              className="w-10 sm:w-12 border-b-2 border-slate-200 text-center font-black outline-none focus:border-blue-500 text-slate-800 transition-colors bg-transparent text-sm sm:text-base"
            />
            <span className="text-slate-400 font-bold text-sm">%</span>
          </div>
          
          <button 
            onClick={onExportPDF}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl sm:rounded-2xl font-black text-slate-700 active:bg-gradient-to-r active:from-slate-50 active:to-blue-50 transition-all shadow-lg active:shadow-xl active:scale-95 touch-manipulation text-xs sm:text-sm"
          >
            <Download size={16} className="sm:w-[18px] sm:h-[18px] group-active:translate-y-0.5 transition-transform text-blue-600" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <button 
            onClick={onShowFavorites}
            className={`group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black transition-all shadow-lg active:scale-95 touch-manipulation text-xs sm:text-sm ${
              showFavorites 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200/50' 
                : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/50 active:from-emerald-50 active:to-emerald-100'
            }`}
          >
            <Star size={16} className={`sm:w-[18px] sm:h-[18px] ${showFavorites ? 'fill-current' : 'text-emerald-600'}`} />
            <span className="hidden sm:inline">Guardados</span>
            <span className="sm:hidden">⭐</span>
          </button>

          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black transition-all shadow-xl active:scale-95 touch-manipulation text-xs sm:text-sm ${
              isChatOpen 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white active:from-blue-700 active:to-indigo-800 shadow-blue-200/50'
            }`}
          >
            <Sparkles size={16} className={`sm:w-[18px] sm:h-[18px] ${isChatOpen ? 'text-blue-600' : ''}`} />
            <span className="hidden sm:inline">{isChatOpen ? 'Cerrar IA' : 'Asistente IA'}</span>
            <span className="sm:hidden">{isChatOpen ? 'Cerrar' : 'IA'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
