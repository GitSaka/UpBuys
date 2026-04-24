// src/components/chat/ChatSidebar.jsx
import React from 'react';

const ChatSidebar = ({ activeChannel, onSelect }) => {
  const channels = [
    { name: 'Général ✨', members: 450, icon: '🌍' },
  ];

  return (
    <div className="bg-white lg:h-[500px] rounded-[40px]  shadow-2xl shadow-purple-100/20 border border-purple-50 p-8 flex flex-col space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 mb-1">L'Académie</h2>
        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest italic">Salons de discussion</p>
      </div>

      <nav className="space-y-3 overflow-y-auto no-scrollbar">
        {channels.map((ch, i) => (
          <button
            key={i}
            onClick={() => onSelect(ch.name)}
            className={`w-full flex items-center justify-between p-5 rounded-[25px] transition-all duration-300 group ${
              activeChannel === ch.name 
                ? 'bg-gray-900 text-white shadow-xl scale-[1.02]' 
                : 'bg-gray-50 text-gray-500 hover:bg-purple-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{ch.icon}</span>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase italic tracking-tighter leading-none">{ch.name}</p>
                <p className={`text-[8px] font-bold mt-1 ${activeChannel === ch.name ? 'text-purple-300' : 'text-gray-400'}`}>
                   {ch.members} membres
                </p>
              </div>
            </div>
            {activeChannel === ch.name && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />}
          </button>
        ))}
      </nav>

      {/* FOOTER SIDEBAR : INFO UTILISATEUR */}
      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black italic">
          {localStorage.getItem('fanName')?.charAt(0) || 'U'}
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase italic leading-none text-gray-900">
            {localStorage.getItem('fanName') || 'Toi'}
          </p>
          <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Connecté 🟢</p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;