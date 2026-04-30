import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundEmpire = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center italic-none">
      {/* Élément visuel d'impact */}
      <div className="relative mb-10">
        <span className="text-[120px] font-black text-gray-50 leading-none select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-bounce">🏰</span>
        </div>
      </div>

      {/* Texte style Empire */}
      <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4 uppercase italic">
        Porte de l'Empire <span className="text-purple-600">Introuvable</span>
      </h1>
      
      <p className="text-gray-400 font-bold text-sm md:text-base mb-12 max-w-md uppercase tracking-widest leading-relaxed">
        Le trésor ou le coach que vous cherchez a peut-être changé de domaine ou n'existe plus dans nos registres.
      </p>

      {/* Bouton d'action */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="flex-1 bg-gray-100 text-gray-900 py-6 rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95"
        >
          ← Retourner
        </button>
        
        <button 
          onClick={() => navigate('/')} 
          className="flex-1 bg-gray-900 text-white py-6 rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-purple-600 transition-all active:scale-95"
        >
          Accueil Boutique
        </button>
      </div>

      <p className="mt-16 text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">
        Sécurisé par l'Empire WhatBuys
      </p>
    </div>
  );
};

export default NotFoundEmpire;
