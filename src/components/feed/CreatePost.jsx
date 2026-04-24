// src/components/feed/CreatePost.jsx
import React, { useState, useRef } from 'react';
import { uploadToCloudinary } from './UploadCloudiry';
import { createPost, getAuthToken} from '../../services/feedService';
import ReactPlayer from 'react-player';
 import { jwtDecode } from "jwt-decode";

const CreatePost = ({ checkAuth,coach,onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const token = getAuthToken()
  // 1. On crée le levier pour ouvrir/fermer le tiroir
  const [isExpanded, setIsExpanded] = useState(false);

  


  const handleOpenTiroir = () => {
  // 🔐 On appelle la douane (checkAuth) que le parent nous a passée en PROPS
  const authorized = checkAuth("Partage ton succès avec l'Empire ! 👑");
  
  if (authorized) {
    setIsExpanded(true); // 🔓 La porte s'ouvre seulement si autorisé
  }
};
 

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    setMediaUrl(url);
    setUploading(false);
  };
  // Détecte si l'URL contient "video" ou se termine par un format vidéo
  const isVideo = mediaUrl && (mediaUrl.includes('/video/upload/') || mediaUrl.match(/\.(mp4|mov|webm)$/i));

 



  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      user = null;
    }
  }

  const isConnectedToThisEmpire =
    user && user.coachId === coach?._id;
    console.log(isConnectedToThisEmpire)

  const handlePublish = async () => {
    // 1. 🛡️ LE VERROU : Si pas de fanId, on déclenche l'AuthGuard
    if (!isConnectedToThisEmpire) {
      // On peut même sauvegarder son texte pour qu'il ne le perde pas
      localStorage.setItem('pendingAction', JSON.stringify({ 
        type: 'CREATE_POST', 
        content: content // On sauve ce qu'il a écrit
      }));

      checkAuth("Rejoins le cercle pour partager ta réussite avec l'influenceuse ! ✨");
      return;
  }
  // 1. 🛡️ Sécurité : On ne poste pas du vide
  if (!content.trim() && !mediaUrl) return;

  const postData = {
    content: content,
    imageUrl: mediaUrl,
    mediaType: mediaUrl ? (mediaUrl.includes('video') ? 'video' : 'image') : 'none'
  };

  setUploading(true);

  try {
    const res = await createPost(postData);
    
    // 2. ✅ Succès : On vide les champs
    setContent('');
    setMediaUrl('');
    
    // 3. 🚀 Mise à jour instantanée du Feed (Parent)
    if (onPostCreated) onPostCreated(res.post);
    console.log(res.post)
    
    console.log("Post publié dans l'Empire ! 👑");
  } catch (err) {
    alert("Impossible de publier ton post pour le moment. ❌");
    console.log(err)
  } finally {
    setUploading(false);
  }
  };

  return (
  <div className={`bg-white rounded-[40px] p-4 md:p-6 shadow-xl shadow-purple-100/20 border border-purple-50 transition-all duration-500 ${isExpanded ? 'scale-100' : 'scale-[0.98] opacity-90'}`}>
    <div className="flex gap-4 items-center">
      {/* AVATAR ÉLÉGANT */}
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-black italic shadow-lg flex-shrink-0 text-xs md:text-base">
        {localStorage.getItem('fanName')?.charAt(0) || 'U'}
      </div>

      {/* ✍️ TEXTAREA DYNAMIQUE (L'INPUT FANTÔME) */}
      <textarea 
        onClick={handleOpenTiroir} // 🎯 Déclenche la douane et l'agrandissement
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Partage une réussite avec le cercle... ✨"
        className={`flex-1 bg-gray-50 rounded-[25px] p-4 text-sm font-medium outline-none border-none focus:ring-1 focus:ring-purple-100 resize-none transition-all duration-500 italic ${
          isExpanded ? 'min-h-[120px]' : 'min-h-[48px] h-12 pt-3'
        }`}
      />
    </div>

    {/* 🎁 ZONE RÉVÉLÉE (Uniquement si isExpanded est true) */}
    {isExpanded && (
      <div className="animate-fadeIn">
        {/* APERÇU MÉDIA (Ton code inchangé) */}
        {mediaUrl && (
          <div className="mt-4 relative rounded-[30px] overflow-hidden border border-purple-100 shadow-xl bg-gray-900 group">
            <button 
              onClick={() => setMediaUrl('')} 
              className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white w-8 h-8 rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition-all"
            > ✕ </button>
            {isVideo ? (
              <div className="aspect-video w-full">
                <video src={mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline onContextMenu={(e) => e.preventDefault()} />
              </div>
            ) : (
              <div className="h-60 w-full relative">
                <img src={mediaUrl} className="w-full h-full object-cover object-center" alt="Preview" />
              </div>
            )}
          </div>
        )}

        {/* BARRE D'ACTIONS (Boutons) */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4 px-2">
          <div className="flex gap-4">
             <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors"
            >
              <span className="text-xl">📷</span>
              <span className="hidden md:block text-[10px] font-black uppercase tracking-widest italic">Photo / Vidéo</span>
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*,video/*" />
            </button>
            
            {/* BOUTON ANNULER (Pour refermer le tiroir) */}
            <button 
              onClick={() => { setIsExpanded(false); setContent(''); setMediaUrl(''); }}
              className="text-[10px] font-black uppercase text-gray-300 hover:text-gray-500 transition-colors italic"
            >
              Annuler
            </button>
          </div>

          <button 
            onClick={async () => {
              await handlePublish();
              setIsExpanded(false); // 🎯 Referme après publication
            }}
            disabled={(!content && !mediaUrl) || uploading}
            className="bg-gray-900 text-white px-8 py-3 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-purple-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-95"
          >
            {uploading ? "Envoi..." : "Publier ✨"}
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default CreatePost;