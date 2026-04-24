import React, { useState } from 'react';

// Données fictives des fans capturés
const MOCK_FANS = [
  { id: 1, name: "Mariam Koné", phone: "+225 0708091011", country: "Côte d'Ivoire", date: "09 Janv 2026", status: "Client", spent: "25.000" },
  { id: 2, name: "Jean Dupont", phone: "+33 612345678", country: "France (Diaspora)", date: "08 Janv 2026", status: "Prospect", spent: "0" },
  { id: 3, name: "Ousmane Diop", phone: "+221 776543210", country: "Sénégal", date: "05 Janv 2026", status: "Client", spent: "15.000" },
];

const Audience = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [BroadcastMessage,setBroadcastMessage] = useState("")

  const [isSending, setIsSending] = useState(false); // Pour l'effet de chargement

//   console.log(BroadcastMessage)
  console.log(searchTerm)

//   Fonction pour envoyer un WhatsApp direct
 const openWhatsApp = (phone) => {
  const cleanPhone = phone.replace(/\s+/g, '');
  window.open(`https://wa.me/${cleanPhone}`, '_blank');
};

 

  return (
    <div className="animate-fadeIn">
      {/* 1. HEADER & ACTION D'URGENCE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="text-left">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Mon Audience Souveraine 👥</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Tu possèdes {MOCK_FANS.length} contacts directs</p>
        </div>

        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-3"
          onClick={() => setIsAlertOpen(true)}
        >
          <span className="text-lg animate-pulse">🔴</span> Diffuser une Alerte Urgence
        </button>
      </div>

      {/* 2. STATS RAPIDES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Fans</p>
          <p className="text-xl font-black text-gray-900">1,240</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Taux Conversion</p>
          <p className="text-xl font-black text-green-500">8.4%</p>
        </div>
        {/* Ajoute d'autres stats ici si besoin */}
      </div>

      {/* 3. BARRE DE RECHERCHE */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher un nom ou un pays..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 4. LISTE DE L'AUDIENCE */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-left">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Nom / Contact</th>
                <th className="hidden md:table-cell p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Localisation</th>
                <th className="hidden md:table-cell p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Date d'inscription</th>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_FANS.map((fan) => (
                <tr key={fan.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-sm">{fan.name}</span>
                      <span className="text-xs text-gray-400 font-medium">{fan.phone}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell p-6 text-xs font-bold text-gray-500 italic">
                    📍 {fan.country}
                  </td>
                  <td className="hidden md:table-cell p-6 text-xs font-medium text-gray-400">
                    {fan.date}
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      fan.status === 'Client' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {fan.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => openWhatsApp(fan.phone)}
                      className="bg-green-100 text-green-600 p-3 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="Contacter sur WhatsApp"
                    >
                      <span className="text-sm">💬</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE SÉCURITÉ : ALERTE URGENCE */}
        {isAlertOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl border border-red-100 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-pulse">
                🚨
            </div>
            <div className="space-y-2 mb-6 text-left">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                    Ton Message d'Urgence :
                </label>
                <textarea 
                    className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl outline-none text-sm font-medium text-red-900"
                    rows="3"
                    placeholder="Ex: Mon compte TikTok a sauté ! Retrouvez-moi ici..."
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                ></textarea>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">
                Action Irréversible
            </h2>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Tu es sur le point d'envoyer une notification WhatsApp à tes <span className="font-black text-red-600">{MOCK_FANS.length} contacts</span>. 
                Utilise cette fonction uniquement si tes réseaux sociaux sont menacés.
            </p>

            <div className="flex flex-col gap-3">
                <button 
                onClick={() => {
                    setIsSending(true);
                    // Simuler l'envoi vers le Backend
                    setTimeout(() => {
                    setIsSending(false);
                    setIsAlertOpen(false);
                
                    alert("✅ Alerte envoyée avec succès à toute la base !");
                    }, 3000);
                }}
                disabled={isSending}
                className={`w-full p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all
                    ${isSending ? 'bg-gray-100 text-gray-400' : 'bg-red-600 text-white shadow-lg shadow-red-200 active:scale-95'}
                `}
                >
                {isSending ? 'Envoi en cours...' : 'Oui, lancer la diffusion'}
                </button>

                
                <button 
                onClick={() => setIsAlertOpen(false)}
                className="w-full p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                Annuler l'action
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default Audience;