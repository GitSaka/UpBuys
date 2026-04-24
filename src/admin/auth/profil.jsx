import React, { useEffect, useState } from 'react';
import ShareLink from '../components/Sharlink';
import RichEditor from '../tiptap/RichEdictor';
import api from '../services/api';

import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../store/slices/authThunks';
import { uploadToCloudinary } from '../components/courses/UploadCloudiry';
import AuthGuard from '../../components/feed/AuthGuard';
import { updateUserInRedux } from '../../store/slices/authSlice';



const Settings = () => {
  const [isEditing, setIsEditing] = useState(false); // Bascule entre Vue et Modification
  const [step, setStep] = useState(1); // Étape du formulaire progressif
  // const [bioHtml, setBioHtml] = useState("");
  // console.log(bioHtml)
  const [uploading,setUploading] = useState(false);
  const [inLoading,setInLoading] = useState(false);
  
  
   const dispatch = useDispatch();
   console.log(inLoading)
  // 🎯 ON RÉCUPÈRE L'UTILISATEUR GLOBAL DE REDUX
  const { user, isLoading } = useSelector((state) => state.auth);
  useEffect(() => {
    // Si l'utilisateur n'est pas encore chargé en mémoire, on le cherche
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);
  // const { slug } = useParams();

   const [profile, setProfile] = useState({
    userName: "",
    storeName:"",
    slogan: "",
    bio: "",
    telephone: "",
    currency: "",
    tiktok: "",
    avatar: "",
    fullPhone: "",
    banner: "",
    email:"",
    slug:"",
    bioHtml:'',
    facebook: "",
   instagram: "",
  });

  
const handleSaveProfile = async () => {
  try {
    if (!profile.slug) return AuthGuard("Profil introuvable ❌", "error");

    setInLoading(true);

    const token = localStorage.getItem('adminToken');
    if (!token) return AuthGuard("Vous devez être connecté ❌", "error");

  

    const res = await api.put(
      `/auth/update/${profile.slug}`,
     profile
    );

    if (res.data.success) {
      dispatch(updateUserInRedux(res.data.data));
    }
  } catch (err) {
    console.error(err);
   
  } finally {
    setInLoading(false);
  }
};


useEffect(() => {
  if (user) {
    setProfile({
      storeName: user?.storeName || '',
      userName: user?.userName || '',
      slogan: user?.slogan || '',
      bioHtml: user?.bioHtml || '',
      telephone: user?.telephone || '',
      fullPhone: user?.fullPhone || '',
      currency: user?.currency || '',
      tiktok: user?.tiktok || '',
      banner: user?.banner || '',
      slug: user?.slug || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
      facebook: user?.facebook || '',
      instagram: user?.instagram || ''
    });
  }
}, [user]);



  


 
  

  const handleImageChange = async (e, field) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // 1. 🔄 FEEDBACK VISUEL (Luxe)
    // On peut afficher un petit loader ici si tu en as un
    setInLoading(true); 

    // 2. 🚀 L'ENVOI RÉEL (Vers ton service Cloudinary)
    // On appelle la fonction que tu utilises déjà dans ton Tiptap
    const imageUrl = await uploadToCloudinary(file);

    if (imageUrl) {
      // 3. ✅ MISE À JOUR DE L'ÉTAT LOCAL
      // On remplace le fichier par l'URL finale (https://res.cloudinary.com...)
      setProfile({ ...profile, [field]: imageUrl });
      
      AuthGuard(`${field === 'avatar' ? 'Photo' : 'Bannière'} chargée ! ✨`);
    }
  } catch (error) {
    console.error("Erreur Cloudinary:", error);
    AuthGuard("Échec de l'envoi de l'image ❌", "error");
  } finally {
    setInLoading(false);
  }
};

   const generateSlug = (name) =>
        name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');

 const handleStoreNameChange = (e) => {
  const value = e.target.value;

  setProfile(prev => ({
    ...prev,
    userName: value,
    slug:generateSlug(value)
  }));
};

if (isLoading) return <p className="p-20 text-center font-black text-gray-300 animate-pulse uppercase italic tracking-widest">Chargement de l'Empire... ⏳</p>;


  return (
    <div className="animate-fadeIn max-w-5xl mx-auto pb-20 text-left">
      <ShareLink
      slug={profile.slug}
      />
      
      {!isEditing ? (
        /* --- 1. VUE CONSULTATION (ÉLÉGANTE) --- */
        <div className="space-y-8">
          <header className="relative mb-16">
            <div className="h-48 bg-gray-100 rounded-[40px] overflow-hidden shadow-inner">
               <img src={profile.banner} className="w-full h-full object-cover opacity-80" alt="Banner" />
            </div>
            <div className="absolute -bottom-10 left-10 flex items-end gap-6">
              <img src={profile.avatar} className="w-32 h-32 rounded-[32px] border-4 border-white shadow-2xl object-cover" alt="Avatar" />
              <div className="mb-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">{profile.userName}</h1>
                <p className="text-purple-600 font-bold text-[10px] uppercase tracking-widest">{profile.slogan}</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* 2. COLONNE DE GAUCHE : IDENTITÉ */}
            <div className="lg:col-span-2  space-y-6">
                <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-left">
                    <h2 className="text-[10px] font-black uppercase text-gray-400 mb-8 tracking-widest flex items-center gap-2">
                    <span>👤</span> Informations de la Reine
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-2">Nom d'affichage</label>
                        <input 
                        type="text" value={profile.userName}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl  outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-2">Lien de l'Empire (Slug)</label>
                        <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs italic">io/</span>
                        <input 
                            type="text" value={profile.slug}
                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm"
                            readOnly={true}
                        />
                        </div>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 ml-2">Ma Bio (Max 150 caractères)</label>
                    <textarea 
                        rows="3" value={profile.bio}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl  outline-none font-medium leading-relaxed"
                        readOnly={true}
                    />
                    </div>
                </section>

            {/* 3. RÉGLAGES BUSINESS */}
                <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-left">
                    <h2 className="text-[10px] font-black uppercase text-gray-400 mb-8 tracking-widest flex items-center gap-2">
                    <span>💳</span> Configuration Business
                    </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-2">WhatsApp Business</label>
                        <input 
                        type="tel" value={profile.fullPhone}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                    <div className="space-y-2">
                        <input 
                        type="tel" value={profile.currency}
                        className="w-full mt-7 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                      
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 items-center">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-2">Email</label>
                        <input 
                        type="tel" value={profile.email}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                      
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 ml-2">Réseau Sociaux</label>
                        <input 
                        type="tel" value={profile.tiktok}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                    <div className="space-y-2">
                        <input 
                        type="tel" value={profile.tiktok}
                        className="w-full mt-7 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                    <div className="space-y-2">
                        <input 
                        type="tel" value={profile.tiktok}
                        className="w-full mt-7 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                        readOnly={true}
                        />
                    </div>
                      
                </div>
                </section>
            </div>

            <div className="space-y-6">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-900 text-white p-10 rounded-[40px] shadow-xl hover:bg-purple-700 transition-all text-center group"
              >
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">🎨</span>
                <span className="font-black uppercase text-xs tracking-[0.2em]">Personnaliser mon Empire</span>
              </button>

              <div className="p-8 border border-red-100 rounded-[40px] bg-red-50/30 text-left">
                    <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 italic">Zone de Danger</h3>
                    <button className="text-xs font-bold text-red-400 hover:text-red-600 underline decoration-2">Supprimer mon compte définitivement</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- 2. VUE MODIFICATION (PROGRESSIVE) --- */
        
        <div className="animate-slideInRight">
         
          {/* Barre de progrès */}
          <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step >= num ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>{num}</div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${step >= num ? 'text-gray-900' : 'text-gray-300'}`}>
                  {num === 1 ? 'Visuel' : num === 2 ? 'Identité' : 'Business'}
                </span>
                {num < 3 && <div className="w-10 h-[2px] bg-gray-100"></div>}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="relative h-48 bg-gray-100 group">
                  <img src={profile.banner} className="w-full h-full object-cover" alt="Preview" />
                  <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <span className="bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Changer la bannière</span>
                    <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'banner')} />
                  </label>
                </div>
                <div className="px-10 -mt-12 flex items-end gap-6 mb-10">
                  <label className="relative group cursor-pointer">
                    <img src={profile.avatar} className="w-32 h-32 rounded-[32px] border-4 border-white object-cover shadow-2xl" alt="Avatar" />
                    <div className="absolute inset-0 bg-black/40 rounded-[32px] opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">📷</div>
                    <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'avatar')} />
                  </label>
                  <div className="mb-4">
                    <h2 className="text-xl font-black text-gray-900 tracking-tighter italic">Visuels de l'Empire</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Étape 1 sur 3</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-10 space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Name</label>
                  <input type="text" value={profile.userName} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold" onChange={handleStoreNameChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Slug</label>
                  <input type="text" value={profile.slug} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold" onChange={handleStoreNameChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Slogan</label>
                  <input type="text" value={profile.slogan} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold" onChange={(e) => setProfile({...profile, slogan: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Bio</label>
                  <textarea rows="4" value={profile.bio} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-medium leading-relaxed" onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Bio</label>
                <RichEditor
                  content={user?.bioHtml || ""} 
                  uploading = {uploading}
                  setUploading = {setUploading}
                  onChange={(newHtml) => setProfile({...profile,bioHtml:newHtml})} 
                />
                </div>
                
              </div>
            )}

            {step === 3 && (
              <div className="p-10 space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">WhatsApp</label>
                    <input type="tel" value={profile.telephone} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold" onChange={(e) => setProfile({...profile, telephone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">TikTok</label>
                    <input type="url" value={profile.tiktok} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-medium" onChange={(e) => setProfile({...profile, tiktok: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Facebook</label>
                    <input type="url" value={profile.facebook} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-medium" onChange={(e) => setProfile({...profile, facebook: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Instagram</label>
                    <input type="url" value={profile.instagram} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-medium" onChange={(e) => setProfile({...profile, instagram: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 bg-gray-50 flex justify-between items-center border-t border-gray-100">
              <button 
                onClick={() => step === 1 ? setIsEditing(false) : setStep(step - 1)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                {step === 1 ? 'Annuler' : 'Précédent'}
              </button>
              
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Suivant</button>
              ) : (
                <button 
                  className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-200 active:scale-95 transition-all"
                  onClick={() => {
                    handleSaveProfile();
                    setIsEditing(false);
                    setStep(1);
                  }}
                >
                  Confirmer les changements 👑
                </button>
              )}
            </div>
          </div>

        
          
        </div>
      )}
    </div>
  );
};

export default Settings;