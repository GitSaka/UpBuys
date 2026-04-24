// src/pages/Store.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
// import { MOCK_COURSES } from '../services/data';
import { useNavigate, useParams } from "react-router-dom";
import WhatsAppCapture from '../components/WhatsAppCapture';
import Navbar from '../components/layout/Navbar';
import { saveFan } from '../services/feedService';


const Store = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tout');
  const navigate = useNavigate();
  const {slug} = useParams()

  // 1. Ajoute l'état pour le modal
   const [captureModal, setCaptureModal] = useState({ isOpen: false, course: null });
   
    // 2. Fonction de clic sur une carte
    const handleCourseClick = (course) => {
            // Si c'est PAYANT → redirection vers la landing page
            navigate(`/academie/${course._id}`);      
    };



const handleLeadCapture = (authData) => {
  // 1. On récupère le token envoyé par le Popup
      const { success,fanName,tel,id,token } = authData;

            const fanData = {
              isSakaFan: success,
              fanName,
              tel,
              id,
              slug,
              token,
            };

        saveFan(fanData)
        // localStorage.setItem('token', authData.token); 
       

      // 4. On redirige l'utilisateur vers son cadeau (le lecteur)
      // On utilise l'ID du cours qu'on avait gardé en mémoire dans l'état du modal

      navigate(`/formation/${captureModal.course._id}/${captureModal.course.lessons[0]}`);

      // localStorage.setItem('fanName', fan.name);

      // 3. On ferme le Popup proprement
      setCaptureModal({ isOpen: false, course: null });  
};

useEffect(() => {
    // Appel API pour récupérer les formations
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/client/get-all-cours/${slug}`);
        setCourses(res.data.data);
        
      } catch (err) {
        console.error("Erreur chargement boutique:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [slug]);


  return (
    <div className="min-h-screen bg-white pb-24">
       <Navbar slug = {slug}/>
      {/* Header avec Titre Impactant */}
      <header className="pt-20 pb-12 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-4 uppercase">
          L'Académie <span className="text-purple-600 text-outline-purple">Privée</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm leading-relaxed">
          Accédez à mes programmes exclusifs et commencez à bâtir votre propre empire numérique dès aujourd'hui.
        </p>
      </header>

      {/* Barre de Filtres */}
      <div className='w-full overflow-hidden mb-12'>
        <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar md:justify-center">
        {['Tout', 'Formation','Payant','Gratuits', 'E-book', 'Coaching','Abonnement'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeFilter === filter 
              ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      </div>
      

      {/* Affichage de la Grille */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-black text-gray-300 text-xs uppercase tracking-widest">Ouverture des coffres...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
        {courses
          .filter(c => {
            // 1. Si on est sur "Tout", on affiche tout
            if (activeFilter === 'Tout') return true;
            
            // 2. Si on clique sur "Gratuits", on cherche le champ isFree
            if (activeFilter === 'Gratuits') return c.isFree === true;
            
            // 3. Si on clique sur "Abonnement", on cherche le pricingType
            if (activeFilter === 'Abonnement') return c.pricingType === 'Mensuel';

            // 🎯 NOUVEAU : Si on clique sur "E-books" ou "Outils"
            // On filtre selon le type de produit que tu as défini dans l'Admin
            if (activeFilter === 'E-book') return c.productType === 'Outil';
            
            // 🎯 NOUVEAU : Si on veut voir uniquement les formations métiers
            if (activeFilter === 'Formations') return c.productType === 'Metier';
            if (activeFilter === 'Payant') return c.isFree === false;

            // 4. Sinon, on filtre par la thématique classique (Business, Fitness...)
            return c.category === activeFilter;
          })
          .map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              handleClick={handleCourseClick}  
            />
          ))
        }
        </div>
      )}
      {/* Message de sécurité si le filtre ne trouve rien */}
        {!loading && courses.length > 0 && courses.filter(c => {
            if (activeFilter === 'Tout') return true;
            if (activeFilter === 'Gratuits') return c.isFree === true;
            if (activeFilter === 'Abonnement') return c.pricingType === 'Mensuel';
            if (activeFilter === 'E-book') return c.productType === 'Outil';
            return c.category === activeFilter;
        }).length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.4em]">
              Aucun trésor trouvé dans cette catégorie 🕯️
            </p>
          </div>
        )}
        {/* LE MODAL DE CAPTURE (Placé ici) */}
        <WhatsAppCapture 
          isOpen={captureModal.isOpen}
          courseTitle={captureModal.course?.title}
          onConfirm={handleLeadCapture}
          onCancel={() => setCaptureModal({ isOpen: false, course: null })}
        />
            </div>
  );
};

export default Store;