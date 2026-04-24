import React, { useState } from 'react';
import api from '../services/api';

const WhatsAppCapture = ({ isOpen,coachId, onConfirm, onCancel }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState("+225");
  const [step, setStep] = useState('PHONE_ONLY'); // Étape 1
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState('')


 const handleCheckPhone = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // On vérifie d'abord si le numéro existe dans la base
      const res = await api.post('/fans/check-access', {
        phoneNumber: phone, countryCode,coachId
      });
      
  if(res.data.action === "NEED_PASSWORD"){
    setIsExistingUser(true);
  }else if(res.data.action === 'NEED_INFO'){
    setIsExistingUser(false)
  }
      
      setStep('PASSWORD_AND_NAME'); // On passe à l'étape suivante
    } catch (err) {
      setError(`Erreur de connexion. Réessaie.${err.response?.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

    const countries = [
    { name: "Côte d'Ivoire", code:' +225' },
  { name: "Bénin", code: '+229' },
  { name: "Burkina Faso", code: '+226' },
  { name: "Cap-Vert", code: '+238' },
  
  { name: "Gambie", code: '+220' },
  { name: "Ghana", code: '+233' },
  { name: "Guinée", code: '+224' },
  { name: "Guinée-Bissau", code:'+245' },
  { name: "Liberia", code: '+231' },
  { name: "Mali", code: "+223" },
  { name: "Mauritanie", code: '+222' },
  { name: "Niger", code: '+227' },
  { name: "Nigéria", code: '+234' },
  { name: "Sénégal", code: '+221' },
  { name: "Sierra Leone", code: '+232' },
  { name: "Togo", code: '+228' }
];
 

  // 2. FONCTION FINALE (C'est elle qui appelle onConfirm de ton Store/Details)
const handleFinalAuth = async (e) => {
      e.preventDefault();
      setError(""); // On efface l'erreur précédente
      setIsLoading(true);

      try {
        // 1. C'est ici que le Popup interroge le serveur
        const res = await api.post('/fans/auth', {
          phoneNumber: phone,
          countryCode,
          name,
          password,
          isExistingUser,
          coachId
        });

        // 2. SI SUCCÈS : On envoie le résultat (token + fan) au parent
        onConfirm(res.data); 
      

  } catch (err) {
        // 3. SI ERREUR : Le popup capture le message et l'affiche
        const message = err.response?.data?.message || "Erreur de connexion";
        setError(message); // 👈 C'est ÇA qui va faire apparaître le message rouge
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xl">
      <div className="bg-white w-full max-w-xl rounded-[45px] p-10 shadow-2xl relative">
        
        <h2 className="text-xl font-black text-center uppercase italic mb-8">
          {step === 'PHONE_ONLY' ? 'Accès au Cercle Privé' : 'Sécurise ton accès 🛡️'}
        </h2>
       

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-bold text-center italic animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={step === 'PHONE_ONLY' ? handleCheckPhone : handleFinalAuth} className="space-y-5">
          {step === 'PHONE_ONLY' ? (
            /* ÉTAPE 1 : NUMÉRO SEUL */
            <div className='flex gap-3'>
               <select className="bg-gray-50 rounded-[25px] px-4 py-5 font-black text-xs outline-none shadow-inner" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                  {countries.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                 {/* ... autres pays */}
               </select>
               <input 
                 type="tel" placeholder="WhatsApp" required
                 value = {phone}
                 className="flex-1 bg-gray-50 p-5 w-full rounded-[25px] outline-none font-bold shadow-inner"
                 onChange={(e) => setPhone(e.target.value)}
               />
            </div>
          ) : (
            /* ÉTAPE 2 : ADAPTATIVE */
            <div className="space-y-5 animate-fadeIn">
               {!isExistingUser && (
                 <input 
                   type="text" placeholder="Ton Prénom" required
                   value={name}
                   className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold shadow-inner"
                   onChange={(e) => setName(e.target.value)}
                 />
               )}
               <input 
                 type="text" placeholder="Ton mot de passe" required
                 value={password}
                 className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold shadow-inner"
                 onChange={(e) => setPassword(e.target.value)}
               />
               <button type="button" onClick={() => setStep('PHONE_ONLY')} className="text-[10px] uppercase font-black text-gray-400 w-full text-center">Modifier le numéro</button>
            </div>
          )}

          <button 
            
            type="submit"
            className="w-full bg-gray-900 text-white py-6 rounded-[25px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
          >
            {isLoading ? 'Vérification...' : step === 'PHONE_ONLY' ? 'Continuer →' : 'Accéder au cadeau'}
          </button>
          <button 
            onClick={onCancel}
            type="submit"
            className="w-full bg-gray-200 text-blue py-6 rounded-[25px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
          >
            ANNULER
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppCapture;