import React from 'react';
import { Calculator, Cloud, Check, LogOut } from 'lucide-react';

export const Header = ({ ivaRate, setIvaRate, isChatOpen, setIsChatOpen, isSaving, onShowFavorites, showFavorites, onToggleSidebar, onLogout }) => {
  return (
    <header className="mb-6 sm:mb-10 animate-slide-in">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
              <div className="relative bg-blue-500 p-2 sm:p-3 rounded-lg text-white shadow-lg">
                <Calculator size={24} className="sm:w-7 sm:h-7" strokeWidth={2} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight truncate">
                ANALIZADOR PRO
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {isSaving ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 rounded-full">
                    <Cloud size={10} className="sm:w-3 sm:h-3 animate-pulse text-blue-600" strokeWidth={2} />
                    <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-blue-600">Guardando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-green-50 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-green-600">Sincronizado</span>
                  </div>
                )}
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="btn btn-ghost text-gray-500 hover:text-red-600"
                title="Cerrar sesión"
              >
                <LogOut size={20} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
        
      </div>
    </header>
  );
};




