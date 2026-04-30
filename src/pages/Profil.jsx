import React, { useEffect, useState } from 'react';
// import { getFan, saveFan } from '../services/feedService';
import { useNavigate, useParams } from 'react-router-dom';
// import { jwtDecode } from "jwt-decode";
import api from '../services/api';

const INFLUENCER = {
  name: "Aïcha Digital",
  // title: "Coach en Stratégie Business",
  bio: "Je transforme ton smartphone en machine à générer des revenus. Experte en marketing digital depuis 8 ans, j'accompagne les entrepreneurs africains à bâtir des empires souverains sans budget publicitaire colossal. Bienvenue dans mon univers où le digital n'a plus de secrets pour vous. 🚀j'accompagne les entrepreneurs africains à bâtij'accompagne les entrepreneurs africains à bâtij'accompagne les entrepreneurs africains à bâtij'accompagne les entrepreneurs africains à bâtij'accompagne les entrepreneurs africains à bâtij'accompagne les entrepreneurs africains à bâtij'accompagne les entrepreneurs africains à bâti",
  avatar: "./7.jpeg",
  banner: "./App.jpg",
};

function Home() {
  // const [phone, setPhone] = useState('');
  // const [name, setName] = useState('');
  // const [password, setPassword] = useState('');
  // const [countryCode, setCountryCode] = useState("+225");
  // const [isValid, setIsValid] = useState(false); 
  const [error, setError] = useState("");
  // const [step, setStep] = useState('PHONE_ONLY'); // Étape 1 : Numéro uniquement
  // const [isExistingUser, setIsExistingUser] = useState(false); // Pour savoir si on demande le nom
  
  const [showFullBio, setShowFullBio] = useState(false);
  

  const navigate =  useNavigate()
   const { slug } = useParams(); // 🔗 On récupère l'adresse (ex: saka-couture-5684)
   const [coach, setCoach] = useState(null); // Les infos du coach venant de la DB
   const [loadingCoach, setLoadingCoach] = useState(true);

  
  

    // let decoded = null;

    // if (token) {
    //   decoded = jwtDecode(token);
      
    // }


    // const isConnectedToThisEmpire =
    //   token && decoded?.coachId === coach?._id;


 

    // 1. 🛰️ CHARGEMENT DU COACH DEPUIS LA DB
useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const res = await api.get(`/client/profile/${slug}`);
        setCoach(res.data.data);
      } catch (err) {
        console.log(err)
        setError("Cet Empire n'existe pas encore... 🏰");
      } finally {
        setLoadingCoach(false);
      }
    };
    fetchCoachData();
  }, [slug]);

console.log(error)

  // const countries = [
  //   { code: "+225", flag: "🇨🇮" }, { code: "+221", flag: "🇸🇳" },
  //   { code: "+237", flag: "🇨🇲" }, { code: "+241", flag: "🇬🇦" },
  //   { code: "+226", flag: "🇧🇫" }, { code: "+229", flag: "🇧🇯" }
  // ];

//   const countries = [
//     { name: "Côte d'Ivoire", code:' +225' },
//   { name: "Bénin", code: '+229' },
//   { name: "Burkina Faso", code: '+226' },
//   { name: "Cap-Vert", code: '+238' },
  
//   { name: "Gambie", code: '+220' },
//   { name: "Ghana", code: '+233' },
//   { name: "Guinée", code: '+224' },
//   { name: "Guinée-Bissau", code:'+245' },
//   { name: "Liberia", code: '+231' },
//   { name: "Mali", code: "+223" },
//   { name: "Mauritanie", code: '+222' },
//   { name: "Niger", code: '+227' },
//   { name: "Nigéria", code: '+234' },
//   { name: "Sénégal", code: '+221' },
//   { name: "Sierra Leone", code: '+232' },
//   { name: "Togo", code: '+228' }
// ];

//   const validatePhoneNumber = (value) => {
//     const cleanValue = value.replace(/\D/g, "");
//     setPhone(cleanValue);
//     setIsValid(cleanValue.length >= 8 && cleanValue.length <= 10);
//   };



  //  const isConnectedToThisEmpire =
  //  token && decoded?.coachId === coach._id;

  if (loadingCoach) return <div className="p-20 text-center font-black animate-pulse uppercase">Chargement de l'Empire...</div>;
  if (!coach) return <div className="p-20 text-center font-black text-red-500 italic uppercase">404 - Empire Introuvable</div>;
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20 text-left">
      
      {/* 1. BANNIÈRE & PROFIL */}
      <div className="relative">
        <div className="h-44 md:h-60 w-full bg-gray-100 overflow-hidden">
          <img src={coach.banner} alt="Bannière" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-28 h-28 rounded-[35px] p-1 bg-white shadow-2xl">
            <img src={coach.avatar} alt="Profil" className="w-full h-full rounded-[30px] object-cover" />
          </div>
        </div>
      </div>

      
            {/* 2. INFOS INFLUENCEUSE (BIO & DESCRIPTION) */}
      <header className="mt-16 flex flex-col items-center px-6 text-center">
        {/* Nom et Titre (Focus central) */}
        <h1 className="text-3xl font-black tracking-tighter  uppercase italic leading-none">{coach.storeName}</h1>
        <p className="text-purple-600 font-black text-[9px] uppercase tracking-[0.2em] mt-2 italic">Projeté par la souveraineté</p>
        
        {/* BIO : Courte et élégante (Largeur limitée) */}
        <div className="mt-4 max-w-[280px]">
          <p className="text-gray-400 text-[11px] font-bold leading-relaxed italic uppercase tracking-tight">
            {coach.bio}
          </p>
        </div>

       {/* DESCRIPTION : Large avec effet de flou progressif (Fade-out) */}
      <div className="mt-12 w-full md:px-10 max-w-2xl mx-auto relative group">
        
        {/* LE CONTENEUR AVEC MAX-HEIGHT DYNAMIQUE */}
        <div className={`relative overflow-hidden transition-all duration-700 ${showFullBio ? 'max-h-[2000px]' : 'max-h-[120px]'}`}>
          
          {/* LE CONTENU TIPTAP (Texte à gauche, Images centrées) */}
          <div 
            className="prose prose-purple text-sm text-gray-500 leading-relaxed font-medium 
                      w-full max-w-none text-left 
                      prose-p:text-left prose-headings:text-left 
                      prose-img:rounded-[30px] prose-img:mx-auto prose-img:my-8 shadow-none"
            dangerouslySetInnerHTML={{ __html: coach?.bioLongue || coach?.bioHtml }} 
          />
          
          {/* L'EFFET DE FLOU (Uniquement si fermé) */}
          {!showFullBio && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
          )}
        </div>

        {/* BOUTON "LIRE L'HISTOIRE" */}
        <button 
          onClick={() => setShowFullBio(!showFullBio)}
          className="mt-6 flex items-center gap-3 mx-auto text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] hover:scale-105 transition-all italic"
        >
          <span className="w-8 h-[1px] bg-purple-200"></span>
          {showFullBio ? "Réduire l'histoire" : "Lire l'histoire complète"}
          <span className={`transition-transform duration-500 ${showFullBio ? 'rotate-180' : ''}`}>↓</span>
          <span className="w-8 h-[1px] bg-purple-200"></span>
        </button>
      </div>
      </header>

      {/* 3. FORMULAIRE PLEINE LARGEUR (40px de padding sur les côtés) */}
     

      {/* 4. NAVIGATION  */}
  
      <nav className="px-6 space-y-4 max-w-md mx-auto">
        {[
          { id: 'feed', icon: '📺', label: 'Contenus Exclusifs', path: `/empire/${coach.slug}/feed` },
          { id: 'shop', icon: '🛍️', label: 'Boutique & Formations', path: `/empire/${coach.slug}/shop` }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:border-purple-200 transition-all"
          >
            <span className="flex items-center gap-4">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
              <div className="text-left">
                <span className="block font-black text-gray-900 text-[10px] uppercase tracking-widest leading-none">
                  {item.label}
                </span>
                <span className="text-[9px] text-gray-400 font-bold italic">Accès libre</span>
              </div>
            </span>
            <span className="text-gray-300 group-hover:text-purple-600 transition-colors">→</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

export default Home;