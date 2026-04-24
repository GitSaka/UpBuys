// src/pages/CourseDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import ChapterList from '../components/ChapterList';
import WhatsAppCapture from '../components/WhatsAppCapture';
import { getAuthToken, saveFan } from '../services/feedService';
import { jwtDecode } from "jwt-decode";
import api from '../services/api';

const CourseDetails = () => {
  const { coursesId } = useParams();
  
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [captureModal, setCaptureModal] = useState({ isOpen: false, course: null });

  // --- 🛡️ SYSTÈME DE SÉCURITÉ SOUVERAIN ---
  // 1. Badge "Ami" : On vérifie si l'utilisateur a déjà donné son numéro une fois sur le site
  const token = getAuthToken();
  const [hasAccess, setHasAccess] = useState(false);

  // 1. RÉCUPÉRATION BACKEND
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/client/get-details/${coursesId}`);
        setCourse(res.data.data);
      } catch (err) {
        console.error("Erreur détails:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [coursesId]);



 


      let decoded = null;
  
      if (token) {
        decoded = jwtDecode(token);
        
      }
  
  
      const isConnectedToThisEmpire =
        token && decoded?.coachId === course?.createdBy._id;

//verification si c'est deja payer ou pas

useEffect(() => {
  const checkMyAccess = async () => {
    try {
      
      // 🛰️ On demande au serveur : "Est-ce que cet élève possède ce cours ?"
      const res = await api.get(`http://localhost:5000/api/payments/check/${course?._id}`);
      setHasAccess(res.data.hasAccess); // Sera true ou false selon la BDD
    } catch (err) {
      console.log(err)
      setHasAccess(false); // Par défaut, pas d'accès
    }
  };

  if (token && course?._id) checkMyAccess();
}, [course?._id, token]);

 // 2. LOGIQUE DE CAPTURE WHATSAPP
const handleLeadCapture = async (authData) => {
  // 1️⃣ Sauvegarde du badge
   const { success,fanName,tel,id,token } = authData;
  
              const fanData = {
                isSakaFan: success,
                fanName,
                tel,
                id,
                token,
                slug:course?.createdBy.slug
              };
  
          saveFan(fanData)
  // 2️⃣ Fermeture du popup
  setCaptureModal({ isOpen: false, course: null });
 
  // 3️⃣ Vérifier l'accès réel
  try {
    const res = await api.get(`/payments/check/${course._id}`);
    const hasAccess = res.data.hasAccess;

    // 4️⃣ Redirection intelligente
    if (course.isFree || hasAccess) {
      // 🎁 Gratuit ou déjà payé : on ouvre le cours
      if (course.productType === 'Outil') {
        navigate(`/formation/${course._id}`);
      } else {
        const firstLessonId = course.lessons[0]?._id;
        navigate(`/formation/${course._id}/${firstLessonId}`);
      }
      console.log("Accès au cours accordé !");
    } else {
      // 💳 Payant et non débloqué : checkout
      navigate(`/empire/checkout/${course._id}`);
      console.log("Direction le Checkout pour le paiement... 💰");
    }

  } catch (err) {
    console.error("Erreur lors de la vérification d'accès :", err);
    alert("Impossible de vérifier l'accès au cours pour le moment. ❌");
  }
};

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.3em] text-gray-300">Synchronisation de l'Empire...</div>;
  if (!course) return <div className="p-20 text-center font-black">FORMATION INTROUVABLE</div>;

  return (
    <div className="min-h-screen bg-white pb-32 italic-none">
      {/* HEADER VISUEL */}
      <div className="relative h-[350px] aspect-[16/7]  w-full group overflow-hidden">
        <img src={course.thumbnail} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 shadow-2xl" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-12 left-6 bg-white/90 backdrop-blur-md p-4 rounded-[20px] shadow-2xl z-20">
          <svg width="18" height="18" fill="none" stroke="black" strokeWidth="4" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>

      <div className="md:px-6 -mt-24 relative z-10 max-w-full ">
        <div className="bg-white rounded-[50px] p-3 py-8 md:p-12 shadow-2xl shadow-purple-100/40 border border-purple-50 text-left">
          
          {/* COACH IDENTITY */}
          <div className="flex items-center gap-3 mb-8">
            <Link to={`/profile/coach/${course?.createdBy.slug}`}>
            <img src={course.createdBy?.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-purple-100" />
            </Link>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Programme par</p>
              <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{course.createdBy?.storeName}</p>
              <p className="text-[10px]  text-gray-400 italic ">{new Date(course.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* BADGES & TYPE DE PRODUIT */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-tighter ${course.productType === 'Outil' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
               {course.productType === 'Outil' ? '📦 Outil / E-book' : '🎓 Formation Métier'}
            </span>
            <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-5 py-2 rounded-full uppercase italic tracking-tighter">🔥 {course.salesCount} MEMBRES</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4 leading-none uppercase italic">
            {course.title}
          </h1>
          <p className="text-gray-400 font-bold text-lg mb-10 leading-tight italic">{course.subtitle}</p>

          {/* MATÉRIELS REQUIS */}
          {course.productType === 'Metier' && course.materials?.length > 0 && (
            <div className="mb-12 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-4 italic underline">🛠️ Matériel à prévoir</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.materials.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span> {m.name}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* DESCRIPTION TIPTAP */}
          <div className="mb-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 mb-6 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-purple-200"></span> À PROPOS DE L'EMPIRE
            </h3>
            <div className="bg-white p-3 md:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div
                  className="
                    prose 
                    prose-lg
                    prose-purple
                    max-w-none
                    text-gray-700
                    font-medium
                    leading-relaxed

                    prose-headings:text-gray-900
                    prose-headings:font-bold

                    prose-p:leading-7
                    prose-p:mb-4

                    prose-img:w-full
                    prose-img:max-w-none
                    prose-img:rounded-xl
                    prose-img:shadow-md
                    prose-img:mx-auto
                    prose-img:my-6

                    prose-ul:my-4
                    prose-li:marker:text-purple-600

                    prose-blockquote:border-l-purple-500
                    prose-blockquote:text-gray-600
                    prose-blockquote:italic
                  "
                  dangerouslySetInnerHTML={{ __html: course.descriptionLong }}
                />

            </div>

          </div>

          {/* SOMMAIRE OU FICHE TECHNIQUE */}
          <div className="space-y-8 pt-10 border-t border-gray-50">
            {course.productType === 'Metier' ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tighter uppercase italic">Sommaire du programme</h3>
                  <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                    {course.lessons?.length} CHAPITRES
                  </span>
                </div>
                <ChapterList 
                   course={course} 
                   lessons={course.lessons} 
                   hasAccess={hasAccess} 
                   isSakaFan={isConnectedToThisEmpire}
                   onSelect={()=> setCaptureModal({isOpen: true, course: course})}
                />
              </>
            ) : (
              <div className="bg-blue-50/30 p-8 rounded-[40px] border border-blue-100 flex flex-col items-center text-center">
                <span className="text-5xl mb-4">📖</span>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic text-blue-900 mb-2">Contenu du Pack Digital</h3>
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">Livraison immédiate après validation</p>
                <div className="mt-6 flex gap-4">
                   <span className="bg-white px-4 py-2 rounded-2xl text-[10px] font-black border border-blue-50">⚡ ACCÈS À VIE</span>
                   <span className="bg-white px-4 py-2 rounded-2xl text-[10px] font-black border border-blue-50">📎 FORMAT PDF/ZIP</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BARRE D'ACHAT FIXE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl border-t border-gray-100 p-6 md:px-12 flex items-center justify-between z-50 animate-slideUp">
        <div className="text-left">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
            {course.isFree ? (
              <span className="bg-green-500 text-white px-4 py-1.5 rounded-full italic">🎁 OFFERT</span>
            ) : (
              course.pricingType === 'Mensuel' ? 'ABONNEMENT' : 'ACCÈS À VIE'
            )}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-gray-900 leading-none">
              {course.isFree ? "0" : course.price?.toLocaleString()} <small className="text-xs">CFA</small>
            </span>
          </div>
        </div>

        {/* --- ZONE D'ACTION DYNAMIQUE --- */}
<div className="mt-8 flex justify-center md:justify-start">
  
    
   <button 
          // onClick={() => {
          //   if (course.isFree && isConnectedToThisEmpire) {
          //     // ✅ DÉJÀ FAN : On entre direct
          //     if (course.productType === 'Outil') {
                
          //       navigate(`/formation/${course._id}`);
                
          //     } else {
          //       const firstId = course.lessons[0]?._id;
                
          //       navigate(`/formation/${course._id}/${firstId}`);
          //     }
          //   } else if (course.isFree) {
          //     // 🎁 PAS ENCORE FAN : Popup WhatsApp
          //     setCaptureModal({ isOpen: true, course: course });
          //   } else if (!hasAccess) {
          //     // 💳 PAYANT : Checkout
          //     navigate(`/empire/checkout/${course._id}`);
          //   } else {
          //     // ✅ DÉJÀ PAYÉ
          //     navigate(`/formation/${course._id}/${course.lessons[0]?._id}`);
          //   }
          // }}
          // className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
          //   course.isFree ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-900 text-white hover:bg-purple-600'
          // }`} 

          onClick={() => {
  // 🔐 ÉTAPE 0 : LA DOUANE (Si pas de token, on arrête tout)
              if (!token && !isConnectedToThisEmpire) {
                  setCaptureModal({ isOpen: true, course: course });
                  return;
                }

              // ✅ ÉTAPE 1 : SI DÉJÀ PAYÉ OU DÉJÀ INSCRIT (ACCÈS ACTIF)
              if (hasAccess) {
                const firstLessonId = course.lessons[0]?._id;
                navigate(`/formation/${course._id}/${firstLessonId}`);
                return;
              }

              // 🎁 ÉTAPE 2 : CAS DU GRATUIT (CADEAU)
              if (course.isFree) {
                if (isConnectedToThisEmpire) {
                  if (course.productType === 'Outil') {
                    
                    navigate(`/formation/${course._id}`);
                    
                  } else {
                    const firstId = course.lessons[0]?._id;
                    
                    navigate(`/formation/${course._id}/${firstId}`);
                  }
                } else {
                  setCaptureModal({ isOpen: true, course: course });
                }
                return;
              }

              // 💳 ÉTAPE 3 : CAS DU PAYANT (PAS ENCORE D'ACCÈS)
              // On retire le dossier "empire" de l'URL pour rester sur ta route propre
              navigate(`/empire/checkout/${course._id}`);
            }}

            className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                  (course.isFree || hasAccess)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-900 text-white hover:bg-purple-600'
                }`} 
              >
          {course.isFree && token ? "Reprendre ma lecture ✨" : 
           course.isFree ? "Recevoir mon Cadeau 🎁" : 
           hasAccess ? "Accéder à mon contenu ✨" : "Débloquer l'Empire ✨"}
        </button>
  
</div>

        
      </div>



      <WhatsAppCapture 
        isOpen={captureModal.isOpen}
        coachId={course.createdBy}
        courseTitle={captureModal.course?.title}
        onConfirm={handleLeadCapture}
        onCancel={() => setCaptureModal({ isOpen: false, course: null })}
      />
    </div>
  );
};

export default CourseDetails;