// src/components/CourseCard.jsx
import React from 'react';

const CourseCard = ({ course, handleClick }) => {
  console.log(course)
  return (
    <div 
      onClick={() => handleClick(course)}
      className="group bg-white rounded-[35px] overflow-hidden border border-purple-50 shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 cursor-pointer"
    >
      {/* 1. IMAGE DE COUVERTURE */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* BADGES FLOTTANTS (GOSH) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Badge de Type : Métier vs Outil */}
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
            course.productType === 'Outil' 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/90 backdrop-blur-md text-purple-600'
          }`}>
            {course.productType === 'Outil' ? '📦 Outil Digital' : '🎓 Métier'}
          </span>

          {/* Badge Offert (Si gratuit) */}
          {course.isFree && (
            <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg italic animate-pulse">
              🎁 OFFERT
            </span>
          )}
        </div>

        {/* INDICATEUR DE RESSOURCE (DROITE) */}
        {/* On affiche le badge PDF si c'est un Outil ou si une leçon a un attachment */}
        {(course.productType === 'Outil' || course.hasResources) && (
          <div className="absolute top-4 right-4 bg-gray-900/40 backdrop-blur-sm p-2 rounded-xl">
             <span className="text-[10px]">📎</span>
          </div>
        )}
      </div>

      {/* 2. CONTENU DE LA CARTE */}
      <div className="p-7 text-left flex flex-col h-full">
        {/* Catégorie discrète en haut du titre */}
        <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1 italic">
          {course.category}
        </p>
        
        <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        {/* Indicateurs de Preuve Sociale */}
        <div className="flex items-center gap-3 mb-8">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
            🔥 {course.salesCount || 0}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-black text-purple-500 bg-purple-50 px-3 py-1 rounded-full">
            ❤️ {course.totalLikes || 0}
          </span>
          {/* Badge spécial pour les Outils */}
          {course.productType === 'Outil' && (
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">
              Download
            </span>
          )}
        </div>

        {/* Zone Prix et Appel à l'action */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-5">
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">
               {course.isFree ? "Accès Cadeau" : course.pricingType === 'Mensuel' ? "Abonnement Mensuel" : "Accès à vie"}
           </p>
            <div className="flex items-center gap-2">
              {course.isFree ? (
                <span className="text-2xl font-black text-green-600 italic">GRATUIT</span>
              ) : (
                <>
                  <span className="text-2xl font-black text-gray-900">
                    {course.price?.toLocaleString()} <small className="text-[10px] uppercase">{course.pricingType === 'Mensuel' ? 'CFA / Mois' : 'CFA'}</small>
                  </span>
                  {course.comparePrice && (
                    <span className="text-sm text-gray-300 line-through font-bold">{course.comparePrice.toLocaleString()}</span>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Bouton flèche stylisé */}
          <div className="bg-gray-900 text-white w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-purple-600 group-hover:rotate-45 transition-all duration-300">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;