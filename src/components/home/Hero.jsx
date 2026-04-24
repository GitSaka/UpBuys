// src/components/home/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden bg-gray-900">
      {/* BACKGROUND IMMERSIF (Machine à coudre / Mains d'artisan) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/40 to-gray-900/90 z-10" />
        <img 
          src="https://picsum.photos/800/600" 
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" 
          alt="Artisanat de Luxe"
        />
      </div>

      {/* CONTENU TEXTUEL */}
      <div className="relative z-20 text-center max-w-[1500px]">
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-purple-400 mb-8 block animate-pulse">
          L'Excellence Africaine en Mouvement
        </span>
        
        <h1 className="text-7xl md:text-[160px] font-black tracking-[-0.05em] uppercase italic leading-[0.75] text-white mb-12">
          BÂTISSEZ <br />
          VOTRE <span className="text-purple-500">EMPIRE</span>
        </h1>

        <p className="text-gray-400 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed italic">
          La plateforme où les maîtres artisans transforment leur savoir-faire en héritage numérique souverain.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => navigate('/creators/register')}
            className="w-full md:w-auto bg-white text-gray-900 px-12 py-6 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-purple-500 hover:text-white transition-all active:scale-95"
          >
            Rejoindre le Cercle ✨
          </button>
          <button className="text-white text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-white/20 pb-2 hover:border-purple-500 transition-all italic">
            Découvrir les Maîtres
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;