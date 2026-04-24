// src/components/home/CoachShowcase.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoachShowcase = () => {
  const navigate = useNavigate();
  
  const coaches = [
    { id: 'saka-couture', name: 'Saka Couture', job: 'Maître Tailleur', bio: 'L\'art de la coupe parfaite.', img: 'https://images.unsplash.com' },
    { id: 'mariam-pastry', name: 'Chef Mariam', job: 'Pâtisserie', bio: 'Transformez vos desserts.', img: 'https://images.unsplash.com' },
    { id: 'awa-beauty', name: 'Awa Beauty', job: 'Esthétique', bio: 'Le temple de la beauté.', img: 'https://images.unsplash.com' },
    { id: 'ibrahim-deco', name: 'Ibro Déco', job: 'Décoration', bio: 'L\'élégance intérieure.', img: 'https://images.unsplash.com' },
    { id: 'fousseini-digital', name: 'Fousseini D.', job: 'Digital Art', bio: 'L\'empire numérique.', img: 'https://images.unsplash.com' },
  ];

  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6">
        
        {/* TITRE À GAUCHE */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 italic">
            Architectes du Savoir
          </h2>
          <span className="text-[8px] font-bold text-purple-300 uppercase italic lg:hidden">Glisse pour voir →</span>
        </div>

        {/* 🎯 LE CONTENEUR SCROLL X (LE SECRET) */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-6 px-6 snap-x snap-mandatory">
          {coaches.map((coach) => (
            <div 
              key={coach.id}
              onClick={() => navigate(`/${coach.id}/shop`)}
              className="flex-shrink-0 w-[240px] md:w-[280px] group bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer text-center snap-center relative"
            >
              {/* IMAGE CENTRÉE (70px) */}
              <div className="relative mx-auto w-[70px] h-[70px] mb-6">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={coach.img} 
                  className="relative z-10 w-full h-full rounded-full object-cover border-2 border-white shadow-lg grayscale group-hover:grayscale-0 transition-all duration-700" 
                  alt={coach.name} 
                />
              </div>

              {/* TEXTE DENSE */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase italic tracking-tighter text-gray-900 group-hover:text-purple-600">
                  {coach.name}
                </h4>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic leading-none">
                  {coach.job}
                </p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic line-clamp-2 px-2">
                  {coach.bio}
                </p>
              </div>

              {/* PETIT BADGE LUXE AU SURVOL */}
              <div className="mt-4 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-black uppercase tracking-widest text-purple-500">
                  Visiter l'Empire 🔒
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoachShowcase;