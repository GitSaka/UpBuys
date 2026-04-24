// src/components/feed/CommentDrawer.jsx
import React, { useState } from 'react';
import { addComment } from '../../services/feedService';

const CommentDrawer = ({ isOpen, onClose,postId,fanId,fanName, comments, postTitle,onCommentAdded }) => {

  const [drawerText, setDrawerText] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;
  

  const handleSendInDrawer = async () => {
  if (!drawerText.trim()) return;
  
     setIsSending(true);
  try {
    // 🚀 ON APPELLE LE SERVICE RÉEL
    const res = await addComment(postId, fanId, fanName, drawerText);
    
    // ✅ ON VIDE ET ON RAFRAÎCHIT
    setDrawerText("");
    onCommentAdded(postId,res.comment); // Une fonction pour mettre à jour la liste des coms
  } catch (err) {
    console.log(err)
    alert("Erreur lors de l'envoi ❌");
  }finally {
      setIsSending(false);
    }
}

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center animate-fadeIn">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Le Tiroir */}
      <div className="relative bg-white w-full max-w-2xl h-[85vh] rounded-t-[45px] shadow-2xl flex flex-col animate-slideUp">
        
        {/* Barre de saisie/fermeture */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-black uppercase italic text-sm tracking-tighter text-gray-900">Avis de la communauté</h3>
            <p className="text-[10px] text-gray-400 font-bold truncate max-w-[200px] italic">Sur : {postTitle}</p>
          </div>
          <button onClick={onClose} className="bg-gray-100 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest">Fermer</button>
        </div>

        {/* Liste complète des commentaires */}
<div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50/80 p-4 rounded-[22px] border border-purple-50/50 mb-3 animate-fadeIn">
  
      {/* AVATAR MINI */}
      <div className="flex-none w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[8px] text-white font-black italic shadow-sm">
        {c.author?.charAt(0)}
      </div>

      {/* CONTENU DU COMMENTAIRE */}
      <div className="flex-1 min-w-0"> {/* 🎯 min-w-0 est VITAL pour empêcher le débordement */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black uppercase italic tracking-tighter text-gray-900">
            {c.author}
          </span>
          <span className="text-[8px] font-bold text-gray-300 uppercase italic">Il y a un instant</span>
        </div>

        {/* 🛡️ LA PROTECTION TEXTE */}
        <div className="relative group">
          <p className="text-[11px] text-gray-600 leading-relaxed break-words whitespace-pre-line overflow-hidden max-h-[80px] group-hover:max-h-none transition-all duration-500">
            {c.text}
          </p>
          
          {/* Optionnel : Un petit indicateur si le texte est très long */}
          {c.text?.length > 150 && (
            <span className="text-[8px] font-black text-purple-400 uppercase italic mt-1 block opacity-50">
              (...)
            </span>
          )}
        </div>
      </div>
</div>
          ))}
</div>

        {/* Zone d'écriture fixe en bas */}
        <div className="p-6 bg-white border-t border-gray-100 mb-2">
            <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-[30px] border border-purple-50">
              

              <input value={drawerText} 
                    onChange={(e) => setDrawerText(e.target.value)} 
                    placeholder="Écris ton avis..."
                    className="flex-1 bg-transparent p-3 text-xs font-bold outline-none italic" />
              <button  onClick={handleSendInDrawer} className="bg-gray-900 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg active:scale-90">{isSending ? "..." : "🚀"}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDrawer;