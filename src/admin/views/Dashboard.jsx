import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from "recharts";
import api from '../services/api'
// Données mises à jour avec les formations (LMS)
// const DATA = [
//   { day: 'Lun', sales: 45000, fans: 120, ventes: 5, likes: 45 },
//   { day: 'Mar', sales: 52000, fans: 300, ventes: 8, likes: 88 },
//   { day: 'Mer', sales: 38000, fans: 450, ventes: 4, likes: 32 },
//   { day: 'Jeu', sales: 85000, fans: 800, ventes: 12, likes: 156 },
//   { day: 'Ven', sales: 48000, fans: 950, ventes: 7, likes: 92 },
//   { day: 'Sam', sales: 60000, fans: 1100, ventes: 10, likes: 110 },
//   { day: 'Dim', sales: 55000, fans: 1240, ventes: 9, likes: 105 },
// ];

// Données pour le classement des formations
// const TOP_COURSES = [
//   { name: 'Empire Digital', sales: 25 },
//   { name: 'E-book Money', sales: 12 },
//   { name: 'Coaching VIP', sales: 5 },
// ];

const Dashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
  console.log(stats)
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const res = await api.get('/coach/stats'); // Vérifie bien le nom de ta route
          setStats(res.data.data);
        } catch (err) {
          console.error("Erreur stats:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }, []);

    if (loading) return <div className="p-20 text-center font-black animate-pulse">CHARGEMENT...</div>;

  return (
    <div className="pb-10">
      {/* 1. CARTES DE STATISTIQUES (Mises à jour) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest italic">Total Revenus</p>
          <div className="flex items-end gap-2 text-gray-900">
            <span className="text-2xl font-black italic">
               {stats?.totalRevenue?.toLocaleString()} <small className="text-[10px]">CFA</small>
              </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Total Ventes</p>
          <div className="flex items-end gap-2 text-gray-900">
            <span className="text-2xl font-black">{stats?.totalSales}</span>
            <span className="text-[10px] font-bold text-green-500 mb-1">+8% 🔥</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Total Likes ❤️</p>
          <div className="flex items-end gap-2 text-gray-900">
            <span className="text-2xl font-black">0</span>
            <span className="text-[10px] font-bold text-purple-500 mb-1">Engagement Top</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm text-left">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Fans Privés</p>
          <div className="flex items-end gap-2 text-gray-900">
            <span className="text-2xl font-black">{stats?.totalFans}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRAPHIQUE REVENUS */}
        <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-left">
          <h2 className="text-[10px] font-black uppercase text-gray-900 mb-8 tracking-[0.2em]">💰 Performance Financière (CFA)</h2>
          <div className="h-64 w-full">
            {stats?.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F9FAFB" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#7C3AED" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
             ) : (
            /* 🎯 MESSAGE SI VIDE : Pour faire propre */
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                Aucune vente ces 7 derniers jours 🕯️
              </p>
            </div>
          )}
          </div>
        </section>

        {/* GRAPHIQUE TOP PRODUITS (Nouveau !) */}
        <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-left">
          <h2 className="text-[10px] font-black uppercase text-gray-900 mb-8 tracking-[0.2em]">🏆 Top Formations (Ventes)</h2>
          <div className="h-64 w-full">
             {stats?.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats?.topCourses} margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'black', fill: '#111827' }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="sales" fill="#7C3AED" radius={[0, 10, 10, 0]} barSize={20}>
                  {stats?.topCourses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#7C3AED' : '#DDD6FE'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : (
            /* 🎯 MESSAGE SI VIDE : Pour faire propre */
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                Aucune vente ces 7 derniers jours 🕯️
              </p>
            </div>
          )}
          </div>
        </section>
      </div>

      {/* GRAPHIQUE ENGAGEMENT LIKES ❤️ */}
      {/* <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mt-8 text-left">
        <h2 className="text-[10px] font-black uppercase text-gray-900 mb-8 tracking-[0.2em]">❤️ Engagement (Likes reçus par jour)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }} />
              <Tooltip />
              <Line type="stepAfter" dataKey="likes" stroke="#EF4444" strokeWidth={4} dot={{ r: 4, fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section> */}
      {/* GRAPHIQUE 4 : CROISSANCE DE LA BASE WHATSAPP (À ajouter à la fin) */}
    {/* <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mt-8 text-left">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[10px] font-black uppercase text-gray-900 tracking-[0.2em]">📈 Base de Données WhatsApp (Capture de Leads)</h2>
        <span className="text-[10px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full italic">Total : 1.240 numéros</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <defs>
              <linearGradient id="colorWhatsApp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }} />
            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
            <Area 
              type="monotone" 
              dataKey="fans" // On utilise la clé 'fans' de tes données
              stroke="#22C55E" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorWhatsApp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section> */}
    </div>
  );
};

export default Dashboard;