import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const iconConfig = {
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    danger: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    info: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' }
  };

  const { icon: Icon, color, bg } = iconConfig[type];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 safe-area-inset"
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${bg} p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl flex items-start justify-between`}>
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <div className={`p-2 sm:p-3 ${bg} rounded-xl sm:rounded-2xl`}>
              <Icon size={24} className={`sm:w-7 sm:h-7 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 active:text-slate-600 active:bg-white/50 rounded-xl transition-all active:scale-90 touch-manipulation flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-100 text-slate-700 font-black rounded-xl sm:rounded-2xl active:bg-slate-200 transition-all active:scale-98 touch-manipulation text-sm sm:text-base"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-3.5 font-black rounded-xl sm:rounded-2xl transition-all active:scale-98 touch-manipulation text-sm sm:text-base ${
                type === 'danger'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white active:from-red-600 active:to-red-700 shadow-lg shadow-red-200/50'
                  : type === 'warning'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white active:from-amber-600 active:to-amber-700 shadow-lg shadow-amber-200/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white active:from-blue-700 active:to-indigo-800 shadow-lg shadow-blue-200/50'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
