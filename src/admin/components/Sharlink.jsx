import React, { useState } from 'react';

const ShareLink = ({ slug}) => {
  const [copied, setCopied] = useState(false);
  
  // Génération dynamique du lien selon l'utilisateur connecté
  const shareableLink = `https://up-buys.vercel.app/empire/profile/coach/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareableLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset après 2s
  };

  return (
    <div className="bg-purple-50 border border-purple-100 p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4 mb-10 animate-fadeIn">
      <div className="text-left">
        <h3 className="text-[10px] font-black uppercase text-purple-600 tracking-[0.2em] mb-1">Ton lien de profil est prêt 🚀</h3>
        <p className="text-sm font-bold text-gray-900 italic">{shareableLink}</p>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <button 
          onClick={copyToClipboard}
          className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-purple-700'}`}
        >
          {copied ? "✅ Copié !" : "🔗 Copier le lien"}
        </button>
        
        <button 
          onClick={() => window.open(`${shareableLink}`, '_blank')}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
        >
          👁️ Voir ma page
        </button>
      </div>
    </div>
  );
};

export default ShareLink