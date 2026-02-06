import React, { useState } from 'react';
import { Plus, Star, Menu } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { useChat } from './hooks/useChat';
import { useFavoriteProviders } from './hooks/useFavoriteProviders';
import { useUsuariosSistema } from './hooks/useUsuariosSistema';
import { Header } from './components/Header/Header';
import { ProductItem } from './components/ProductItem/ProductItem';
import { ChatSidebar } from './components/ChatSidebar/ChatSidebar';
import { FavoriteProviders } from './components/FavoriteProviders/FavoriteProviders';
import { UsuariosSistema } from './components/UsuariosSistema/UsuariosSistema';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Login } from './components/Login/Login';
import { handleExportPDF } from './utils/exportPDF';
import { handleExportExcel } from './utils/exportExcel';

const App = () => {
  const { user, isLoading: isLoadingAuth, logout, authError } = useAuth();
  const { items, setItems, ivaRate, setIvaRate, isSaving } = useFirestore(user);
  const {
    isChatOpen,
    setIsChatOpen,
    chatInput,
    setChatInput,
    messages,
    isTyping,
    chatEndRef,
    handleSendMessage
  } = useChat(items, ivaRate);
  const {
    favoriteProviders,
    isLoading: isLoadingFavorites,
    isSaving: isSavingFavorite,
    saveProvider,
    deleteProvider
  } = useFavoriteProviders(user);
  
  const {
    usuarios,
    isLoading: isLoadingUsuarios,
    isSaving: isSavingUsuarios,
    guardarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    enviarCorreoRecuperacion
  } = useUsuariosSistema(user);
  
  const [expandedItems, setExpandedItems] = useState([]);
  const [currentView, setCurrentView] = useState('analizador'); // 'analizador' o 'guardados'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Estados para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: null
  });

  // --- MANEJADORES DE DATOS ---
  const agregarItem = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setItems([...items, { 
      id, 
      nombre: '', 
      cantidad: 1, 
      proveedores: [{ id: 'p1', nombre: '', costo: 0, aplicaIva: true, margen: 20, link: '' }] 
    }]);
    setExpandedItems([...expandedItems, id]);
  };

  const agregarProveedor = (itemId) => {
    const newProviderId = Math.random().toString(36).substr(2, 9);
    setItems(items.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            proveedores: [...item.proveedores, { 
              id: newProviderId, 
              nombre: '', 
              costo: 0, 
              aplicaIva: true, 
              margen: 20,
              link: ''
            }] 
          }
        : item
    ));
  };

  const actualizarProveedor = (itemId, proveedorId, campo, valor) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? {
            ...item, 
            proveedores: item.proveedores.map(p => 
              p.id === proveedorId ? { ...p, [campo]: valor } : p
            )
          } 
        : item
    ));
  };

  const eliminarProveedor = (itemId, proveedorId) => {
    setItems(items.map(it => 
      it.id === itemId 
        ? {
            ...it, 
            proveedores: it.proveedores.filter(p => p.id !== proveedorId)
          } 
        : it
    ));
  };

  const handleSaveBestProvider = (bestProvider) => {
    if (!bestProvider) {
      setConfirmDialog({
        isOpen: true,
        type: 'warning',
        title: 'Proveedor no encontrado',
        message: 'No se encontró un proveedor para guardar. Por favor, verifica que hay proveedores con datos válidos.',
        confirmText: 'Entendido',
        cancelText: '',
        onConfirm: () => setConfirmDialog({ ...confirmDialog, isOpen: false })
      });
      return;
    }

    // Mostrar confirmación antes de guardar
    setConfirmDialog({
      isOpen: true,
      type: 'info',
      title: 'Guardar Proveedor Favorito',
      message: `¿Deseas guardar "${bestProvider.nombre || 'Proveedor'}" como proveedor favorito? Este proveedor aparecerá en tu lista de guardados.`,
      confirmText: 'Sí, Guardar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        console.log('Guardando mejor proveedor:', bestProvider);
        console.log('Usuario actual:', user);
        
        const success = await saveProvider(bestProvider);
        if (success) {
          setConfirmDialog({
            isOpen: true,
            type: 'info',
            title: '✅ Guardado Exitoso',
            message: 'El proveedor se ha guardado correctamente en tu lista de favoritos.',
            confirmText: 'Perfecto',
            cancelText: '',
            onConfirm: () => setConfirmDialog({ ...confirmDialog, isOpen: false })
          });
        } else {
          setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: '❌ Error al Guardar',
            message: 'No se pudo guardar el proveedor. Por favor, intenta nuevamente o revisa la consola para más detalles.',
            confirmText: 'Entendido',
            cancelText: '',
            onConfirm: () => setConfirmDialog({ ...confirmDialog, isOpen: false })
          });
        }
      }
    });
  };

  const handleDeleteFavorite = (providerId) => {
    // Buscar el proveedor para mostrar su nombre en la confirmación
    const provider = favoriteProviders.find(p => p.id === providerId);
    const providerName = provider?.nombre || 'este proveedor';
    
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      title: 'Eliminar Proveedor Favorito',
      message: `¿Estás seguro de que deseas eliminar "${providerName}" de tu lista de proveedores guardados? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        await deleteProvider(providerId);
      }
    });
  };

  const handleDeleteMultipleFavorites = async (providerIds) => {
    // Eliminar múltiples sin confirmación individual (ya se confirmó antes)
    for (const id of providerIds) {
      await deleteProvider(id);
    }
  };

  // Mostrar Login si no está autenticado
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-bold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => console.log('Login exitoso')} authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex text-slate-900 font-sans relative safe-area-inset">
      {/* SIDEBAR LATERAL */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Contenido Principal */}
      <div className={`flex-1 p-3 sm:p-4 md:p-8 pb-20 md:pb-8 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:pl-20' : 'md:pl-60'
      }`}>
        <div className="max-w-6xl mx-auto w-full">
          {/* Botón para abrir sidebar en móvil */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 z-30 p-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-700 shadow-lg active:scale-95 touch-manipulation"
          >
            <Menu size={24} />
          </button>

          <Header 
            ivaRate={ivaRate}
            setIvaRate={setIvaRate}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            isSaving={isSaving}
            onShowFavorites={() => setCurrentView('guardados')}
            showFavorites={currentView === 'guardados'}
            onLogout={logout}
          />

          {currentView === 'guardados' ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                    <Star size={24} className="text-white fill-current" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
                      Proveedores Guardados
                    </h2>
                    <p className="text-slate-500 text-sm font-bold">Proveedores que has marcado como los más convenientes</p>
                  </div>
                </div>
              </div>
              <FavoriteProviders 
                favoriteProviders={favoriteProviders}
                onDelete={handleDeleteFavorite}
                onDeleteMultiple={(providerIds) => {
                  setConfirmDialog({
                    isOpen: true,
                    type: 'danger',
                    title: 'Eliminar Múltiples Proveedores',
                    message: `¿Estás seguro de que deseas eliminar ${providerIds.length} proveedor(es) guardado(s)? Esta acción no se puede deshacer.`,
                    confirmText: 'Sí, Eliminar',
                    cancelText: 'Cancelar',
                    onConfirm: async () => {
                      setConfirmDialog({ ...confirmDialog, isOpen: false });
                      await handleDeleteMultipleFavorites(providerIds);
                    }
                  });
                }}
                isLoading={isLoadingFavorites}
              />
            </div>
          ) : currentView === 'usuarios-sistema' ? (
            <div className="animate-fade-in">
              <UsuariosSistema
                usuarios={usuarios}
                isLoading={isLoadingUsuarios}
                onSave={guardarUsuario}
                onUpdate={actualizarUsuario}
                onDelete={eliminarUsuario}
                onSendPasswordReset={enviarCorreoRecuperacion}
              />
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductItem
                      item={item}
                      ivaRate={ivaRate}
                      setIvaRate={setIvaRate}
                      expandedItems={expandedItems}
                      setExpandedItems={setExpandedItems}
                      setItems={setItems}
                      items={items}
                      actualizarProveedor={actualizarProveedor}
                      eliminarProveedor={eliminarProveedor}
                      agregarProveedor={agregarProveedor}
                      onSaveBestProvider={handleSaveBestProvider}
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={agregarItem}
                className="mt-6 sm:mt-10 w-full py-8 sm:py-12 border-4 border-dashed border-slate-300 rounded-2xl sm:rounded-[3rem] text-slate-400 active:text-blue-600 active:border-blue-400 active:bg-gradient-to-br active:from-white active:to-blue-50/50 transition-all flex flex-col items-center justify-center gap-4 sm:gap-5 group active:scale-98 relative overflow-hidden touch-manipulation"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full group-active:from-blue-50 group-active:to-indigo-50 transition-all shadow-inner group-active:shadow-lg">
                  <Plus size={28} className="sm:w-9 sm:h-9 group-active:scale-110 transition-transform" />
                </div>
                <span className="relative font-black uppercase text-sm sm:text-base tracking-[0.2em] sm:tracking-[0.3em] group-active:scale-105 transition-transform text-center px-4">
                  Nuevo Producto para Analizar
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* CHAT SIDEBAR */}
      <ChatSidebar
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatInput={chatInput}
        setChatInput={setChatInput}
        messages={messages}
        isTyping={isTyping}
        chatEndRef={chatEndRef}
        handleSendMessage={handleSendMessage}
      />

      {/* DIALOGO DE CONFIRMACIÓN */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
      />
    </div>
  );
};

export default App;
