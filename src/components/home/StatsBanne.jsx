// src/components/home/StatsBanner.jsx
const StatsBanner = () => {
  const stats = [
    { label: 'Membres Actifs', value: '12.4K', icon: '👤' },
    { label: 'Réussites Partagées', value: '890+', icon: '✨' },
    { label: 'Coachs Certifiés', value: '12', icon: '👑' },
    { label: 'Pays Connectés', value: '05', icon: '🌍' },
  ];

  return (
    <div className="bg-gray-950 py-10 border-y border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
            <div className="text-left">
              <p className="text-2xl font-black italic text-white leading-none tracking-tighter">{stat.value}</p>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1 italic">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBanner;