import React, { useState } from 'react';
import { Calculator, Star, X, ChevronLeft, ChevronRight, ChevronDown, Settings, Users } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, currentView, onViewChange, isCollapsed, setIsCollapsed }) => {
  // Estado para controlar qué submenús están abiertos
  const [openSubmenus, setOpenSubmenus] = useState({
    analizador: true,
    administracion: false
  });
  
  const menuItems = [
    {
      id: 'analizador',
      label: 'Analizador Pro',
      icon: Calculator,
      isMain: true,
      submenu: [
        {
          id: 'guardados',
          label: 'Guardados',
          icon: Star
        }
      ]
    },
    {
      id: 'administracion',
      label: 'Administración de Sistema',
      icon: Settings,
      isMain: false,
      submenu: [
        {
          id: 'usuarios-sistema',
          label: 'Usuarios del sistema',
          icon: Users
        }
      ]
    }
  ];

  const toggleSubmenu = (itemId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200
        flex flex-col transition-all duration-300 ease-in-out z-50 safe-area-inset-left
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'}
      `}>
        {/* Header del Sidebar */}
        <div className={`border-b border-slate-200 flex flex-col bg-white relative ${isCollapsed ? 'p-3' : 'p-4 sm:p-5'}`}>
          {/* Logo y Título */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 min-w-0 flex-1 mb-4">
              <div className="flex-shrink-0 bg-blue-600 p-2 rounded-lg">
                <Calculator size={20} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-slate-900 leading-none text-base truncate">
                  Analizador Pro
                </h2>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-full mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator size={20} className="text-white" />
              </div>
            </div>
          )}
          
          {/* Botón de Colapsar */}
          <div className="flex items-center justify-center">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded border border-slate-300 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
              title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {isCollapsed ? (
                <ChevronRight size={12} strokeWidth={2} />
              ) : (
                <ChevronLeft size={12} strokeWidth={2} />
              )}
            </button>
            {/* Botón para cerrar en móvil */}
            <button 
              onClick={onClose} 
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Menú Items */}
        <nav className={`flex-1 overflow-y-auto overflow-x-visible ${isCollapsed ? 'p-2' : 'p-2'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentView));
            const isItemActive = currentView === item.id;
            const isSubmenuOpen = openSubmenus[item.id] || false;
            
            return (
              <div key={item.id} className="space-y-0.5">
                {/* Item Principal */}
                <div className="relative group">
                  <div className="flex items-center w-full">
                    <button
                      onClick={() => {
                        // Siempre cambiar a la vista del item principal
                        onViewChange(item.id);
                        onClose();
                        // Si está colapsado, expandir el sidebar
                        if (isCollapsed) {
                          setIsCollapsed(false);
                          setOpenSubmenus(prev => ({ ...prev, [item.id]: true }));
                        }
                      }}
                    className={`menu-item ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'} ${isItemActive ? 'active' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {/* Borde izquierdo azul cuando está activo */}
                    {isItemActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                    )}
                      <Icon 
                        size={18} 
                        className={`flex-shrink-0 ${isItemActive ? 'text-white' : 'text-slate-600'}`}
                      />
                      {!isCollapsed && (
                        <span className="text-left flex-1 uppercase tracking-wide">{item.label}</span>
                      )}
                    </button>
                    {/* Botón separado para expandir/colapsar submenú */}
                    {!isCollapsed && item.submenu && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu(item.id);
                        }}
                        className={`px-2 py-3 transition-colors ${isItemActive ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        title={isSubmenuOpen ? 'Colapsar submenú' : 'Expandir submenú'}
                      >
                        <ChevronDown 
                          size={12} 
                          className={`transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''} ${isItemActive ? 'text-white' : 'text-slate-400'}`}
                          strokeWidth={2.5}
                        />
                      </button>
                    )}
                  </div>
                  {/* Tooltip cuando está colapsado - Diseño profesional */}
                  {isCollapsed && (
                    <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100]">
                      {/* Contenedor blanco con el texto principal y subitems */}
                      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden min-w-[220px] pointer-events-auto">
                        {/* Título principal */}
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                          <span className="text-sm font-semibold text-slate-900 uppercase tracking-wide">{item.label}</span>
                        </div>
                        {/* Subitems */}
                        {item.submenu && item.submenu.length > 0 && (
                          <div className="py-1">
                            {item.submenu.map((subItem) => {
                              const isSubActive = currentView === subItem.id;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewChange(subItem.id);
                                    onClose();
                                  }}
                                  className={`
                                    w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                    ${isSubActive 
                                      ? 'text-blue-600 font-medium bg-blue-50' 
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                                    }
                                  `}
                                >
                                  {subItem.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submenú */}
                {!isCollapsed && item.submenu && isSubmenuOpen && (
                  <div className="space-y-0.5">
                    {item.submenu.map((subItem) => {
                      const isSubActive = currentView === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            onViewChange(subItem.id);
                            onClose();
                          }}
                          className={`menu-item pl-12 ${isSubActive ? 'active' : ''}`}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="text-xs text-slate-500 text-center">
              <p className="mb-1">Versión 1.0.0</p>
              <p className="opacity-75">© 2024 Analizador Pro</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
