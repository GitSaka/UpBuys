// src/pages/LearningArea.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import ChapterList from '../components/ChapterList';
import ReactPlayer from 'react-player';
import DOMPurify from 'dompurify';
import Navbar from '../components/layout/Navbar';
import { getAuthToken } from '../services/feedService';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const LearningArea = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  
  
  // --- ÉTATS DES DONNÉES RÉELLES ---
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS UI (TES RÉGLAGES D'ORIGINE) ---
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const videoAnchorRef = useRef(null);
  const [likeCount, setLikeCount] = useState(0);
   
  const token = getAuthToken()


      let decoded = null;
    
        if (token) {
          decoded = jwtDecode(token);
          
        }

        const isConnectedToThisEmpire =
          token && decoded?.coachId === course?.createdBy._id;

      //  const hasAccess = hasAlreadyAccess || simulatePayment;

  
    const [hasAccess, setHasAccess] = useState(null); // null = en attente
 

useEffect(() => {
  const fetchEverything = async () => {
    
    try {
      setLoading(true);
      setIsVideoLoading(true);

      // 1️⃣ Charger le cours d'abord
      const res = await api.get(
        `/client/get-details/${courseId}`
      );
      const data = res.data.data;
      setCourse(data);
      setLikeCount(data.totalLikes || 0);

      const isCoachOfThisEmpire =
        token && decoded?.coachId === data?.createdBy?._id;

      // 2️⃣ SI LE COURS EST GRATUIT → PAS DE CHECK PAYMENT
      if (!data.isFree && !isCoachOfThisEmpire) {
        const check = await api.get(
          `/payments/check/${courseId}`
        );

        if (!check.data.hasAccess) {
          navigate(`/empire/checkout/${courseId}`);
          return;
        }
      }

      // ✅ ACCÈS AUTORISÉ
      setHasAccess(true);

      // 3️⃣ Charger la leçon
      if (data.productType === "Outil") {
        setCurrentLesson({
          title: data.title,
          type: "pdf_pack",
          mediaUrl: data.mainFileUrl,
          description: data.descriptionLong,
        });
      } else {
        const selectedId = lessonId || data.lessons[0]?._id;
        if (!selectedId) return;

        const lessonRes = await api.get(
          `/lessons/watch/${courseId}/${selectedId}`
        );
        setCurrentLesson(lessonRes.data.lesson);
      }

    } catch (err) {
      console.error("Erreur d'accès à l'Empire :", err);
      navigate(`/empire/${course?.createdBy?.slug}/shop`);
    } finally {
      setLoading(false);
      setIsVideoLoading(false);
    }
  };

  if (courseId) fetchEverything();
}, [courseId, lessonId, token]);




  // 2. TON SYSTÈME D'OBSERVER POUR LE LECTEUR FLOTTANT
useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth > 1024) {
          setIsFloating(!entry.isIntersecting);
        }
      },
      { threshold: 0.3 }
    );

    if (videoAnchorRef.current) {
      observer.observe(videoAnchorRef.current);
    }

    return () => {
      if (videoAnchorRef.current) observer.unobserve(videoAnchorRef.current);
    };
  }, [loading]); // Se réactive après la fin du chargement des données

   // ÉCRAN DE CHARGEMENT LUXE
  if (hasAccess === null) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] animate-pulse">Vérification du Pass Souverain...</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-black text-gray-900 animate-pulse uppercase tracking-[0.3em]">
      Ouverture en cours...
    </div>
  );

  if (!course || !currentLesson) return null;

 return (
  <>
  
  <Navbar slug={course?.createdBy.slug}/>
  <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row text-left italic-none">
     
    {/* GAUCHE : Zone principale */}
    <div className="flex-1 lg:h-screen lg:overflow-y-auto no-scrollbar bg-white">

      {/* --- CAS SPÉCIAL : MODE PACK / OUTIL --- */}
      {course.productType === 'Outil' ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-20 animate-fadeIn text-center">
          <div className="max-w-2xl w-full bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[50px] p-12 lg:p-20 flex flex-col items-center shadow-2xl shadow-blue-100/20">
            <span className="text-7xl mb-8 animate-bounce">📦</span>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-gray-900 mb-4 leading-none uppercase italic">
              {course.title}
            </h1>
            <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-10 italic">Ton Pack Digital est prêt</p>
            
            {/* BOUTON DE TÉLÉCHARGEMENT MAÎTRE (MainFileUrl) */}
            <a 
              href={course.mainFileUrl} 
              download 
              className="w-full cursor-pointer max-w-md bg-gray-900 text-white p-8 rounded-[30px] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
            >
              <span className="text-2xl">📥</span> Télécharger mon Pack (PDF/ZIP)
            </a>
            
            <p className="mt-8 text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-loose">
              Accès illimité • Archive sécurisée par l'Empire <br/> {course.createdBy?.storeName}
            </p>
          </div>
        </div>
      ) : (
        /* --- MODE FORMATION MÉTIER (TON DESIGN D'ORIGINE) --- */
        <>
          {/* ZONE MÉDIA ADAPTATIVE */}
          {currentLesson.type !== 'text' && currentLesson.type !== 'pdf' ? (
            <div ref={videoAnchorRef} className="sticky top-0 z-40 w-full bg-black aspect-video flex items-center justify-center shadow-2xl lg:relative lg:max-w-[850px] lg:mx-auto lg:mt-8 lg:rounded-[32px] lg:h-[450px] overflow-hidden">
              <div className={`${isFloating ? 'fixed bottom-8 right-8 w-[350px] z-50 rounded-3xl border-4 border-white shadow-2xl animate-fade-in' : 'relative w-full h-full lg:rounded-[32px] shadow-2xl'} bg-black overflow-hidden transition-all duration-500 aspect-video`}>
                
                {currentLesson.type === 'video' && (

                  <div className="relative w-full h-full aspect-video bg-black rounded-xl overflow-hidden">
                  {isVideoLoading && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
                      <p className="text-white text-lg animate-pulse">
                        📡 Chargement de la vidéo…
                      </p>
                    </div>
                  )}
                  {isVideoLoading && (
                      <p>📡 Chargement de la vidéo…</p>
                    )}
                  <video
                    src={currentLesson.mediaUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                    controlsList='nodownload'
                    onContextMenu={(e)=>e.preventDefault()}
                    onCanPlay={() => {
                    setIsVideoLoading(false);
                   
                              }}
                  />
                </div>

                   
                )
                 
                }

                {currentLesson.type === 'audio' && (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-900 to-black p-10">
                    <img src={course.thumbnail} className="w-24 h-24 rounded-full border-4 border-white/20 animate-pulse mb-6 object-cover shadow-2xl" alt="Cover" />
                    <audio controls src={currentLesson.mediaUrl} className="w-full max-w-md" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CAS TEXTE OU PDF */
            <div className="pt-12 px-6 lg:px-10 max-w-[850px] mx-auto animate-fadeIn">
              {currentLesson.type === 'pdf' && (
                <div className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-[40px] p-10 flex flex-col items-center text-center">
                  <span className="text-5xl mb-4">📄</span>
                  <h4 className="font-black text-sm uppercase tracking-tighter italic">{currentLesson.title}</h4>
                  <a href={currentLesson.mediaUrl} download className="mt-6 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 shadow-xl transition-all">📥 Télécharger le document</a>
                </div>
              )}
            </div>
          )}
          
          {/* ZONE TEXTE RICHE & RESSOURCES */}
          <div className="p-6 lg:p-10 max-w-[850px] mx-auto">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-gray-900 leading-tight uppercase italic">
                {currentLesson.title}
              </h1>
              <button onClick={() => setLikeCount(prev => prev + 1)} className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-purple-100 hover:scale-110 transition-all">
                <span className="text-xl">❤️</span>
                <span className="font-black text-sm text-purple-600">{likeCount}</span>
              </button>
            </div>

            {/* --- 📎 NOUVEAU : BOUTON RESSOURCE (PDF JOINT) --- */}
            {currentLesson.attachmentUrl && (
              <div className="mb-10 p-5 bg-blue-50 rounded-[25px] border border-blue-100 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📎</div>
                  <div>
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Ressource de travail</p>
                    <p className="text-[11px] font-bold text-gray-900 truncate max-w-[150px] md:max-w-xs">{currentLesson.attachmentName || "Document joint"}</p>
                  </div>
                </div>
                <a href={currentLesson.attachmentUrl} download className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-blue-200">
                  Télécharger
                </a>
              </div>
            )}

            <div className="prose prose-purple max-w-none text-gray-600">
              <div className="bg-purple-50 p-6 rounded-[28px] mb-8 border-l-4 border-purple-600 text-purple-900 font-medium italic text-sm">
                🌟 <b>Note de l'influenceuse :</b> Suivez bien cette étape ! ✨🚀
              </div>
              
              {currentLesson.description ? (
                  <div className="leading-relaxed text-sm lg:text-base font-medium"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(currentLesson.description)
                       }}
                  />
                
              ) : (
                <p className="text-gray-400 italic text-xs"> Aucune description disponible pour cette leçon.</p>
              )}
            </div>

            {/* Section Engagement */}
            <div className="mt-20 border-t border-gray-100 pt-12">
              <h3 className="font-black text-xl mb-8 tracking-tight text-gray-900 uppercase italic">Engagement 💬</h3>
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                <textarea placeholder="Pose ta question..." className="w-full bg-transparent border-none p-2 text-sm outline-none min-h-[100px] resize-none font-medium" />
                <div className="flex justify-end mt-2">
                  <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600">Publier mon avis</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    {/* SIDEBAR (Masquée si Mode Outil) */}
    {course.productType === 'Metier' && (
      <div className="w-full lg:w-[400px] bg-white border-l border-gray-100 h-screen overflow-y-auto p-6 hidden lg:block no-scrollbar">
        <div className="flex items-center gap-3 mb-8">
            <img src={course.createdBy?.avatar} className="w-8 h-8 rounded-full object-cover" alt="Coach" />
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Formation par {course.createdBy?.storeName}</span>
        </div>
        <h3 className="font-black text-xl mb-6 tracking-tighter uppercase italic">Programme</h3>
        <ChapterList 
                   course={course} 
                   lessons={course.lessons}
                   currentLessonId={currentLesson._id} 
                   hasAccess={hasAccess} 
                   isSakaFan={isConnectedToThisEmpire} 
           />
      </div>
    )}

    {/* SOMMAIRE MOBILE & BOUTON (Uniquement si Métier) */}
    {course.productType === 'Metier' && (
      <>
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[45px] p-8 h-[80vh] overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-2xl uppercase italic">Sommaire</h3>
                <button onClick={() => setShowMobileMenu(false)} className="bg-gray-100 px-4 py-2 rounded-2xl font-bold text-xs uppercase">Fermer</button>
              </div>
              <ChapterList 
                lessons={course.lessons} 
                hasAccess={true} 
                currentLessonId={currentLesson._id} 
                onSelect={()=>setShowMobileMenu(false)} 
                course={course}/> 
            </div>
          </div>
        )}
        <button onClick={() => setShowMobileMenu(true)} className="lg:hidden fixed bottom-6 right-6 z-[45] bg-purple-600 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
          <span>📚</span> Sommaire
        </button>
      </>
    )}
  </div>
  </>
);
};

export default LearningArea;