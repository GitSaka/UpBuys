import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Audience = () => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchAudience = async () => {
      try {
        const res = await api.get('/coach/audience');
        setFans(res.data.data || []);
      } catch (err) {
        console.error("Erreur base audience:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudience();
  }, []);

  // 🔍 LOGIQUE DE RECHERCHE DYNAMIQUE
  const filteredFans = fans.filter(fan => 
    fan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fan.phoneNumber?.includes(searchTerm) ||
    fan.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

//   const getWaLink = (phone) => {
//   if (!phone) return "#";
//   const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
//   return `https://wa.me${cleanPhone}`;
// };

const openWhatsApp = (phone) => 
  { const cleanPhone = phone.replace(/\s+/g, ''); 
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };


  // 📊 CALCUL DES STATS EN TEMPS RÉEL
  const totalClients = fans.filter(f => f.status === 'Client').length;
  const conversionRate = fans.length > 0 ? ((totalClients / fans.length) * 100).toFixed(1) : 0;

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-gray-400 uppercase text-[10px] tracking-widest animate-pulse">Synchronisation de l'Empire...</p>
    </div>
  );

  return (
    <div className="pb-20 animate-fadeIn">
      {/* 1. HEADER & ACTIONS FLASH */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="text-left">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Mon Audience</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">
            {fans.length} Membres • {totalClients} Clients Actifs
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={() => setIsAlertOpen(true)}
                className="flex-1 md:flex-none bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 active:scale-95 transition-all"
            >
                🚨 Alerte Urgence
            </button>
            <button className="flex-1 md:flex-none bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Exporter CSV
            </button>
        </div>
      </header>

      {/* 2. MINI DASHBOARD AUDIENCE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion</p>
          <p className="text-2xl font-black text-green-500">{conversionRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nouveaux (7j)</p>
          <p className="text-2xl font-black text-gray-900">
            {fans.filter(f => new Date(f.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {/* 3. BARRE DE RECHERCHE */}
      <div className="mb-8 text-left">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-5 flex items-center text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Nom, Email ou WhatsApp..." 
            className="w-full pl-14 pr-4 py-5 bg-white border border-gray-100 rounded-[25px] outline-none focus:ring-2 focus:ring-purple-500/20 text-sm font-bold shadow-inner transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 4. TABLEAU D'AUDIENCE */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden shadow-2xl shadow-gray-100/50">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50">
                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Membre</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Statut</th>
                <th className="hidden md:table-cell p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Inscription</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">WhatsApp</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredFans.length > 0 ? filteredFans.map((fan) => (
                <tr key={fan._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-6">
                    <p className="font-black text-gray-900 uppercase italic text-sm">{fan.name || 'Anonyme'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {fan._id.toString().slice(-6)}</p>
                    </td>
                    <td className="p-6">
                    <p className="text-xs font-bold text-gray-700">{fan.email || '—'}</p>
                    <p className="text-xs font-bold text-gray-400">{fan.phoneNumber || '—'}</p>
                    </td>
                    <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        fan.status === 'Client' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                        {fan.status}
                    </span>
                    </td>
                    <td className="hidden md:table-cell p-6 text-xs font-bold text-gray-400">
                    {new Date(fan.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="p-6 text-right">
                    <button onClick={() => openWhatsApp(fan.phoneNumber)} className="bg-green-100 text-green-600 p-3 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Contacter sur WhatsApp" > 
                      <span className="text-sm">💬</span>
                       </button> 
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="p-20 text-center text-gray-300 font-black uppercase text-[10px] tracking-[0.3em]">
                            Aucun résultat trouvé 🕯️
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* MODAL ALERTE URGENCE */}
      {isAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[45px] p-10 shadow-2xl border border-red-50 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-bounce">🚨</div>
            <div className="space-y-2 mb-8 text-left">
              <label className="text-[10px] font-black uppercase text-red-400 ml-2 italic">Ton message d'urgence :</label>
              <textarea 
                className="w-full p-5 bg-red-50/30 border border-red-100 rounded-[25px] outline-none text-sm font-bold text-red-900 placeholder:text-red-200"
                rows="3"
                placeholder="Ex: Mon Instagram a été piraté ! Suivez-moi ici..."
                onChange={(e) => setBroadcastMessage(e.target.value)}
              ></textarea>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2 uppercase italic">Alerte Générale</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-10 font-medium">
              Tu vas envoyer ce message à tes <span className="font-black text-red-600">{fans.length} contacts</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsSending(true);
                  setTimeout(() => {
                    setIsSending(false);
                    setIsAlertOpen(false);
                    alert("✅ Diffusion réussie !");
                  }, 2500);
                }}
                disabled={isSending || !broadcastMessage}
                className={`w-full py-6 rounded-[25px] font-black text-[11px] uppercase tracking-[0.2em] transition-all
                  ${isSending || !broadcastMessage ? 'bg-gray-100 text-gray-400' : 'bg-red-600 text-white shadow-xl shadow-red-200 active:scale-95'}
                `}
              >
                {isSending ? 'Lancement...' : 'Diffuser maintenant'}
              </button>
              <button onClick={() => setIsAlertOpen(false)} className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audience;
