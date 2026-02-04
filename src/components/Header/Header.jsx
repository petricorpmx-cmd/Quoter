import React from 'react';
import { Calculator, Cloud, Check } from 'lucide-react';

export const Header = ({ ivaRate, setIvaRate, isChatOpen, setIsChatOpen, isSaving, onShowFavorites, showFavorites, onToggleSidebar }) => {
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
        
      </div>
    </header>
  );
};
