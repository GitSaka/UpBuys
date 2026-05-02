import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const SuccessPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, approved, error
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    let interval;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/payments/verify-status/${transactionId}`);
        
        if (res.data.status === 'approved') {
          setCourseData(res.data.course);
          setStatus('approved');
          clearInterval(interval); // Stop quand c'est bon
        }
      } catch (err) {
        console.error("Erreur de vérification", err);
        // On ne coupe pas l'intervalle ici, on laisse retenter
      }
    };

    // On vérifie immédiatement, puis toutes les 3 secondes
    checkStatus();
    interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden text-left">
      <Navbar />

      <main className="pt-32 pb-20 px-6 flex flex-col items-center text-center max-w-2xl mx-auto">
        
        {/* 1. L'ICÔNE DE VICTOIRE */}
        <div className="relative mb-10">
          <div className={`${status === 'approved' ? 'bg-green-50' : 'bg-purple-50'} w-24 h-24 rounded-[35px] flex items-center justify-center text-4xl shadow-2xl transition-colors duration-500 animate-bounce`}>
            {status === 'approved' ? '👑' : '🎉'}
          </div>
          {status === 'approved' && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white text-[10px] font-black">
              ✓
            </div>
          )}
        </div>

        {/* 2. LE MESSAGE SOUVERAIN */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-gray-900">
            {status === 'approved' ? 'Accès Débloqué' : 'Félicitations'} <br /> 
            <span className="text-purple-600">Maître en Devenir</span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">
            {status === 'approved' ? 'Bienvenue dans votre nouvel empire' : 'Sécurisation de votre investissement...'}
          </p>
        </div>

        {/* 3. L'ÉTAT DE VÉRIFICATION / BOUTON FINAL */}
        <div className="mt-16 w-full">
          {status === 'verifying' ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest animate-pulse italic">
                Nous confirmons la réception de vos fonds...
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 text-left flex items-center gap-6">
                <img 
                    src={courseData?.thumbnail} 
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" 
                    alt="Formation"
                />
                <div>
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-1 italic">Formation active :</p>
                    <h2 className="text-sm font-black text-gray-900 uppercase italic leading-tight">{courseData?.title}</h2>
                </div>
              </div>

              {/* BOUTON D'ACCÈS FINAL */}
              <button 
                onClick={() => {
                    const firstLessonId = courseData?.lessons[0]?._id || courseData?.lessons[0];
                    navigate(`/formation/${courseData?._id}/${firstLessonId}`);
                }} 
                className="w-full bg-gray-900 text-white py-6 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-200 hover:bg-purple-600 transition-all active:scale-95"
              >
                Entrer dans l'Académie →
              </button>

              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                Un reçu a été envoyé à votre adresse email.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* DÉCORATION DE FOND */}
      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-purple-50 rounded-full blur-[120px] opacity-60"></div>
    </div>
  );
};

export default SuccessPage;
