// src/components/chat/ChatLayout.jsx
import React, { useState } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import Navbar from '../components/layout/Navbar';

const ChatLayout = () => {
  const [activeChannel, setActiveChannel] = useState('Entraide Couture');

  return (
    <>
    <Navbar/>
   <div className="h-[calc(100vh-73px)]  bg-gray-50/50 p-4 lg:p-8 italic-none font-sans">
        
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
        
        {/* ⬅️ COLONNE GAUCHE : LISTE DES SALONS (4/12) */}
        <aside className="hidden lg:block lg:col-span-4 h-full">
          <ChatSidebar 
            activeChannel={activeChannel} 
            onSelect={(name) => setActiveChannel(name)} 
          />
        </aside>

        {/* 🎯 COLONNE DROITE : LA DISCUSSION (8/12) */}
        <main className="lg:col-span-8 h-full">
          <ChatWindow currentChannel={activeChannel} />
        </main>

      </div>
    </div>
    </>
  );
};

export default ChatLayout;