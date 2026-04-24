// import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../admin/constants/category';
import Navbar from '../components/layout/Navbar';
import {Footer }from '../components/layout/Footer';
import { useEffect, useState } from 'react';

import api from '../services/api';

const CategoryView = () => {
  const { category } = useParams(); 
  const navigate = useNavigate();
  const currentCat = CATEGORIES.find(c => c.id === category);
  const [coaches, setCoaches] = useState([]);
   const [loading, setLoading] = useState(false);
  // 🧪 FAUSSES DONNÉES (À remplacer par ton fetch MongoDB)
  // const FAKE_COACHES = [
  //   { 
  //       id: 'saka-5684', 
  //       name: 'Saka Couture', 
  //       job: 'Maître Tailleur', 
  //       bio: 'L\'art de la coupe impériale et des finitions de luxe.', 
  //       img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
  //       banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  //   },
  //   { 
  //       id: 'aicha-1234', 
  //       name: 'Maman Aïcha', 
  //       job: 'Haute Couture', 
  //       bio: 'La tradition africaine au service du futur numérique.', 
  //       img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
  //       banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  //   },
  //   { 
  //       id: 'aicha-1234', 
  //       name: 'Maman Aïcha', 
  //       job: 'Haute Couture', 
  //       bio: 'La tradition africaine au service du futur numérique.', 
  //       img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
  //       banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  //   },
  //   { 
  //       id: 'aicha-1234', 
  //       name: 'Maman Aïcha', 
  //       job: 'Haute Couture', 
  //       bio: 'La tradition africaine au service du futur numérique.', 
  //       img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
  //       banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  //   },
  //   { 
  //       id: 'aicha-1234', 
  //       name: 'Maman Aïcha', 
  //       job: 'Haute Couture', 
  //       bio: 'La tradition africaine au service du futur numérique.', 
  //       img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
  //       banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  //   },
  //   { 
  //       id: 'aicha-1234', 
  //       name: 'Maman Aïcha', 
  //       job: 'Haute Couture', 
  //       bio: 'La tradition africaine au service du futur numérique.', 
  //       img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
  //       banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  //   },
  // ];

  useEffect(() => {
  // 🚀 REMONTER AU SOMMET DÈS L'ARRIVÉE
  window.scrollTo(0, 0);
}, [category]); // Se déclenche à chaque changement de métier

useEffect(() => {
    const fetchCoaches = async () => {
      setLoading(true)
      try {
        const response = await api.get(
          `/client/category/${category}`
        );

        setCoaches(response.data);

      } catch (error) {
        console.error("Erreur récupération:", error);
      }finally{
         setLoading(false)
      }
    };

    fetchCoaches();
  }, [category]);

    if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-black text-gray-300 animate-pulse uppercase tracking-[0.3em]">
      Ouverture de l'Empire...
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans italic-none text-gray-900 overflow-x-hidden">
      
      {/* 1. NAVBAR FIXE */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      
{/* --- 1. HEADER VISUEL COMPACT (GLASSMORPHISM LÉGER) --- */}
      <div className="relative h-[250px] md:h-[320px] w-full overflow-hidden group border-b border-gray-50">
        {/* IMAGE DE FOND (Ajustée en hauteur) */}
        <img 
            src={currentCat?.image || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"} 
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105" 
            alt={currentCat?.title} 
        />
        
        {/* FILTRE DE GRADIENT & FLOU SUBTIL (Plus léger) */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-black/10"></div>
        <div className="absolute inset-0 backdrop-blur-[1px] md:backdrop-blur-[2px]"></div>

        {/* TITRE SUPERPOSÉ (CENTRÉ) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 mt-12">
            <span className="text-4xl md:text-5xl mb-2 drop-shadow-2xl">
            {currentCat?.icon}
            </span>
            <h1 className="text-3xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-gray-900 drop-shadow-sm text-center">
            Les Maîtres <span className="text-purple-600 group-hover:animate-pulse">COUTURE</span><br /> 
            <span className="text-purple-600 underline decoration-gray-200 underline-offset-[8px]">
                {currentCat?.title || category}
            </span>
            </h1>
        </div>
      </div>

{/* --- 2. PHRASE D'ACCROCHE (JUSTE EN BAS DU VISUEL) --- */}
        <section className="py-10 px-6 text-center max-w-3xl mx-auto">
        <div className="space-y-3">
            <span className="text-purple-600 group-hover:animate-pulse">LA COUTURE</span>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-relaxed">
            "L'excellence n'est pas un acte, c'est une habitude. <br />
            Choisissez votre mentor et commencez votre ascension aujourd'hui."
            </p>
            <div className="h-[2px] w-10 bg-purple-100 mx-auto rounded-full"></div>
        </div>
        </section>

      {/* 3. GRILLE DES MAÎTRES (STYLE BANNIÈRE FLOU) */}
      <section className="py-12 px-4 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">

          {coaches.length > 0 ? (
              coaches.map((coach) => (
            
           
            <div 
            key={coach.slug}
            onClick={() => navigate(`/empire/${coach.slug}/shop`)}
            className="group relative h-[420px] md:h-[520px] rounded-[50px] overflow-hidden bg-gray-900 shadow-xl transition-all duration-700 md:hover:scale-[1.02] cursor-pointer"
          >
         {/* IMAGE DE FOND */}
          <img 
            src={coach.banner} 
            className="absolute inset-0 w-full h-full object-contain opacity-50 md:opacity-60 md:group-hover:scale-110 transition-transform duration-1000"
            alt="Background"
          />

      {/* FILTRE GLASSMORPHISM (Plus léger sur mobile) */}
      <div className="absolute inset-0 bg-black/20 md:bg-white/5 backdrop-blur-[2px] md:backdrop-blur-md md:group-hover:backdrop-blur-none transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-100 md:opacity-90" />

      {/* CONTENU */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-5">
    
    {/* AVATAR TOUJOURS VISIBLE */}
    <div className="w-[65px] h-[65px] md:w-[75px] md:h-[75px] rounded-[24px] md:rounded-[28px] p-1 bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl transition-transform duration-500 md:group-hover:rotate-6">
      <img 
        src={coach.avatar} 
        className="w-full h-full rounded-[20px] md:rounded-[24px] object-cover grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-700"
        alt={coach.userName}
      />
    </div>

    <div className="space-y-1">
      <h4 className="text-white text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-none">
        {coach.userName}
      </h4>
      <p className="text-purple-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] italic">
        {category}
      </p>
    </div>

    {/* BIO : Visible sur Mobile, Animée sur PC */}
    <p className="text-[10px] md:text-[11px] text-gray-300 font-medium leading-relaxed italic line-clamp-2 px-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:translate-y-4 md:group-hover:translate-y-0">
      {coach.bio}
    </p>
    {/* PETIT BADGE SHOP */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="bg-purple-600 text-white text-[7px] font-black uppercase tracking-widest px-4 py-2 rounded-full">Shop →</span>
              </div>

    {/* BOUTON : Fixe sur Mobile, Glissant sur PC */}
    <button 
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/profile/coach/${coach?.slug}`);
      }}
      className="px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-white text-gray-900 text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-8 md:group-hover:translate-y-0"
    >
      Voir l'Histoire
    </button>
  </div>
          </div>
          ))
            ) : (
              <div className="col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center min-h-[60vh]">
                <div className="text-center px-6">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-800">
                    Aucun coach trouvé
                  </h2>
                  <p className="mt-4 text-gray-500">
                    Aucun empire dans la catégorie
                    <span className="text-purple-600 font-bold"> "{category}"</span>.
                  </p>
                </div>
               </div>
)}
        </div>
      </section>

      {/* --- INDICATEURS DE SCROLL --- */}
      <div className="flex flex-col items-center py-20 animate-bounce opacity-20 hover:opacity-100 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
         <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-gray-400">Retour au sommet</span>
         <span className="text-3xl">☝️</span>
      </div>

    </div>
  );
};

export default CategoryView;