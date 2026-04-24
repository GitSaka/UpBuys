// src/components/layout/AuthGuard.jsx
import React from 'react';

const AuthGuard = ({ message, onConnect, onCancel }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-[35px] p-8 shadow-2xl border border-purple-50 animate-slideUp">
        <div className="text-center space-y-6">
          {/* ICONE LUXE */}
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            🔐
          </div>

          <div className="space-y-2">
            <h3 className="font-black italic uppercase text-lg tracking-tighter text-gray-900">
              Accès au Cercle Privé
            </h3>
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed px-4">
              {message}
            </p>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={onConnect}
              className="w-full py-4 bg-gray-900 text-white rounded-[20px] text-[10px] font-black uppercase italic tracking-widest hover:bg-purple-600 transition-all shadow-xl active:scale-95"
            >
              S'identifier via WhatsApp 🚀
            </button>
            
            <button 
              onClick={onCancel}
              className="w-full py-3 text-[9px] font-black uppercase text-gray-300 hover:text-gray-500 transition-colors italic"
            >
              Continuer la lecture en invité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;