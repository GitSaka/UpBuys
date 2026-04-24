// import { CATEGORIES } from '../admin/constants/category';


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../admin/constants/category';
import Navbar from '../components/layout/Navbar';
import {Footer }from '../components/layout/footer';

const HomeGeneral = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden italic-none text-gray-900">
      
      {/* 1. HEADER FIXE (Reste en haut au scroll) */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* 2. HEADER TEXTUEL CENTRÉ (L'Autorité) */}
      {/* --- 1. HEADER IMMERSIF (HOME) --- */}
<section className="relative w-full overflow-hidden group border-b border-gray-50">
  
  {/* IMAGE DE FOND (L'Âme de l'Artisanat) */}
  <div className="absolute inset-0 z-0">
    <img 
      src="./Ba.jpg" // 🎯 Une photo de mains au travail par exemple
      className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105" 
      alt="Artisanat Africain" 
    />
    {/* FILTRES DE LECTURE (SOUVERAIN) */}
    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-white/10"></div>
    <div className="absolute inset-0 backdrop-blur-[1px]"></div>
  </div>

  {/* 2. TES ÉCRITS (GARDÉS TEL QUEL - CENTRÉS) */}
  <div className="relative z-10 pt-44 pb-16 px-6 text-center max-w-4xl mx-auto">
    <div className="space-y-6">
      <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] text-gray-900">
        Centre de <br />
        <span className="text-purple-600">Formation Métier</span>
      </h1>
      
      <div className="h-[2px] w-12 bg-gray-200 mx-auto"></div>

      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">
         Apprentissage Pratique & Maîtrise Souveraine
      </p>

      {/* CHIFFRES CENTRÉS */}
      <div className="flex justify-center gap-12 pt-8">
        <div className="text-center">
          <p className="text-2xl font-black italic text-gray-900 leading-none">15k+</p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Artisans</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black italic text-gray-900 leading-none">45</p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Maîtres</p>
        </div>
      </div>

      {/* INDICATEUR SCROLL 👇 */}
      <div className="flex flex-col items-center pt-10 animate-bounce opacity-40">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 italic text-gray-500">Scrollez pour découvrir</span>
          <span className="text-2xl">👇</span>
      </div>
    </div>
  </div>
</section>

      {/* 3. GRILLE DE MÉTIERS (2 COLONNES MOBILE / 3 PC) */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/coach/category/${cat.id}`)}
              className="group bg-white rounded-[40px] p-4 md:p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              {/* IMAGE CARRÉE ÉLÉGANTE */}
              <div className="relative aspect-square rounded-[30px] overflow-hidden mb-4 md:mb-8 bg-gray-50">
                <img 
                  src={cat.image} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  alt={cat.title}
                />
                {/* Icône discrète en haut à droite */}
                <div className="absolute top-3 right-3 md:top-6 md:right-6 w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-sm md:text-xl shadow-sm">
                  {cat.icon}
                </div>
              </div>

              {/* TEXTE CENTRÉ SUR MOBILE AUSSI */}
              <div className="text-center space-y-2">
                <h3 className="text-xs md:text-xl font-black uppercase italic tracking-tighter group-hover:text-purple-600 transition-colors">
                  {cat.title}
                </h3>
                {/* On cache la bio sur mobile pour garder la grille propre */}
                <p className="hidden md:block text-[11px] text-gray-400 font-medium leading-relaxed italic">
                  Maîtrisez les secrets de {cat.title} avec nos experts.
                </p>
                
                <div className="pt-2 md:pt-6">
                  <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-gray-900 transition-colors">
                    Découvrir →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
       <div 
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="flex flex-col items-center py-16 cursor-pointer group"
>
  <span className="text-2xl group-hover:-translate-y-2 transition-transform duration-500">☝️</span>
  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 mt-2 group-hover:text-purple-600 transition-colors italic">
    Retour au sommet
  </span>
</div>
      <Footer />
    </div>
  );
};

export default HomeGeneral;