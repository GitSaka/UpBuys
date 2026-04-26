// src/components/feed/FeedContainer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PosteCard';
import SidebarLeft from '../components/feed/SidebarLeft';   // ⬅️ À CRÉER
import SidebarRight from '../components/feed/SidebarRight'; // ⬅️ À CRÉER

import { getAuthToken, getFan, saveFan} from '../services/feedService';
import WhatsAppCapture from '../components/WhatsAppCapture';
import AuthGuard from '../components/feed/AuthGuard';
 import { jwtDecode } from "jwt-decode";
import api from '../services/api';
import ConfirmModal from '../admin/components/product/ConfirmModal';
import Navbar from '../components/layout/Navbar';
// import ConfirmModal from "../../admin/components/UniversalModal";
// import api from '../admin/services/api'

const FeedContainer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'coach', ou 'mine'
  const [iswopen,setIswpen] = useState(false);
  const fanData = getFan(); 
  const { fanName,isSakaFan } = fanData || {};
  const token = getAuthToken()
  const [authMessage, setAuthMessage] = useState("");
  const { slug } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

    const handleOpenDelete = (postId) => {
      setSelectedPostId(postId);
      setIsModalOpen(true);
};
 
  

   const [coach, setCoach] = useState(null);

    useEffect(() => {
      const fetchCoach = async () => {
        const res = await api.get(`/client/profile/${slug}`); // backend renvoie {_id, name, ...}
        setCoach(res.data.data);
      };
      fetchCoach();
    }, [slug]);



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


useEffect(() => {
  const fetchFeed = async () => {
    setLoading(true)
    try {
      const res = await api.get(
        `/feed/${slug}`
      );

      setCoach(res.data.coach);
      setPosts(res.data.data);

    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  fetchFeed();

}, [slug]);

// La fonction que tu donnes à tes enfants (PostCard, PostActions)
const checkAuth = (messageAction) => {
  
  if (!isConnectedToThisEmpire) {
    setAuthMessage(messageAction); // 🎯 ON CAPTURE LE MESSAGE ICI
    return false; // Bloqué
  }
  return true; // Autorisé
};


  // const navigate = useNavigate();

  const handleAddCommentLocal = (postId, newComment) => {
  setPosts(prevPosts => 
    prevPosts.map(post => 
      // Si c'est le bon post, on ajoute le commentaire à son tableau existant
      post._id === postId 
        ? { ...post, comments: [...post.comments, newComment] } 
        : post
    )
  );
};

const handleDelete = async () => {
  try {
    setLoadingDelete(true);

    await api.delete(
      `/feed/delete/${selectedPostId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setPosts(prev =>
      prev.filter(post => post._id !== selectedPostId)
    );

    setIsModalOpen(false);
    setSelectedPostId(null);

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingDelete(false);
  }
};
 
const filteredPosts = posts.filter(post => {
    if (filter === "coach") {
      return post.authorId === coach?._id;
    }
    if (filter === "mine") {
      return post.authorId === decoded?.id;
    }
    return true;
});
  

// 1. Déclarer la fonction "Télécommande"
const updatePostInList = (postId, updatedData) => {
  setPosts(prevPosts => 
    prevPosts.map(post => 
      // Si c'est le bon post, on fusionne les anciennes données avec les nouvelles (ex: les nouveaux likes)
      post._id === postId ? { ...post, ...updatedData } : post
    )
  );
 
};

 // Se relance si on change d'influenceuse

  // Fonction pour ajouter le post instantanément après création
  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  // Dans FeedContainer.jsx
const handleResumeAction = async (authData) => {
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
  // const pending = JSON.parse(localStorage.getItem('pendingAction'));
       localStorage.removeItem('pendingAction');
       setIswpen(false)

  // if (pending && id) {
  //   try {
  //     if (pending.type === 'LIKE') {
  //       // 1. 🚀 ON APPELLE LE SERVEUR
  //       const res = await toggleLike(pending.postId, id);

        
  //       setPosts(prevPosts => prevPosts.map(p => 
  //         p._id === pending.postId 
  //           ? { ...p, likes: [...p.likes, id] } // On injecte l'ID manuellement dans la liste
  //           : p
  //       ));

  //       // 2. 🎯 AU LIEU DE setPosts(tout), ON UTILISE LA TÉLÉCOMMANDE
  //       // On ne met à jour QUE le post qui a été liké
  //       updatePostInList(pending.postId, { likes: res.updatedLikes });
       

  //     } 
  //     else if (pending.type === 'COMMENT') {
  //       // 1. 🚀 ON APPELLE LE SERVEUR
  //       // const res = await addComment(pending.postId, id, fanName, pending.text);
         
  //       // 2. 🎯 ON UTILISE LA TÉLÉCOMMANDE
  //       // On ajoute le nouveau commentaire à la liste existante de ce post
  //       // updatePostInList(pending.postId, { comments: res.updatedComments });
  //       localStorage.removeItem('pendingAction');
  //      setIswpen(false)
  //     }
  //        // On ferme le modal WhatsApp
  //     // setIswpen(false);
  //     // setTimeout(() => {
  //     //   window.location.reload(); 
  //     // }, 100);

  //     // 🧹 NETTOYAGE & FERMETURE
      
    

  //     // 🛑 PLUS BESOIN DE : const updatedPosts = await getCoachPosts...
  //     // Ton interface est déjà à jour grâce à la télécommande !

  //   } catch (err) {
  //     console.log(err)
  //     console.log("Erreur lors de la reprise d'action");
  //   }
  // }
};

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase">Chargement de l'Empire...</div>;


  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 italic-none font-sans">
      
      {/* 💎 HEADER LUXE (Fixe) */}
      <Navbar slug={coach?.slug}/>

      {/* 🏰 STRUCTURE EMPIRE (3 COLONNES) */}
      <div className="max-w-[1400px] mx-auto px-0 md:px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* ⬅️ COLONNE GAUCHE : NAVIGATION (25%) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit">
          <SidebarLeft slug = {slug}/>
        </aside>

        {/* 🎯 COLONNE CENTRE : LE FLUX (50%) */}
        <main className="lg:col-span-6 space-y-2">
          
          {/* 📱 FILTRES MOBILES (Visibles uniquement sur Mobile) */}
          <div className="lg:hidden flex gap-3 overflow-x-auto no-scrollbar py-2 mb-4">
             <button onClick={() => setFilter?.('all')} className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px]  uppercase italic shadow-lg ${filter === 'all' ? 'bg-gray-900 text-white font-black' : ' text-purple-600 border-purple-100 hover:bg-purple-50'}`}>✨ Tout</button>
             <button onClick={() => setFilter?.('coach')} className={`flex-shrink-0 px-6 py-2.5 text-purple-600 rounded-full text-[10px]  uppercase italic border border-purple-100 ${filter === 'coach' ? 'bg-gray-900 text-white font-black' : 'border-purple-100 text-purple-700 border-purple-100 hover:bg-purple-100'}`}>👑 Coach</button>
             <button onClick={() => setFilter?.('mine')} className={`flex-shrink-0 px-6 py-2.5 text-purple-600 rounded-full text-[10px] uppercase italic border border-purple-100 ${filter === 'mine' ? 'bg-gray-900 text-white font-black' : 'border-purple-100 text-purple-700 border-purple-100 hover:bg-purple-100'}`}>👤 Mes réussites</button>
          </div>

          <div className="space-y-10">
            {/* ZONE D'ÉCRITURE */}
            <CreatePost 
              checkAuth = {checkAuth}
              isFan={isSakaFan} 
              coach={coach}
              onPostCreated={handleNewPost} 
            />

            {/* FLUX DE RÉUSSITES */}
            <div className="space-y-8">
              {loading ? (
                <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase italic tracking-widest">
                  Synchronisation de l'Empire...
                </div>
              ) : (
             <div className="flex flex-col w-full items-center"> 
                    {filteredPosts.map(post => (
                      <div
                        key={post._id}
                        className="w-full flex justify-center mb-2 md:mb-4"
                      >
                        <PostCard
                          onDelete={handleOpenDelete}
                          coach={coach}
                          checkAuth={checkAuth}
                          fanName={fanName}
                          onUpdate={updatePostInList}
                          onCommentAdded={handleAddCommentLocal}
                          setIswopen={setIswpen}
                          post={post}
                        />
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </main>

        {/* ➡️ COLONNE DROITE : INFOS COACH (25%) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit">
          <SidebarRight 
            coach={coach} 
            activeFilter={filter} 
            onFilterChange={(newFilter) => setFilter(newFilter)} 
          />
        </aside>

        <WhatsAppCapture 
                    coachId = {coach?._id}
                    isOpen={iswopen}
                    onCancel={() => setIswpen(false)}
                    onConfirm={
                    handleResumeAction  
                }
        />

        <ConfirmModal
            isOpen={isModalOpen}
            loadingr={loadingDelete}
            mode="delete"
            title="Suppression"
            message="Supprimer cette réussite ?"
            onConfirm={handleDelete}
            onCancel={() => setIsModalOpen(false)}
          />

        

        <AuthGuard 
          message={authMessage}
          coachId={slug}
          onConnect={() => {
          setAuthMessage(""); // On ferme le guard
          setIswpen(true); // On ouvre ton composant de capture WhatsApp
              }}
              onCancel={() => setAuthMessage("")}
            />

      </div>

      
    </div>
  );
};

export default FeedContainer;