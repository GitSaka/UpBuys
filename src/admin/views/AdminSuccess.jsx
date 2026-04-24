import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const AdminSuccess = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  
  // L'URL réelle que les clients utiliseront
  const publicUrl = `${window.location.origin}/formation/${courseId}`;

  useEffect(() => {
    // 🎊 Explosion de joie à l'arrivée sur la page
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9333ea', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9333ea', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

 const copyToClipboard = () => {
  navigator.clipboard.writeText(publicUrl);
  setCopied(true); // Active l'état "copié"
  
  // On remet le bouton à l'état normal après 2 secondes
  setTimeout(() => {
    setCopied(false);
  }, 2000);
};

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-left">
      <div className="max-w-xl w-full">
        {/* Icône de Couronne Royale */}
        <div className="w-24 h-24 bg-purple-600 rounded-[32px] flex items-center justify-center text-4xl shadow-2xl shadow-purple-200 mb-8 animate-bounce">
          👑
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-4 leading-none">
          TON EMPIRE EST <span className="text-purple-600">EN LIGNE.</span>
        </h1>
        
        <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed">
          Félicitations ! Ta formation est maintenant accessible. Voici le lien magique à partager avec ton audience.
        </p>

        {/* Bloc du Lien Magique */}
        <div className="bg-gray-50 border border-gray-100 p-2 rounded-[32px] flex items-center justify-between mb-8">
          <div className="px-6 overflow-hidden">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lien de ta boutique</p>
            <p className="text-sm font-bold text-purple-600 truncate">{publicUrl}</p>
          </div>
          <button 
  onClick={copyToClipboard}
  className={`p-4 rounded-3xl font-black text-xs transition-all duration-300 min-w-[100px] flex items-center justify-center gap-2 ${
    copied 
    ? 'bg-green-100 text-green-600' // Vert si copié
    : 'bg-white text-gray-900 shadow-sm hover:bg-gray-900 hover:text-white' // Normal
  }`}
>
  {copied ? (
    <>
      <span>✅</span> COPIÉ
    </>
  ) : (
    <>
      COPIER
    </>
  )}
</button>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.open(publicUrl, '_blank')}
            className="flex-1 bg-gray-900 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-gray-200 hover:bg-purple-600 transition-all"
          >
            👁️ Voir ma page détails
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex-1 bg-gray-100 text-gray-500 p-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all"
          >
            Retour Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSuccess;