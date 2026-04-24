// src/components/feed/SidebarLeft.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarLeft = ({slug}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Fil d\'actualité', icon: '✨', path: `/empire/${slug}/feed`},
    { label: 'Mes Formations', icon: '🎓', path: `/empire/${slug}/shop` },
    // { label: 'Mes Favoris', icon: '💜', path: '/favoris' },
    // { label: 'Espace Chat', icon: '💬', path: '/chat' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 border border-purple-50 shadow-xl shadow-purple-100/10 space-y-8 animate-fadeIn text-left">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-gray-300 ml-4 tracking-[0.2em] italic">Menu Principal</p>
        <nav className="space-y-2">
          {menuItems.map((item, i) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 p-4 rounded-[22px] transition-all duration-500 group ${
                  isActive 
                    ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20 scale-[1.02]' 
                    : 'hover:bg-purple-50 text-gray-500 hover:text-purple-600'
                }`}
              >
                <span className={`text-xl transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-125 group-hover:rotate-12'}`}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase italic tracking-tighter">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ENCART PROMO "L'ACADÉMIE" */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-6 rounded-[30px] text-white shadow-2xl shadow-purple-200/40 relative overflow-hidden group cursor-pointer">
         <div className="relative z-10">
            <p className="text-[9px] font-black uppercase opacity-60 tracking-widest leading-none">Nouveauté</p>
            <h4 className="text-sm font-black italic uppercase leading-tight mt-2 tracking-tighter">
              L'IA pour ton Business 🤖
            </h4>
            <button className="mt-4 bg-white text-purple-700 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
               Accéder ✨
            </button>
         </div>
         {/* Décoration en arrière-plan */}
         <span className="absolute -bottom-4 -right-4 text-7xl opacity-10 group-hover:rotate-45 transition-transform duration-1000">🎓</span>
      </div>
    </div>
  );
};

export default SidebarLeft;