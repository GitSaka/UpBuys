import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { uploadToCloudinary } from '../components/feed/UploadCloudiry';
import api from '../services/api';
import WhatsAppCapture from '../components/WhatsAppCapture';

import {saveFan } from '../services/feedService';

const UserProfile = () => {
  const {slug} = useParams()
  const [user, setUser] = useState(null); // null au départ pour montrer le loader
  const [formData, setFormData] = useState({ name: '', email: '', city: '', avatar: ''});
  const [myMasters, setMyMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null); // 🎯 Le viseur pour le gestionnaire de fichiers
   const [uploading, setUploading] = useState(false); // Pour le petit loader Luxe
  
useEffect(() => {
  let isMounted = true;

  const fetchMyProfile = async () => {
    try {
      setLoading(true)
      const res = await api.get('/fans/me');

      if (res.data.success && isMounted) {
        const {profile,masters} = res.data.data;

        setUser(profile);
        setFormData({
          name: profile.name ?? '',
          email: profile.email ?? '',
          city: profile.city ?? '',
          avatar: profile.avatar ?? ''
        });
        setMyMasters(masters)
      }

    } catch (err) {
      console.error("Erreur de profil ❌", err);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchMyProfile();

  return () => {
    isMounted = false;
  };

}, []);



const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setUploading(true);
    // 🛰️ ON RÉUTILISE TA FONCTION MAGIQUE
    const url = await uploadToCloudinary(file); 
    
    if (url) {
      setFormData({ ...formData, avatar: url }); // Mise à jour visuelle immédiate
    }
  } catch (err) {
    alert("Erreur lors de l'envoi de la photo ❌"+err);
  } finally {
    setUploading(false);
  }
};

const handleSaveProfile = async () => {
  try {
    
    const res = await api.put(
      '/fans/updateMe',
      formData
    );

    if (res.data.success) {
      setUser(res.data.data); // ✅ correction ici
      setIsEditing(false);
      alert("Votre profil a été mis à jour avec succès ! 👑");
    }

  } catch (err) {
    console.error("Erreur de sauvegarde :", err);
    alert("Impossible de mettre à jour le profil pour le moment. ❌");
  }
};



const handleSwitchEmpire = async (targetMaster) => {
  try {
    // 1. 🛰️ APPEL AU BACKEND
    const res = await api.post(`/fans/switch-empire`, { 
      targetCoachId: targetMaster._id 
    });

    if (res.data.success) {
      // 🎯 EXTRACTION DES DONNÉES DU NOUVEAU BADGE
      const { success, fanName, tel, id, token } = res.data;
      
      // 🔑 LA CLÉ : Utiliser le slug du Maître sur lequel on a cliqué !
      const fanData = {
        isSakaFan: success,
        fanName,
        tel,
        id,
        slug: targetMaster.slug, // 🚀 ON PREND LE NOUVEAU SLUG ICI
        token,
      };
      
      // Sauvegarde du nouveau badge complet
      saveFan(fanData);
      

      // 🚀 TÉLÉPORTATION VERS LE NOUVEAU DOMAINE
      navigate(`/empire/${targetMaster.slug}/my-courses`);
      
      // 🔄 On force le rafraîchissement pour que TOUT l'Empire (Navbar incluse) 
      // comprenne qu'on a changé de Maître.
      // window.location.reload();
    }
  } catch (err) {
    console.error("Le voyage a échoué ❌", err);
  }
};

 
 if (loading)   return (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 space-y-6">

    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />

    <h2 className="text-lg sm:text-xl font-black uppercase tracking-widest text-gray-800 animate-pulse">
      Ouverture de votre Espace Privé... 🗝️
    </h2>

    <p className="text-sm text-gray-400">
      Veuillez patienter...
    </p>

  </div>
);
//   if (loading) return (
//   <div className="min-h-screen flex items-center justify-center bg-white font-black text-gray-300 animate-pulse uppercase tracking-widest text-[10px]">
//     Ouverture de votre Espace Privé... 🗝️
//   </div>
// );
  return (
    <div className="min-h-screen bg-white font-sans italic-none">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- 🛡️ ZONE GAUCHE : L'IDENTITÉ (COL 4) --- */}
       <section className="lg:col-span-4">
  <div className="sticky top-32 bg-gray-50 rounded-[50px] p-10 border border-gray-100 shadow-sm transition-all duration-500">
    
    {/* ZONE PHOTO (Nettoyée pour éviter les répétitions de div) */}
    <div className="relative group w-28 h-28 mx-auto mb-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleAvatarChange} 
      />
      <div 
        onClick={() => isEditing && fileInputRef.current.click()}
        className={`w-full h-full bg-white rounded-[35px] shadow-2xl flex items-center justify-center overflow-hidden border-2 transition-all ${
          isEditing ? 'border-purple-600 border-dashed cursor-pointer hover:scale-105' : 'border-white'
        }`}
      >
        {uploading ? (
          <div className="animate-spin text-purple-600 font-bold text-xl">🌀</div>
        ) : formData?.avatar ? (
          <img src={formData?.avatar} className="w-full h-full object-cover" alt="User" />
        ) : (
          <span className="text-4xl">👤</span>
        )}

        {isEditing && !uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Changer
          </div>
        )}
      </div>
    </div>

    {!isEditing ? (
      /* --- VUE LECTURE (CHIC) --- */
      <div className="space-y-6 animate-fadeIn">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">{user?.name}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.phoneNumber}</p>
          {user.email && <p className="text-[9px] font-medium text-purple-600 italic mt-1">{user?.email}</p>}
          {user.city && <p className="text-[9px] font-medium text-gray-400 italic mt-1">{user?.city}</p>}
        </div>
        
        <button 
          onClick={() => setIsEditing(true)}
          className="w-full py-4 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg"
        >
          Éditer mon profil
        </button>

        {/* 🚪 BOUTON DÉCONNEXION (Souverain) */}
        <div className="pt-6 border-t border-gray-100">
            <button 
                onClick={() => {
                    localStorage.clear(); // 🧹 Nettoyage complet (Token + Slug)
                    window.location.href = "/"; // 🚀 Retour à la racine
                }}
                className="w-full py-3 text-red-400 hover:text-red-600 text-[8px] font-black uppercase tracking-[0.3em] transition-colors italic"
            >
                Quitter l'Empire (Logout) 🚪
            </button>
        </div>
      </div>
    ) : (
      /* --- VUE ÉDITION (FORMULAIRE) --- */
      <div className="space-y-4 animate-fadeIn">
        <input 
          className="w-full bg-white px-5 py-3 rounded-2xl text-[11px] font-bold outline-none border border-gray-100 focus:border-purple-600 transition-all"
          value={formData.name} placeholder="Nom Complet"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          className="w-full bg-white px-5 py-3 rounded-2xl text-[11px] font-bold outline-none border border-gray-100 focus:border-purple-600 transition-all"
          value={formData.email} placeholder="Email"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          className="w-full bg-white px-5 py-3 rounded-2xl text-[11px] font-bold outline-none border border-gray-100 focus:border-purple-600 transition-all"
          value={formData.city} placeholder="Ville / Pays"
          onChange={(e) => setFormData({...formData, city: e.target.value})}
        />
        
        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => {
              setFormData({
                name: user.name ?? '',
                email: user.email ?? '',
                city: user.city ?? '',
                avatar: user.avatar ?? ''
              });
              setIsEditing(false);
            }} 
            className="flex-1 py-3 text-[9px] font-black uppercase text-gray-400 italic"
          >
            Annuler
          </button>
          <button 
            onClick={handleSaveProfile} 
            disabled={loading}
            className="flex-1 py-3 bg-purple-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Sauver"}
          </button>
        </div>
      </div>
    )}
  </div>
</section>

        {/* --- 🌍 ZONE DROITE : LA FRATERNITÉ DES MAÎTRES (COL 8) --- */}
        <section className="lg:col-span-8 space-y-12">
          <header className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-gray-900">
               Mes Maîtres <span className="text-purple-600">Souverains</span>
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300 italic">
               Naviguez entre vos différents empires d'apprentissage
            </p>
          </header>

         <div className="grid gap-4">
            {myMasters
            .sort((a, b) => (a.slug === slug ? -1 : b.slug === slug ? 1 : 0)) 
            .map((master) => {
              // 🕵️ LA CLÉ : On compare le slug du maître avec le slug de l'URL actuelle
              // (Assure-toi d'avoir récupéré 'slug' via useParams() en haut du composant)
              const isActive = master.slug === slug;

              return (
                <div 
                  key={master._id}
                  // 🚀 Si c'est un autre maître, on déclenche le Switch de Token
                  onClick={() => !isActive && handleSwitchEmpire(master)}
                  className={`group flex items-center justify-between p-6 rounded-[35px] border transition-all cursor-pointer ${
                      isActive 
                      ? 'bg-white border-purple-100 shadow-2xl shadow-purple-100/50 scale-[1.02]' 
                      : 'bg-white border-gray-50 hover:border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* PHOTO DU MAÎTRE AVEC COULEUR DYNAMIQUE */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg transition-transform group-hover:rotate-3 ${
                        isActive ? 'bg-purple-600' : 'bg-gray-900'
                    }`}>
                      {master.avatar ? (
                        <img src={master.avatar} className="w-full h-full object-cover" alt={master.storeName} />
                      ) : (
                        <span className="text-white font-black italic text-xl uppercase">
                          {master.storeName?.charAt(0) || master.userName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-black uppercase italic tracking-tighter text-gray-900 leading-none mb-1">
                          {master.storeName || master.userName}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {master.category || "Maître Souverain"}
                      </p>
                    </div>
                  </div>

                  {/* INDICATEUR D'ACTIVITÉ RÉEL */}
                  <div className="flex items-center gap-4">
                    {isActive ? (
                      <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                          <span className="text-[8px] font-black uppercase tracking-widest text-green-600 italic animate-pulse">Session Active</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-purple-600 transition-colors italic">
                          Rejoindre →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PETIT MESSAGE DE MOTIVATION EN BAS */}
          <div className="pt-10 border-t border-gray-50 text-center lg:text-left">
             <p className="text-[10px] text-gray-300 font-medium italic leading-relaxed">
                "Celui qui possède plusieurs Maîtres multiplie ses chances de conquérir le monde."
             </p>
          </div>
        </section>

      </main>

      
    </div>
  );
};

export default UserProfile;