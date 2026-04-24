import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const SuccessPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // 🕵️ Simule une vérification de 2 secondes auprès du Backend
    const timer = setTimeout(() => {
      setVerifying(false);
      // ICI : On lancera l'appel API réelle vers ton Webhook/Verify
    }, 2500);
    return () => clearTimeout(timer);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-white font-sans italic-none overflow-hidden">
      <Navbar />

      <main className="pt-32 pb-20 px-6 flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* 1. L'ICÔNE DE VICTOIRE (ANIMÉE) */}
        <div className="relative mb-10">
          <div className="w-24 h-24 bg-purple-50 rounded-[35px] flex items-center justify-center text-4xl shadow-2xl shadow-purple-100 animate-bounce">
            🎉
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white text-[10px] font-black">
            ✓
          </div>
        </div>

        {/* 2. LE MESSAGE SOUVERAIN */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-gray-900">
            Félicitations <br /> 
            <span className="text-purple-600">Maître en Devenir</span>
          </h1>
          
          <div className="h-[2px] w-12 bg-gray-100 mx-auto"></div>

          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">
            Votre investissement est validé avec succès
          </p>
        </div>

        {/* 3. L'ÉTAT DE VÉRIFICATION */}
        <div className="mt-16 w-full">
          {verifying ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">
                Sécurisation de votre accès...
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic mb-6">
                  "L'argent est le serviteur de l'esprit. Votre formation est désormais débloquée dans votre espace membre."
                </p>
                <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase text-gray-300">
                  <span className="w-6 h-[1px] bg-gray-200"></span>
                  Réf: {transactionId?.slice(0, 12)}...
                  <span className="w-6 h-[1px] bg-gray-200"></span>
                </div>
              </div>

              {/* BOUTON D'ACCÈS FINAL */}
              <button 
                onClick={() => navigate('/formation/active')} 
                className="w-full bg-gray-900 text-white py-6 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-200 hover:bg-purple-600 transition-all active:scale-95"
              >
                Commencer ma formation →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* DÉCORATION DE FOND (DISCRÈTE) */}
      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-purple-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-purple-50 rounded-full blur-[120px] opacity-60"></div>
    </div>
  );
};

export default SuccessPage;