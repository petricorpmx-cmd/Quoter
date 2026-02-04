import React from 'react';
import { Bot, ChevronDown, Send, Loader2, ExternalLink, X } from 'lucide-react';

export const ChatSidebar = ({
  isChatOpen,
  setIsChatOpen,
  chatInput,
  setChatInput,
  messages,
  isTyping,
  chatEndRef,
  handleSendMessage
}) => {
  return (
    <>
      {/* Botón Flotante - Esquina Inferior Derecha */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 sm:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all active:scale-95 hover:scale-110 touch-manipulation safe-area-inset-bottom safe-area-inset-right group"
        >
          <Bot size={28} className="sm:w-8 sm:h-8 group-active:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Overlay */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Chat Sidebar/Modal */}
      <aside className={`fixed top-0 right-0 h-full w-full md:w-[420px] md:h-[600px] md:top-auto md:bottom-6 md:right-6 md:rounded-3xl bg-white/95 backdrop-blur-md shadow-[-30px_0_60px_rgba(0,0,0,0.12)] md:shadow-2xl flex flex-col transition-all duration-500 ease-in-out z-50 safe-area-inset-right ${
        isChatOpen ? 'translate-x-0 translate-y-0' : 'translate-x-full md:translate-x-0 md:translate-y-full md:opacity-0 md:pointer-events-none'
      }`}>
      <div className="p-4 sm:p-6 border-b-2 border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/80 to-blue-50/50 backdrop-blur-sm safe-area-inset-top">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white shadow-xl">
              <Bot size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-black text-slate-900 leading-none mb-1 text-lg sm:text-xl truncate">Consultor IA</h2>
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <span className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                <span className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">Listo para comparar</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsChatOpen(false)} 
          className="p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl text-slate-400 active:text-slate-800 active:bg-white shadow-sm transition-all active:scale-90 touch-manipulation flex-shrink-0"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-slate-50/30 to-white safe-area-inset-bottom">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`max-w-[85%] sm:max-w-[85%] p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none' 
                : 'bg-white/90 backdrop-blur-sm text-slate-700 border-2 border-slate-100 rounded-tl-none'
            }`}>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-wrap break-words">
                {String(msg.text)}
              </p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-2">
                  {msg.sources.map((src, idx) => (
                    <a 
                      key={idx} 
                      href={String(src.uri)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[9px] font-black bg-white/20 text-white p-2 px-4 rounded-full hover:bg-white/30 transition-all flex items-center gap-2 uppercase tracking-tight"
                    >
                      <ExternalLink size={10} /> {String(src.title || 'Referencia')}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-3xl border-2 border-slate-100 rounded-tl-none flex items-center gap-4 shadow-lg">
              <Loader2 size={20} className="animate-spin text-blue-600" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Escaneando precios...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-t-2 border-slate-100 safe-area-inset-bottom">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="¿Cómo puedo ahorrar más hoy?"
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isTyping}
            className="w-full bg-gradient-to-r from-slate-100 to-slate-50 p-4 sm:p-5 pr-14 sm:pr-16 rounded-xl sm:rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/20 focus:bg-white border-2 border-transparent focus:border-blue-500 outline-none transition-all disabled:opacity-50 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={isTyping || !chatInput.trim()}
            className="absolute right-2 top-2 p-3 sm:p-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl sm:rounded-2xl active:from-blue-700 active:to-indigo-800 disabled:bg-slate-200 transition-all shadow-xl shadow-blue-200/50 active:scale-90 touch-manipulation"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <p className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] text-center mt-3 sm:mt-4">
          Datos guardados en tiempo real • IA v2.5
        </p>
      </form>
    </aside>
    </>
  );
};
