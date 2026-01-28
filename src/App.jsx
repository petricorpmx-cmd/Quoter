import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { useChat } from './hooks/useChat';
import { useFavoriteProviders } from './hooks/useFavoriteProviders';
import { Header } from './components/Header/Header';
import { ProductItem } from './components/ProductItem/ProductItem';
import { ChatSidebar } from './components/ChatSidebar/ChatSidebar';
import { FavoriteProviders } from './components/FavoriteProviders/FavoriteProviders';
import { handleExportPDF } from './utils/exportPDF';

const App = () => {
  const user = useAuth();
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
  
  const [expandedItems, setExpandedItems] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

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

  const handleSaveBestProvider = async (bestProvider) => {
    if (!bestProvider) {
      alert('⚠️ No se encontró un proveedor para guardar');
      return;
    }

    console.log('Guardando mejor proveedor:', bestProvider);
    console.log('Usuario actual:', user);
    
    const success = await saveProvider(bestProvider);
    if (success) {
      alert('✅ Proveedor guardado exitosamente');
    } else {
      alert('❌ Error al guardar el proveedor. Revisa la consola (F12) para más detalles.');
    }
  };

  const handleDeleteFavorite = async (providerId) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor guardado?')) {
      await deleteProvider(providerId);
    }
  };

  const handleDeleteMultipleFavorites = async (providerIds) => {
    // Eliminar múltiples sin confirmación individual (ya se confirmó antes)
    for (const id of providerIds) {
      await deleteProvider(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col md:flex-row text-slate-900 font-sans relative">
      {/* Contenido Principal */}
      <div className={`flex-1 p-4 md:p-8 transition-all duration-500 ${isChatOpen ? 'md:mr-[420px]' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <Header 
            ivaRate={ivaRate}
            setIvaRate={setIvaRate}
            onExportPDF={() => handleExportPDF(items, ivaRate)}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            isSaving={isSaving}
            onShowFavorites={() => setShowFavorites(!showFavorites)}
            showFavorites={showFavorites}
          />

          {showFavorites ? (
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
                onDeleteMultiple={handleDeleteMultipleFavorites}
                isLoading={isLoadingFavorites}
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
                className="mt-10 w-full py-12 border-4 border-dashed border-slate-300 rounded-[3rem] text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50 transition-all flex flex-col items-center justify-center gap-5 group hover-lift relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full group-hover:from-blue-50 group-hover:to-indigo-50 transition-all shadow-inner group-hover:shadow-lg">
                  <Plus size={36} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className="relative font-black uppercase text-base tracking-[0.3em] group-hover:scale-105 transition-transform">
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
    </div>
  );
};

export default App;
