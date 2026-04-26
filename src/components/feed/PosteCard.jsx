// 1. LES IMPORTS (En haut du fichier)
import React, { useState } from 'react';
import PostMedia from './PostMedia';
import PostActions from './PosteActions';
import CommentSection from './CommentSection';
import CommentDrawer from './CommentDrawer';
import { getAuthToken} from '../../services/feedService';
import { jwtDecode } from 'jwt-decode';


const PostCard = ({  onDelete,checkAuth,post,fanName,coach,onUpdate,onCommentAdded, setIswopen }) => {
  // État local pour gérer l'ouverture des commentaires et le like
  const [showComments, setShowComments] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // État pour le tiroir
  const [isExpanded, setIsExpanded] = useState(false);
  const textLimit = 150; // Nombre de caractères avant de couper
  const isLongText = post.content.length > textLimit;
  const token = getAuthToken();

  const displayText = isLongText && !isExpanded 
  ? post.content.slice(0, textLimit) + "..." 
  : post.content;


  let decoded = null;
  
  if (
  token
) {
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
    String(decoded.id) === String(post?.authorId);
  
  
  

  return (
    
<div className="w-full md:max-w-2xl bg-white md:rounded-lg shadow-sm border-b border-gray-200 overflow-hidden">

      
      {/* HEADER : USER INFO + MENU OPTIONS */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Ton Avatar actuel */}
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-black italic shadow-md">
              {post.authorName?.charAt(0)}
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-[15px] font-bold text-gray-900">{post.authorName}</h4>
              <p className="text-[13px] text-gray-500 font-normal font-bold  uppercase tracking-widest ">Membre de l'Empire</p>
            </div>
          </div>

          {/* 🎯 LES TROIS POINTS : Visible uniquement si c'est MON post */}
          {isConnectedToThisEmpire && (
            <div className="relative group">
              <button className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-purple-600">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>

              {/* MENU DÉROULANT (S'affiche au survol ou au clic) */}
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-2xl shadow-xl border border-purple-50 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-10">
                <button 
                  onClick={() => onDelete(post._id)}
                  className="w-full text-left px-3 py-2 text-[10px] font-black text-red-500 uppercase hover:bg-red-50 rounded-xl transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>

      {/* --- CONTENU TEXTE --- */}
      <div className="px-4">
          <p className="text-gray-800 text-sm leading-relaxed font-medium whitespace-pre-line">
            {displayText}
          </p>
          
          {isLongText && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-[10px] font-black uppercase italic tracking-widest text-purple-600 hover:text-gray-900 transition-colors"
            >
              {isExpanded ? "▲ Réduire" : "▼ Lire la suite"}
            </button>
          )}
    </div>

      {/* --- 🎯 PLACE N°1 : POSTMEDIA (L'image/Vidéo) --- */}
      <PostMedia url={post.imageUrl} />

      {/* --- 🎯 PLACE N°2 : POSTACTIONS (Boutons Like/Comment) --- */}
      <PostActions 
       checkAuth ={checkAuth}
        post = {post}
        coach = {coach}
         onUpdate={onUpdate}
        setOpenWhatsAppModal = {setIswopen}
        onToggleComments={() => setShowComments(!showComments)}
      />

      {/* --- 🎯 PLACE N°3 : COMMENTSECTION (Le salon de discussion) --- */}
     {/* Dans PostCard.jsx, à la place de l'ancienne zone commentaire */}
     
{showComments && (
  <CommentSection 
    comments={post.comments}
    postId={post._id}
    coach = {coach}
    totalCount={post.comments?.length || 0} // 👈 Voilà d'où vient la variable !
    DrawerOpen = {setIsDrawerOpen} 
  />
)}

   <CommentDrawer
      isOpen={isDrawerOpen} 
       postId={post._id}
      fanId={decoded?.id}
      fanName={fanName}
      onCommentAdded={onCommentAdded} 
      onClose={() => setIsDrawerOpen(false)} 
      comments={post.comments} 
      postTitle={post.content} 
    />

    

    </div>
  );
};

export default PostCard;