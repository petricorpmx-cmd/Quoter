import React, { useState, useEffect } from 'react';
import { Calculator, Star, Settings, Users, Truck, ShoppingCart, ChevronLeft, Menu, X } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const Sidebar = ({ isOpen, onClose, currentView, onViewChange, isCollapsed, setIsCollapsed }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isExpanded = !isCollapsed || isMobile;

  // Estado para controlar qué submenú está abierto (solo uno a la vez - acordeón)
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuItems = [
    {
      id: 'analizador',
      label: 'Analizador Pro',
      icon: Calculator,
      submenu: [
        {
          id: 'analizador',
          label: 'Analizador',
          icon: Calculator,
          parent: 'analizador'
        },
        {
          id: 'guardados',
          label: 'Guardados',
          icon: Star,
          parent: 'analizador'
        }
      ]
    },
    {
      id: 'compras',
      label: 'Compras',
      icon: ShoppingCart,
      submenu: [
        {
          id: 'proveedores',
          label: 'Proveedores',
          icon: Truck,
          parent: 'compras'
        }
      ]
    },
    {
      id: 'administracion',
      label: 'Administración de Sistema',
      icon: Settings,
      submenu: [
        {
          id: 'usuarios-sistema',
          label: 'Usuarios del sistema',
          icon: Users,
          parent: 'administracion'
        }
      ]
    }
  ];

  // Efecto para agregar clases al body
  useEffect(() => {
    const body = document.body;
    
    if (isOpen || !isCollapsed) {
      body.classList.add('with-react-nav');
    } else {
      body.classList.remove('with-react-nav');
    }
    
    if (!isCollapsed) {
      body.classList.add('nav-expanded');
    } else {
      body.classList.remove('nav-expanded');
    }

    return () => {
      body.classList.remove('with-react-nav', 'nav-expanded');
    };
  }, [isOpen, isCollapsed]);

  // Disparar evento section:changed al navegar
  const handleViewChange = (viewId) => {
    onViewChange(viewId);
    onClose();
    
    // Disparar evento personalizado
    const event = new CustomEvent('section:changed', {
      detail: { section: viewId }
    });
    window.dispatchEvent(event);
  };

  // Toggle submenú (solo uno abierto a la vez)
  const toggleSubmenu = (itemId) => {
    setOpenSubmenu(prev => prev === itemId ? null : itemId);
  };

  // Verificar si un item está activo
  const isItemActive = (itemId) => {
    return currentView === itemId;
  };

  // Verificar si algún subitem está activo
  const hasActiveSubitem = (item) => {
    return item.submenu?.some((sub) => sub.id === currentView);
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
        fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200
        flex flex-col transition-all duration-300 ease-in-out z-50
        safe-area-inset-left safe-area-inset-top safe-area-inset-bottom
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-[min(300px,85vw)] ${isCollapsed ? 'md:w-16' : 'md:w-56'}
      `}>
        {/* Header del Sidebar */}
        <div className={`border-b border-gray-200 bg-gray-50 flex-shrink-0 ${isExpanded ? 'p-4 flex flex-row items-center justify-between' : 'p-3 flex flex-col items-center gap-3'}`}>
          {/* Logo */}
          {isExpanded && (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 bg-blue-500 p-2 rounded-md">
                <Calculator size={20} strokeWidth={2} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-gray-900 leading-none text-sm truncate">
                  Analizador Pro
                </h2>
              </div>
            </div>
          )}
          {!isExpanded && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="bg-blue-500 p-2 rounded-md">
                <Calculator size={20} strokeWidth={2} className="text-white" />
              </div>
              {/* Botón Hamburger debajo del logo cuando está contraído */}
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex items-center justify-center w-7 h-7 rounded border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
                title="Expandir menú"
              >
                <Menu size={14} strokeWidth={2} />
              </button>
            </div>
          )}
          
          {/* Botón Pin/Hamburger (solo desktop expandido) / Cerrar (móvil) */}
          {isExpanded && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex items-center justify-center w-9 h-9 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:w-7 md:h-7 rounded border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                title="Contraer menú"
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
              <button 
                onClick={onClose} 
                className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:scale-95"
                aria-label="Cerrar menú"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* Menú Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-visible p-3 sm:p-2 -webkit-overflow-scrolling-touch overscroll-contain">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id) || hasActiveSubitem(item);
            const isSubmenuOpen = openSubmenu === item.id;
            
            return (
              <div key={item.id} className="mb-1">
                {/* Item Principal */}
                <div className="relative group">
                  <div className="flex items-center w-full">
                    <button
                      onClick={() => {
                        if (item.submenu && item.submenu.length > 0) {
                          if (isExpanded) {
                            toggleSubmenu(item.id);
                            if (item.id === 'analizador') handleViewChange('analizador');
                            if (item.id === 'compras') handleViewChange('proveedores');
                          } else {
                            setIsCollapsed(false);
                            setOpenSubmenu(item.id);
                            if (item.id === 'analizador') handleViewChange('analizador');
                            if (item.id === 'compras') handleViewChange('proveedores');
                          }
                        } else {
                          handleViewChange(item.id);
                          if (!isExpanded) setIsCollapsed(false);
                        }
                      }}
                      className={`
                        menu-item flex-1 flex items-center gap-3 rounded-lg transition-all duration-200
                        min-h-[44px] py-2.5
                        ${!isExpanded ? 'justify-center px-2' : 'justify-start px-3'}
                        ${isActive 
                          ? 'bg-blue-100 text-blue-900 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 active:bg-gray-200'
                        }
                      `}
                      title={!isExpanded ? item.label : ''}
                    >
                      {/* Indicador de activo */}
                      {isActive && isExpanded && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-md"></div>
                      )}
                      <Icon 
                        size={20}
                        strokeWidth={2}
                        className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
                      />
                      {isExpanded && (
                        <span className="text-sm sm:text-base flex-1 text-left font-medium">{item.label}</span>
                      )}
                    </button>
                    
                    {/* Indicador de submenú (solo en expandido) */}
                    {isExpanded && item.submenu && item.submenu.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu(item.id);
                        }}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center px-2 py-2 transition-colors duration-200 rounded-lg active:scale-95 ${
                          isActive ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title={isSubmenuOpen ? 'Colapsar submenú' : 'Expandir submenú'}
                      >
                        <span className="text-base font-bold">
                          {isSubmenuOpen ? '▾' : '▸'}
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {/* Tooltip cuando está colapsado (solo desktop) */}
                  {!isExpanded && (
                    <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100] pointer-events-none">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[200px] pointer-events-auto">
                        {/* Título principal */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <span className="text-sm font-semibold text-gray-900">{item.label}</span>
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
                                    handleViewChange(subItem.id);
                                  }}
                                  className={`
                                    w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                    ${isSubActive 
                                      ? 'text-blue-600 font-medium bg-blue-50' 
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
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

                {/* Submenú (acordeón - solo uno abierto a la vez) */}
                {isExpanded && item.submenu && isSubmenuOpen && (
                  <div className="mt-1 ml-2 sm:ml-4 space-y-0.5 border-l-2 border-gray-200 pl-2">
                    {item.submenu.map((subItem) => {
                      const isSubActive = currentView === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleViewChange(subItem.id)}
                          className={`
                            menu-item w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg transition-all duration-200 text-sm sm:text-base
                            ${isSubActive 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600 active:bg-gray-200'
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
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 safe-area-inset-bottom">
            <div className="text-xs text-gray-500 text-center">
              <p className="mb-1">Versión 1.0.0</p>
              <p className="opacity-75">© 2024 Analizador Pro</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
