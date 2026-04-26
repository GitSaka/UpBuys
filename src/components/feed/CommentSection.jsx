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
      {/* 1. LISTE DES COMMENTAIRES : On passe en text-[14px] pour la lisibilité */}
      <div className="space-y-3">
        {previewComments.map((c, i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-50/50 p-3 rounded-[20px] border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-purple-600">
              {c.author?.charAt(0)}
            </div>
            <div className="text-left text-[14px]"> {/* Augmenté ici */}
              <span className="font-bold text-gray-900 mr-2">
                {c.author}
              </span>
              <p className="text-gray-700 leading-snug mt-0.5">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. BOUTON VOIR PLUS : Un peu plus grand pour le pouce */}
      {remainingCount > 0 && (
        <button 
          onClick={() => DrawerOpen(true)}
          className="ml-11 text-[13px] font-semibold text-gray-500 hover:underline transition-all"
        >
          Voir les {remainingCount} autres commentaires
        </button>
      )}

      {/* 3. BARRE DE SAISIE : CHANGÉ EN <form> POUR LA TOUCHE ENTRÉE */}
      <form 
        onSubmit={(e) => {
          e.preventDefault(); // Empêche le rechargement de la page
          handleSendComment(); // Appelle ta fonction existante
        }}
        className="flex gap-2 items-center bg-gray-100 p-1.5 rounded-full border border-transparent focus-within:bg-white focus-within:border-gray-300 transition-all mx-2 mb-2"
      >
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écris un commentaire..."
          className="flex-1 bg-transparent px-3 py-2 text-[15px] font-normal outline-none text-gray-800 placeholder:text-gray-500"
        />
        <button 
          type="submit" // 🎯 IMPORTANT : permet de valider avec "Entrée"
          disabled={isSubmitting || !newMessage.trim()}
          className={`px-4 py-2 text-[15px] font-bold transition-all ${
            newMessage.trim() 
              ? 'text-blue-600' 
              : 'text-gray-400 opacity-50'
          }`}
        >
          {isSubmitting ? "..." : "Publier"}
        </button>
      </form>
    </div>
  );

};

export default CommentSection;