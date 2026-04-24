import React, { useEffect, useState } from 'react';

import CourseCard from '../components/CourseCard';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tout');
  const navigate = useNavigate();
  const { slug } = useParams(); // 🧭 Boussole pour rester chez le bon Maître

  useEffect(() => {
    const fetchMyInventory = async () => {
      try {        
        // 🛰️ On récupère le "Coffre-fort" (Payants + Gratuits) du coach actuel
        // On passe le slug pour que le Backend sache chez quel Maître on est
        const res = await api.get(`/client/my-inventory?slug=${slug}`);
        setCourses(res.data.data);
      } catch (err) {
        console.error("Erreur de bibliothèque ❌"+err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchMyInventory();
  }, [slug]);

  const handleCourseClick = (course) => {
     navigate(`/academie/${course._id}`); 
  };

  return (
    <div className="min-h-screen bg-white pb-24">
       <Navbar slug={slug} />

      <header className="pt-24 pb-12 px-6 max-w-4xl mx-auto text-center animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-4 uppercase italic">
          Bibliothèque <span className="text-purple-600">Privée</span> 📚
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">
           Vos ressources exclusives chez {slug?.replace('-', ' ')}
        </p>
      </header>

      {/* --- BARRE DE FILTRES --- */}
      <div className='w-full overflow-hidden mb-12'>
        <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar md:justify-center">
          {['Tout', 'Formation','Payé','Cadeaux', 'E-book', 'Outil'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeFilter === filter 
                ? 'bg-gray-900 text-white shadow-xl scale-105' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
          {courses.length > 0 ? (
            courses
              .filter(c => {
                if (activeFilter === 'Tout') return true;
                if (activeFilter === 'Cadeaux') return c.isFree === true;
                if (activeFilter === 'Payé') return c.isFree === false;
                if (activeFilter === 'Formation') return c.productType === 'Metier';
                return c.productType === activeFilter;
              })
              .map(course => (
                <div key={course._id} className="relative">
                  {/* 🛡️ SCEAU DE DISTINCTION DYNAMIQUE */}
                  <div className="absolute -top-2 -right-2 z-10">
                    {course.isFree ? (
                      <span className="bg-green-500 text-white text-[7px] font-black uppercase px-3 py-1 rounded-full shadow-lg border-2 border-white">Cadeau 🎁</span>
                    ) : (
                      <span className="bg-purple-600 text-white text-[7px] font-black uppercase px-3 py-1 rounded-full shadow-lg border-2 border-white">Investissement VIP 💎</span>
                    )}
                  </div>
                  
                  <CourseCard 
                    course={course} 
                    handleClick={handleCourseClick}
                    isOwned={true} 
                  />
                  
                </div>
              ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-[50px] border border-dashed border-gray-200 mx-6">
              <p className="text-gray-300 font-black uppercase text-[11px] tracking-[0.4em] mb-8">
                Aucun savoir débloqué ici... 🕯️
              </p>
              <button onClick={() => navigate(`/${slug}/shop`)} className="bg-gray-900 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-purple-600 transition-all">
                Explorer l'Académie ✨
              </button>
            </div>
            
          )}

          {/* Message de sécurité si le filtre ne trouve rien */}
          
        
        </div>
      )}
    </div>
  );
};

export default MyCourses;