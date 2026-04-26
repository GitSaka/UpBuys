import React, { useState } from 'react';
import api from '../services/api';

const WhatsAppCapture = ({ isOpen, coachId, onConfirm, onCancel }) => {
  // On remplace 'phone' par 'identifier' pour accepter Email ou Tel
  const [identifier, setIdentifier] = useState(''); 
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState("+225");
  const [step, setStep] = useState('PHONE_ONLY'); // Étape 1
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // 1. Détecter si la saisie est un email
  const isEmailSaisi = identifier.includes('@');
  console.log({
        identifier: identifier.trim().toLowerCase(),
        type: isEmailSaisi ? 'EMAIL' : 'PHONE',
        countryCode: isEmailSaisi ? null : countryCode,
        coachId
      })
  const handleCheckPhone = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // On envoie le type d'identifiant au backend
      const res = await api.post('/fans/check-access', {
        identifier: identifier.trim().toLowerCase(),
        type: isEmailSaisi ? 'EMAIL' : 'PHONE',
        countryCode: isEmailSaisi ? null : countryCode,
        coachId
      });
      
      if (res.data.action === "NEED_PASSWORD") {
        setIsExistingUser(true);
      } else if (res.data.action === 'NEED_INFO') {
        setIsExistingUser(false);
        // Si l'identifiant était un email, on pré-remplit le champ email pour l'étape 2
        if (isEmailSaisi) setEmail(identifier.trim().toLowerCase());
      }
      
      setStep('PASSWORD_AND_NAME');
    } catch (err) {
      setError(`Erreur : ${err.response?.data.message || "Identifiant invalide"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post('/fans/auth', {
        identifier: identifier.trim().toLowerCase(),
        type: isEmailSaisi ? 'EMAIL' : 'PHONE',
        countryCode: isEmailSaisi ? null : countryCode,
        name,
        email: isEmailSaisi ? identifier.trim().toLowerCase() : email.trim().toLowerCase(),
        password,
        isExistingUser,
        coachId
      });

      onConfirm(res.data); 
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [
    { name: "Côte d'Ivoire", code: '+225' },
    { name: "Bénin", code: '+229' },
    { name: "Burkina Faso", code: '+226' },
    { name: "Togo", code: '+228' },
    { name: "Sénégal", code: '+221' },
    { name: "Mali", code: "+223" },
    { name: "Niger", code: '+227' },
    { name: "Guinée", code: '+224' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xl">
      <div className="bg-white w-full max-w-xl rounded-[45px] p-10 shadow-2xl relative text-left">
        
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
            <div className='flex gap-3'>
               {!isEmailSaisi && (
                 <select 
                    className="bg-gray-50 rounded-[25px] px-4 py-5 font-black text-xs outline-none shadow-inner" 
                    value={countryCode} 
                    onChange={(e) => setCountryCode(e.target.value)}
                 >
                    {countries.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                 </select>
               )}
               <input 
                 type="text" placeholder="Email ou WhatsApp" required
                 value={identifier}
                 className="flex-1 bg-gray-50 p-5 w-full rounded-[25px] outline-none font-bold shadow-inner"
                 onChange={(e) => setIdentifier(e.target.value)}
               />
            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">
               {!isExistingUser && (
                 <>
                   <input 
                     type="text" placeholder="Ton Prénom" required
                     value={name}
                     className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold shadow-inner"
                     onChange={(e) => setName(e.target.value)}
                   />
                   {/* On ne demande l'email que si l'identifiant de l'étape 1 n'était pas un email */}
                   {!isEmailSaisi && (
                      <input 
                        type="email" placeholder="Ton email" required
                        value={email}
                        className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold shadow-inner"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                   )}
                 </>
               )}
               <input 
                 type="password" placeholder="Ton mot de passe" required
                 value={password}
                 className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold shadow-inner"
                 onChange={(e) => setPassword(e.target.value)}
               />
               <button type="button" onClick={() => setStep('PHONE_ONLY')} className="text-[10px] uppercase font-black text-gray-400 w-full text-center">Modifier mes infos</button>
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
            type="button"
            className="w-full bg-gray-200 text-gray-900 py-6 rounded-[25px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
          >
            ANNULER
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppCapture;
