import React from 'react'

export const Footer = () => {
  return (
   
<footer className="mt-20 bg-gray-900 text-white rounded-t-[60px] pt-24 pb-12 px-8">
  <div className="max-w-7xl mx-auto text-center space-y-12">
    
    {/* 1. L'IDENTITÉ AU CENTRE */}
    <div className="space-y-4">
      <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
        <span className="text-gray-900 font-black text-xl italic">S</span>
      </div>
      <h2 className="text-xl font-black uppercase italic tracking-tighter">
        Souverains<span className="text-purple-500">.</span>
      </h2>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] italic">
        L'Excellence du Savoir Africain
      </p>
    </div>

    {/* 2. NAVIGATION DISCRÈTE (Lisible sur fond noir) */}
    <nav className="flex justify-center gap-10">
      {['Empires', 'Formations', 'À propos', 'Support'].map((link) => (
        <a 
          key={link} 
          href={`#${link}`} 
          className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors italic"
        >
          {link}
        </a>
      ))}
    </nav>

    {/* 3. L'INDICATEUR "REMONTER" (Maintenant bien visible en blanc) */}
    <div 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex flex-col items-center cursor-pointer group pt-10"
    >
      <span className="text-3xl animate-bounce">☝️</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors mt-2">
        Retour au sommet
      </span>
    </div>

    {/* 4. LE COPYRIGHT (Enfin lisible !) */}
    <div className="pt-20 border-t border-white/5">
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
        © 2026 Académie de la Maîtrise • <span className="text-gray-400 italic">Souveraineté Digitale</span>
      </p>
    </div>
  </div>
</footer>
  )
}
