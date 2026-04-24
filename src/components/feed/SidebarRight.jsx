// src/components/feed/SidebarRight.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SidebarRight = ({ coach, onFilterChange, activeFilter }) => {
  return (
    <div className="bg-white rounded-[40px] p-8 border border-purple-50 shadow-xl shadow-purple-100/10 space-y-10 animate-fadeIn text-left">
      
      {/* IDENTITÉ DE L'INFLUENCEUSE (LA REINE) */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          {/* Cercle d'aura violette */}
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-10 mx-auto ring-1 ring-purple-100">
            <Link to={`/profile/coach/${coach?.slug}`}>
             <img 
              src={coach?.avatar} // À lier dynamiquement à coach.photo plus tard
              className="w-full h-full object-cover" 
              alt="Coach" 
            />
            </Link>
            
           
          </div>
          {/* Badge Online */}
          <span className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white z-20 shadow-lg" />
        </div>
        
        <div>
          <h3 className="font-black italic uppercase text-lg tracking-tighter text-gray-900 leading-none">
            {coach?.storeName || "L'Influenceuse"}
          </h3>
          <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] mt-2 italic">Fondatrice de l'Empire</p>
        </div>
      </div>

      {/* FILTRES DE PUISSANCE */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-gray-300 ml-2 tracking-widest italic underline underline-offset-8 decoration-purple-100">
           Trier le Cercle
        </p>
        
        <div className="space-y-2">
          <button 
            onClick={() => onFilterChange?.('all')}
            className={`w-full flex items-center justify-between p-4 rounded-[22px] transition-all group ${activeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-purple-50'}`}
          >
            <span className="text-[10px] font-black uppercase italic">✨ Tout le monde</span>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeFilter === 'all' ? 'bg-white/20' : 'bg-white border'}`}>124</span>
          </button>

          <button 
            onClick={() => onFilterChange?.('coach')}
            className={`w-full flex items-center justify-between p-4 rounded-[22px] transition-all border ${activeFilter === 'coach' ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-200' : 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'}`}
          >
            <span className="text-[10px] font-black uppercase italic">👑 Posts de la Coach</span>
            <span className="text-xl">🌟</span>
          </button>

          <button 
            onClick={() => onFilterChange?.('mine')}
            className={`w-full flex items-center justify-between p-4 rounded-[22px] transition-all group ${activeFilter === 'mine' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            <span className="text-[10px] font-black uppercase italic">👤 Mes réussites</span>
            <span className="opacity-40 group-hover:opacity-100 transition-opacity">👁️</span>
          </button>
        </div>
      </div>

      {/* STATISTIQUES DE L'EMPIRE */}
      <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-50">
        <div className="text-center">
          <p className="text-2xl font-black italic text-gray-900 leading-none tracking-tighter">450</p>
          <p className="text-[8px] font-black text-gray-400 uppercase mt-2 tracking-widest">Membres</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="text-2xl font-black italic text-purple-600 leading-none tracking-tighter">89</p>
          <p className="text-[8px] font-black text-gray-400 uppercase mt-2 tracking-widest">Réussites</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;