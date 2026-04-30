import React from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { getAuthToken, getFan } from '../../services/feedService';
import {jwtDecode} from 'jwt-decode'


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {slug} = getFan() || {}
  
  const token =  getAuthToken();

  const fan = getFan();

  console.log(fan)

  let decoded = null

  if(token){
    try{
      decoded = jwtDecode(token)
    }catch(err){
      console.log(err)
      decoded = null
    }
  }

  

  

  // --- DÉTECTION DU CONTEXTE ---
  const isCoachSpace = slug && location.pathname.includes(slug);
  const isChatPage = location.pathname.includes('/chat');

  const handleLogout = () => {
    
      navigate(`/empire/${slug}/my-profile`);
      
  };

 

  return (
    <>
      {/* 1. NAVBAR SUPÉRIEURE (Toujours présente) */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-50 sticky top-0 z-[100] px-4 md:px-10 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6">
          
          {/* GAUCHE : RETOUR & NOM DE L'EMPIRE */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center text-sm hover:bg-purple-50 transition-all"
            >
              ⬅️
            </button>
            {/* <h1 
              onClick={() => navigate(`/empire/${slug}/shop`)}
              className="text-lg font-black uppercase italic tracking-tighter cursor-pointer group"
            >
              Cours
            </h1> */}
          </div>

          {/* CENTRE : NAVIGATION PC (Cachée sur Mobile) OU NAVIGATION CHAT (Mobile) */}
          <div className="flex items-center gap-4">
            {/* Menu PC Classique */}
            {isCoachSpace && (
              <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                <button onClick={() => navigate(`/empire/${slug}/my-courses`)} className={`hover:text-purple-600 ${location.pathname.includes('my-courses') ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : ''}`}>MyCourses</button>
                <button onClick={() => navigate(`/empire/${slug}/feed`)} className={`hover:text-purple-600 ${location.pathname.includes('feed') ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : ''}`}>Journal</button>
                <button onClick={() => navigate(`/empire/${slug}/shop`)} className={`hover:text-purple-600 ${location.pathname.includes('shop') ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : ''}`}>Boutique</button>
                {/* <button onClick={() => navigate(`/${slug}/chat`)} className={`hover:text-purple-600 ${location.pathname.includes('chat') ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : ''}`}>Discussion</button> */}
              </div>
            )}

            {/* Navigation de secours pour sortir du Chat sur Mobile */}
            {isChatPage && (
              <div className="lg:hidden flex items-center gap-2">
                <button 
                  onClick={() => navigate(`/empire/${slug}/feed`)}
                  className="text-[8px] font-black uppercase bg-gray-50 px-3 py-2 rounded-full text-gray-400 italic"
                >
                  ✨ Journal
                </button>
              </div>
            )}
          </div>

          {/* DROITE : PROFIL / LOGOUT */}
          <div className="flex items-center gap-3">
          {/* 🏰 PORTAIL ADMIN (Uniquement pour le Coach) */}
            {decoded?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="hidden md:flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-full border border-purple-100 hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-sm group"
              >
                <span className="text-[9px] font-black uppercase tracking-widest italic">
                  Gérer mon Empire
                </span>
                <span className="group-hover:rotate-12 transition-transform">🏰</span>
              </button>
            )}
            {token ? (
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100 shadow-inner">
                <span className="hidden sm:block text-[9px] font-black px-2 uppercase text-gray-600">{decoded?.name}</span>
                <button 
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 active:scale-95 transition-all"
                  >
                    {fan?.avatar ? (
                      <img 
                        src={fan.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-600">
                        {decoded?.name?.charAt(0)}
                      </div>
                    )}
                  </button>
              </div>
            ) : (
              <button onClick={() => navigate(`/`)} className="bg-gray-900 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-100">Découvrir ✨</button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. TABBAR MOBILE (Bas de l'écran) */}
      {/* 🚨 CONDITION CRUCIALE : On cache la barre si on est dans le CHAT (!isChatPage) */}
      {isCoachSpace && !isChatPage && (
       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-gray-100 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around">

          <button 
            onClick={() => navigate(`/empire/${slug}/feed`)}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname.includes('feed') 
                ? 'text-purple-600 scale-110' 
                : 'text-gray-400'
            }`}
          >
            <span className="text-[22px]">✨</span>
            <span className="text-[10px] font-black uppercase tracking-wide">
              Journal
            </span>
          </button>

          <button 
            onClick={() => navigate(`/empire/${slug}/shop`)}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname.includes('shop') 
                ? 'text-purple-600 scale-110' 
                : 'text-gray-400'
            }`}
          >
            <span className="text-[22px]">🛍️</span>
            <span className="text-[10px] font-black uppercase tracking-wide">
              Boutique
            </span>
          </button>

          <button 
            onClick={() => navigate(`/empire/${slug}/my-courses`)}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname.includes('my-courses') 
                ? 'text-purple-600 scale-110' 
                : 'text-gray-400'
            }`}
          >
            <span className="text-[22px]">📚</span>
            <span className="text-[10px] font-black uppercase tracking-wide">
              Mes cours
            </span>
          </button>

        </div>
      </div>
      )}
    </>
  );
};

export default Navbar;