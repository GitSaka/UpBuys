import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Wallet = () => {
  const [stats, setStats] = useState({ totalEarnings: 0, availableBalance: 0, pendingWithdrawals: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour le formulaire
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [resStats, resHistory] = await Promise.all([
        api.get('/coach/wallet/stats'),
        api.get('/coach/wallet/history')
      ]);
      setStats(resStats.data.data);
      setHistory(resHistory.data.data);
    } catch (err) {
      console.error("Erreur Wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/coach/wallet/withdraw', {
        amount: Number(amount),
        method,
        phoneNumber: phone
      });
      setMessage({ type: 'success', text: res.data.message });
      setAmount('');
      fetchWalletData(); // Actualiser les soldes
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data.message || "Erreur lors de la demande" });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">OUVERTURE DU COFFRE-FORT...</div>;

  return (
    <div className="pb-20 animate-fadeIn text-left">
      <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Mon Portefeuille</h1>

      {/* --- ZONE A : LES SOLDES (CARTES DE LUXE) --- */}
      {/* --- ZONE A : L'ÉTAT DES COFFRES (Version Luxe) --- */}
            <div className="bg-[#f8fbff]  p-3 mb-12 border border-blue-50/50 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 items-center">
                
                {/* 1. SOLDE DISPONIBLE (L'élément Maître) */}
                <div className="text-left md:px-8">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Retirable immédiatement
                </p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">
                    {stats.availableBalance?.toLocaleString()}
                    </h2>
                    <span className="text-sm font-black text-slate-400 uppercase italic">CFA</span>
                </div>
                </div>

                {/* SÉPARATEUR VERTICAL (Visible uniquement sur Desktop) */}
                <div className="hidden md:block h-16 w-[1px] bg-slate-200/60 mx-auto"></div>

                {/* 2. TOTAL ENCAISSÉ */}
                <div className="text-left md:px-8">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    Volume total de l'Empire
                </p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-slate-700 tracking-tighter">
                    {stats.totalEarnings?.toLocaleString()}
                    </h2>
                    <span className="text-[10px] font-black text-slate-300">CFA</span>
                </div>
                </div>

                {/* SÉPARATEUR VERTICAL */}
                <div className="hidden md:block h-16 w-[1px] bg-slate-200/60 mx-auto"></div>

                {/* 3. EN ATTENTE */}
                <div className="text-left md:px-8">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 mb-3">
                    Traitement en cours
                </p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-orange-600/80 tracking-tighter">
                     {(stats.pendingWithdrawals || 0).toLocaleString()}
                    </h2>
                    <span className="text-[10px] font-black text-orange-200">CFA</span>
                </div>
                </div>

            </div>
            </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* --- ZONE B : FORMULAIRE DE RETRAIT --- */}
        <section className="bg-white p-10 border border-gray-100 ">
          <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">↓</span>
            Demander un retrait
          </h3>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl font-bold text-xs text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Montant à retirer (CFA)</label>
              <input 
                type="number" required min="5000"
                className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold border border-transparent focus:border-purple-200 transition-all"
                placeholder="Ex: 50000"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Opérateur</label>
                <select 
                  className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold cursor-pointer"
                  value={method} onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="MTN">MTN Money</option>
                  <option value="Orange">Orange Money</option>
                  <option value="Moov">Moov Money</option>
                  <option value="Wave">Wave</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Numéro de réception</label>
                <input 
                  type="tel" required
                  className="w-full bg-gray-50 p-5 rounded-[25px] outline-none font-bold border border-transparent focus:border-purple-200 transition-all"
                  placeholder="07000000"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-6 rounded-[25px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all disabled:bg-gray-300"
            >
              {isSubmitting ? 'Traitement...' : 'Lancer la demande de retrait →'}
            </button>
          </form>
        </section>

        {/* --- ZONE C : HISTORIQUE DES TRANSACTIONS --- */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase italic mb-8">Dernières demandes</h3>
          
          <div className="space-y-4">
            {history.length > 0 ? history.map((item) => (
              <div key={item._id} className="bg-white p-6 border border-gray-50 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] ${
                    item.status === 'completed' ? 'bg-green-100 text-green-600' : 
                    item.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.method}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 italic text-sm">{item.amount?.toLocaleString()} CFA</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.status === 'completed' ? 'bg-green-100 text-green-600' : 
                  item.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {item.status === 'pending' ? 'En cours' : item.status === 'completed' ? 'Payé' : 'Refusé'}
                </span>
              </div>
            )) : (
              <div className="py-20 text-center text-gray-300 font-black uppercase text-[10px] tracking-widest">
                Aucun retrait effectué 🕯️
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Wallet;
