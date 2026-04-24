// src/components/ChapterList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChapterList = ({ lessons, course, hasAccess, isSakaFan, currentLessonId, onSelect }) => {
  const navigate = useNavigate();
  // const { coursesId } = useParams(); // Utilise l'ID de l'URL si nécessaire

  return (
    <div className="space-y-4">
      
      {lessons.map((lesson, index) => {
        // 🛡️ LOGIQUE DE SÉCURITÉ :
        // Un chapitre est verrouillé si : Ce n'est pas un cours gratuit ET ce n'est pas une leçon offerte ET l'utilisateur n'a pas de ticket
        const isLocked = !course.isFree && !lesson.isFree && !hasAccess;
        
        const isActive = currentLessonId === lesson._id;

        return (
          <div key={lesson._id} className="space-y-1"> 
            
            {/* 1. LE RECTANGLE DU CHAPITRE */}
            <div 
              onClick={() => {
                if (!course || !lesson) return
                // 🛑 CAS 1 : COURS GRATUIT + PAS ENCORE FAN
                // On bloque et on ouvre le Popup WhatsApp via onSelect
                if (course.isFree && !isSakaFan) {
                  if (onSelect) onSelect(); 
                } 
                
                // ✅ CAS 2 : DÉBLOQUÉ (Payant acheté, ou Leçon Offerte, ou déjà Fan)
                else if (!isLocked) {
                    if (currentLessonId) {
                      // On change juste la leçon sans recharger toute la page
                      navigate(`/formation/${course?._id}/${lesson._id}`); 
                    } else {
                      // Si on est sur la page Détails, on part au lecteur
                      navigate(`/formation/${course?._id}/${lesson._id}`);
                    }
                  if (onSelect) onSelect(); 
                }
                
                // 🔒 CAS 3 : VERROUILLÉ (On ne fait rien, l'élève doit payer)
              }}
              className={`flex items-center justify-between p-5 rounded-[24px] border transition-all duration-300 ${
                isActive 
                  ? 'bg-purple-50 border-purple-300 shadow-md ring-2 ring-purple-100 scale-[1.02]' 
                  : isLocked 
                  ? 'bg-gray-50/50 border-gray-100 opacity-60 cursor-not-allowed' 
                  : 'bg-white border-purple-100 shadow-sm ring-1 ring-purple-50 hover:border-purple-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                {/* Numéro Dynamique */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  isActive ? 'bg-purple-600 text-white animate-pulse' : isLocked ? 'bg-gray-200 text-gray-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  {index + 1}
                </div>
                
                <div>
                  <h4 className={`text-sm font-bold leading-tight transition-colors ${isActive ? 'text-purple-900' : 'text-gray-900'}`}>
                    {lesson.title}
                  </h4>
                  
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                    {lesson.type === 'video' && '📺 Vidéo'}
                    {lesson.type === 'text' && '📖 Texte'}
                    {lesson.type === 'audio' && '🎧 Audio'}
                    {lesson.type === 'pdf' && '📄 Document PDF'}
                    {lesson.duration && ` • ${lesson.duration}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {/* Badge OFFRE ou Icone 🔒 */}
                {lesson.isFree && !hasAccess && !course.isFree ? (
                  <span className="text-[9px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase italic">Offert</span>
                ) : isLocked ? (
                  <span className="text-lg grayscale opacity-50">🔒</span>
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {isActive ? (
                      <div className="flex gap-0.5 items-center">
                        <span className="w-1 h-3 bg-white animate-bounce"></span>
                        <span className="w-1 h-2 bg-white animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-3 bg-white animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    ) : (
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 2. BLOC RESSOURCE PDF (Discret en dessous) */}
            {lesson.attachmentUrl && (
              <div className="ml-14 flex items-center gap-1.5 py-1 animate-fadeIn">
                <span className="text-[10px] text-gray-300">└</span>
                <span className="text-[12px] opacity-70">📎</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                  Ressource : <span className="text-purple-400 italic">{lesson.attachmentName || 'Document joint'}</span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChapterList;