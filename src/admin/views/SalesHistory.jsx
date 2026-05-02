import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get('/coach/sales-history');
        setSales(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSales();
  }, []);

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase">Lecture du Grand Livre...</div>;

  return (
    <div className="pb-20 animate-fadeIn text-left">
      <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-gray-900">
        Historique des Ventes
      </h1>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Produit</th>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Client</th>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Montant</th>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-center">Statut</th>
                <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sales.length > 0 ? sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50/30 transition-all">
                  {/* PRODUIT */}
                  <td className="p-6 flex items-center gap-3">
                    <img src={sale.courseId?.thumbnail} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <span className="font-bold text-gray-900 text-xs truncate max-w-[150px]">
                        {sale.courseId?.title || 'Cours supprimé'}
                    </span>
                  </td>
                  
                  {/* CLIENT */}
                  <td className="p-6">
                    <p className="text-xs font-black text-gray-800 uppercase italic">{sale.customerId?.name || 'Anonyme'}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{sale.customerId?.phoneNumber || '—'}</p>
                  </td>

                  {/* MONTANT */}
                  <td className="p-6 font-black text-gray-900 text-sm">
                    {sale.amount?.toLocaleString()} <small className="text-[10px]">CFA</small>
                  </td>

                  {/* STATUT */}
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      sale.status === 'approved' ? 'bg-green-100 text-green-600' : 
                      sale.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {sale.status === 'approved' ? 'Reçu' : sale.status === 'pending' ? 'En attente' : 'Échoué'}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-6 text-right text-[10px] font-bold text-gray-400 uppercase">
                    {new Date(sale.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-20 text-center text-gray-300 font-black uppercase text-[10px]">Aucune transaction enregistrée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
