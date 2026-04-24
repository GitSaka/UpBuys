// src/components/feed/CommentSection.jsx
import React, { useState } from 'react';
import { addComment, getAuthToken, getFan } from '../../services/feedService';
import { jwtDecode } from 'jwt-decode';

const CommentSection = ({postId,coach, comments = [], totalCount,DrawerOpen }) => {
  // const [newComment, setNewComment] = useState('');

   // localComments : stocke la liste des avis affichés (initialisée avec les props)
  const [localComments, setLocalComments] = useState(comments || []);

  // newMessage : stocke ce que l'élève écrit dans l'input en temps réel
  const [newMessage, setNewMessage] = useState('');

   // loading : pour désactiver le bouton pendant que le serveur travaille
  const [isSubmitting, setIsSubmitting] = useState(false);


const handleSendComment = async () => {

  const token = getAuthToken()
  
     let decoded = null;
     
     if (token) {
       try {
         decoded = jwtDecode(token);
       } catch (err) {
         console.log(err)
         decoded = null;
       }
     }
     
     
     const isConnectedToThisEmpire =
       !!token &&
       !!decoded &&
       !!coach &&
       String(decoded.coachId) === String(coach?._id);
  const fanData = getFan() || {};

  const {fanName,id } = fanData;
  console.log(fanName,id)

  // 1. 🛡️ SÉCURITÉ : Identité & Vide
  if (!isConnectedToThisEmpire) return alert("Identifie-toi pour participer ! ✨");


  if (!newMessage.trim()) return;

    setIsSubmitting(true);

  // 2. 💎 UI OPTIMISTE : On crée un faux commentaire local pour l'affichage instantané
  const optimisticComment = {
    author: decoded.name,
    text: newMessage,
    createdAt: new Date(),
    isOptimistic: true // Petit marqueur interne
  };

  // On l'ajoute à la liste locale tout de suite
  setLocalComments(prev => [...prev, optimisticComment]);
  const textToSend = newMessage; // On sauvegarde le texte
  setNewMessage(''); // On vide l'input immédiatement pour le "feeling" luxe

  try {
    // 3. 📡 ENVOI RÉEL
    const res = await addComment(postId,decoded.id, decoded.name, textToSend);
    console.log(res.data)
    
    // On peut remplacer le faux par le vrai si besoin (pour l'ID final)
    console.log("Commentaire gravé dans l'Empire ! 🏛️");
  } catch (err) {
    // ⚠️ ERREUR : On retire le faux commentaire si ça échoue
    console.log(err)
    setLocalComments(prev => prev.filter(c => !c.isOptimistic));
    alert("Impossible d'envoyer ton avis... réessaie ! ❌");
  }finally {
      setIsSubmitting(false);
  }
};
  
  
  // On ne montre que les 3 derniers pour l'aperçu "Luxe"
  const previewComments = localComments.slice(-3);
  const remainingCount = totalCount - 3;

  return (
    <div className="mt-4 space-y-4 animate-fadeIn">
      {/* 1. LISTE DES COMMENTAIRES (Aperçu) */}
      <div className="space-y-3">
        {previewComments.map((c, i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-50/50 p-3 rounded-[22px] border border-gray-100/30">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex-shrink-0 border border-white shadow-sm flex items-center justify-center text-[10px] font-black italic text-purple-600">
              {c.author?.charAt(0)}
            </div>
            <div className="text-left text-[11px]">
              <span className="font-black uppercase italic text-purple-700 mr-2 tracking-tighter">
                {c.author}
              </span>
              <p className="text-gray-600 font-medium leading-tight mt-1">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. BOUTON "VOIR PLUS" (Uniquement si > 3) */}
      {remainingCount > 0 && (
        <button 
          onClick={() => DrawerOpen(true)}
          className="ml-10 text-[9px] font-black text-purple-500 uppercase tracking-widest hover:underline transition-all"
        >
          {/* Sur Mobile, on écrit "Voir les 97 autres avis" */}
          + Voir les {remainingCount} autres avis de la communauté
        </button>
      )}

      

      {/* 3. BARRE DE SAISIE RAPIDE (L'interaction immédiate) */}
      <div className="flex gap-2 items-center bg-white p-1 rounded-[25px] border border-purple-50 shadow-sm focus-within:ring-2 focus-within:ring-purple-100 transition-all">
        <input 
           value={newMessage} // 👈 Lié à la variable newMessage
            onChange={(e) => setNewMessage(e.target.value)} // 👈 Met à jour newMessage
            placeholder="Ajouter un avis..."
          className="flex-1 bg-transparent p-3 text-[10px] font-bold outline-none italic"
        />
        <button 
         onClick={handleSendComment} // 👈 Déclenche la fonction
          disabled={isSubmitting}
         className="bg-gray-900 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg active:scale-90">
          🚀

          
        </button>
      </div>
    </div>
  );
};

export default CommentSection;