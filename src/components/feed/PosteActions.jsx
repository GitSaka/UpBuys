// src/components/feed/PostActions.jsx
import React, { useState } from 'react';
import { getAuthToken, toggleLike } from '../../services/feedService';
import { jwtDecode } from 'jwt-decode';


const PostActions = ({checkAuth, post,onUpdate,coach, onToggleComments, setOpenWhatsAppModal }) => {
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
   console.log(isConnectedToThisEmpire)
  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes?.(decoded?.id) || false
  );
  const [count, setCount] = useState(post?.likes?.length);

   

  const handleLikeClick = async () => {
    // 1. SI PAS DE FANID : ON MÉMORISE ET ON OUVRE LE MODAL 🛡️
    if (!isConnectedToThisEmpire) {
      const pendingAction = {
        type: 'LIKE',
        postId: post._id
      };
      // On transforme l'objet en texte pour le localStorage
      localStorage.setItem('pendingAction', JSON.stringify(pendingAction));
      
      // On ouvre le modal
      if (setOpenWhatsAppModal) {
        setOpenWhatsAppModal(true);
      }
      return; 
    }

    // B. ACTION OPTIMISTE (L'effet "Luxe") 🚀
    const isCurrentlyLiked = post.likes.includes(decoded?.id);
    const newLikes = isCurrentlyLiked 
      ? post.likes.filter(id => id !== decoded?.id) // On retire le like
      : [...post.likes, decoded?.id];               // On ajoute le like

    // On utilise la télécommande pour dire au FeedContainer de se mettre à jour
    onUpdate(post._id, { likes: newLikes });

    // 2. SI FANID EXISTE : UI OPTIMISTE (L'ACTION DIRECTE) 🚀
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setCount(prev => (newStatus ? prev + 1 : prev - 1));

    try {
      // APPEL RÉEL AU SERVEUR
      await toggleLike(post._id,decoded?.id);
    } catch (err) {
      console.log(err);
      // RETOUR EN ARRIÈRE EN CAS D'ERREUR
      setIsLiked(!newStatus);
      setCount(prev => (!newStatus ? prev + 1 : prev - 1));
      alert("Erreur de connexion au cercle ❤️");
    }
  };

  // 1. La fonction qui protège l'accès aux commentaires
const handleCommentClick = () => {

  // SI PAS CONNECTÉ : On déclenche le Popup d'alerte Luxe 🛑
  if (!isConnectedToThisEmpire) {
    // On prépare l'action en attente (si tu veux qu'il s'ouvre après login)
    localStorage.setItem('pendingAction', JSON.stringify({ 
      type: 'OPEN_COMMENTS', 
      postId: post._id 
    }));

    // On appelle la fonction du parent pour afficher le message personnalisé
    checkAuth("Rejoins la discussion pour féliciter cet élève ! 💬✨");
    return;
  }

  // SI CONNECTÉ : On ouvre normalement ✅
  onToggleComments();
};

  // Ton return ici...

  return (
    <div className="flex items-center gap-8 px-2 pt-4 border-t border-gray-50 mt-2">
      <button onClick={handleLikeClick} className="flex items-center gap-2 group transition-all active:scale-125">
        <span className={`text-2xl transition-all duration-300 ${isLiked ? 'filter-none scale-110 animate-pulse' : 'grayscale opacity-30'}`}>
          💜
        </span>
        <span className={`text-[11px] font-black italic ${isLiked ? 'text-purple-600' : 'text-gray-400'}`}>
           {isLiked
              ? count > 1
                  ? `Toi & ${count - 1}`
                  : "Toi"
              : count
            }
        </span>
      </button>

      <button onClick={handleCommentClick} className="flex items-center gap-2 group opacity-50 hover:opacity-100 transition-all">
        <span className="text-2xl group-hover:rotate-12 transition-transform">💬</span>
        <span className="text-[11px] font-black text-gray-400 italic uppercase tracking-tighter">
          {post.comments?.length || 0} Avis
        </span>
      </button>
    </div>
  );
};

export default PostActions;