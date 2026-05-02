import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const SuperAdminPayouts = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null); // Pour le modal de validation
  const [txId, setTxId] = useState("");

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/all-withdrawals');
      setRequests(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleConfirmPayment = async () => {
    try {
      await api.put(`/admin/validate-withdrawal/${selectedRequest._id}`, {
        transactionId: txId,
        adminNote: "Transfert effectué avec succès."
      });
      alert("Statut mis à jour !");
      setSelectedRequest(null);
      setTxId("");
      fetchRequests();
    } catch (err) { alert("Erreur lors de la validation"+err); }
  };

  if (loading) return <div className="p-20 text-center font-black">CHARGEMENT DES DEMANDES...</div>;

  return (
    <div className="p-10 text-left">
      <h1 className="text-3xl font-black uppercase italic mb-10">Gestion des Retraits 🏦</h1>

      <div className="bg-white rounded-[30px] border border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Coach / Empire</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Montant</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Méthode</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Numéro</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400">Statut</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-6">
                  <p className="font-black text-gray-900 uppercase italic text-sm">{req.coachId?.storeName}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{req.coachId?.email}</p>
                </td>
                <td className="p-6 font-black text-slate-900">{req.amount?.toLocaleString()} CFA</td>
                <td className="p-6 font-bold text-blue-600">{req.paymentMethod}</td>
                <td className="p-6 font-black tracking-widest text-xs">{req.phoneNumber}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    req.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {req.status === 'pending' ? 'À PAYER' : 'PAYÉ'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  {req.status === 'pending' && (
                    <button 
                      onClick={() => setSelectedRequest(req)}
                      className="bg-gray-900 text-white px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-600 transition-all"
                    >
                      Valider le paiement
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE VALIDATION */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl text-center border-t-8 border-green-500">
            <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-4">Confirmer le transfert</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Tu vas marquer la demande de <span className="font-black text-gray-900">{selectedRequest.amount} CFA</span> pour <span className="font-black text-gray-900">{selectedRequest.coachId?.storeName}</span> comme payée.
            </p>
            
            <div className="text-left mb-8">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block">ID de Transaction (MTN/Orange/Wave)</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold border border-gray-100 focus:border-green-500 transition-all"
                placeholder="Ex: 1234567890"
                value={txId} onChange={(e) => setTxId(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmPayment}
                disabled={!txId}
                className="w-full bg-green-600 text-white py-6 rounded-[25px] font-black uppercase text-[10px] tracking-widest shadow-xl disabled:bg-gray-200"
              >
                Confirmer le paiement maintenant
              </button>
              <button onClick={() => setSelectedRequest(null)} className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPayouts;
