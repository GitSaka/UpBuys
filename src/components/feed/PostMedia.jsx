// src/components/feed/PostMedia.jsx
import React from 'react';
import ReactPlayer from 'react-player';

const PostMedia = ({ url}) => {
  if (!url) return null;

  // Détection simple : si l'URL contient "video", on active le lecteur
  const isVideo = url.includes('/video/upload/') || url.endsWith('.mp4');

  return (
    <div className="rounded-[30px] overflow-hidden border border-gray-100 mb-5 bg-gray-50 shadow-inner group relative aspect-auto">
      {isVideo ? (
        <div className="relative w-full aspect-[9/16] max-h-[75vh] md:max-h-[450px] aspect-square md:aspect-[4/5] bg-black rounded-[30px] overflow-hidden flex items-center justify-center group">
          
          <video
            src={url}
            /* 🎯 LA CLÉ : object-contain pour voir TOUTE la vidéo sans zoom */
            className="max-w-full max-h-full object-contain"
            autoPlay
            muted
            loop
            controls
            playsInline
            preload="auto"
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Petit effet de verre dépoli en fond pour le style (Optionnel) */}
          <div 
            className="absolute inset-0 -z-10 opacity-30 blur-2xl scale-110"
            style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover' }}
          />
        </div>
      ) : (
        <img 
          src={url} 
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000" 
          alt="Réussite de l'élève" 
          loading="lazy"
        />
      )}
    </div>
  );
};

export default PostMedia;

