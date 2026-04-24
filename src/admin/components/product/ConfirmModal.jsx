// src/admin/components/UniversalModal.jsx
import React from 'react';

const ConfirmModal = ({ isOpen,loadingr, mode, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  // Configuration des styles selon le mode
  const configs = {
    delete: { icon: "🗑️", color: "red", btnText: "Supprimer" },
    success: { icon: "✅", color: "green", btnText: "Génial !" },
    info: { icon: "✨", color: "purple", btnText: "Confirmer" },
    warning: { icon: "⚠️", color: "orange", btnText: "Continuer" }
  };

  const config = configs[mode] || configs.info;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl text-center">
        
        {/* Cercle Icone Dynamique */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center text-3xl bg-${config.color}-50 text-${config.color}-600`}>
          {config.icon}
        </div>

        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{message}</p>

        <div className="flex flex-col gap-3">                     
          <button 
            disabled={loadingr}
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 bg-${config.color}-600 shadow-${config.color}-100
             ${
                loadingr
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white shadow-2xl active:scale-95'
              }`}
          >
            {loadingr ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Construction de ton Empire...</span>
              </div>
            ) : config.btnText}
            
          </button>
            
             
          
          {/* On n'affiche le bouton Annuler que si ce n'est pas un message de pur succès */}
          {mode !== 'success' && (
            <button onClick={onCancel} className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all">
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;