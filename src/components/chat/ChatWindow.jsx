// src/components/chat/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ currentChannel }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Saka Coach", text: "Bienvenue dans le salon d'entraide ! 👗", isCoach: true, time: "10:00" },
    { id: 1, sender: "Saka Coach", text: "Bienvenue dans le salon d'entraide ! 👗", isCoach: true, time: "10:00" },
    { id: 1, sender: "Saka Coach", text: "Bienvenue dans le salon d'entraide ! 👗", isCoach: true, time: "10:00" },
    { id: 1, sender: "Saka Coach", text: "Bienvenue dans le salon d'entraide ! 👗", isCoach: true, time: "10:00" },
    { id: 1, sender: "Saka Coach", text: "Bienvenue dans le salon d'entraide ! 👗", isCoach: true, time: "10:00" },
    { id: 1, sender: "Saka Coach", text: "Bienvenue dans le salon d'entraide ! 👗", isCoach: true, time: "10:00" },
    { id: 2, sender: "Aïcha", text: "Merci ! Quelqu'un a testé le module 3 ?", isMine: false, time: "10:02" },
    { id: 2, sender: "Aïcha", text: "Merci ! Quelqu'un a testé le module 3 ?", isMine: false, time: "10:02" },
    { id: 2, sender: "Aïcha", text: "Merci ! Quelqu'un a testé le module 3 ?", isMine: false, time: "10:02" },
    { id: 2, sender: "Aïcha", text: "Merci ! Quelqu'un a testé le module 3 ?", isMine: false, time: "10:02" },
    { id: 3, sender: "Moi", text: "Oui, c'est une tuerie ! J'ai posté ma réussite dans le feed.", isMine: true, time: "10:05" },
    { id: 3, sender: "Moi", text: "Oui, c'est une tuerie ! J'ai posté ma réussite dans le feed.", isMine: true, time: "10:05" },
    { id: 3, sender: "Moi", text: "Oui, c'est une tuerie ! J'ai posté ma réussite dans le feed.", isMine: true, time: "10:05" },
    { id: 3, sender: "Moi", text: "Oui, c'est une tuerie ! J'ai posté ma réussite dans le feed.", isMine: true, time: "10:05" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();
    const fileRef = useRef(null); // Pour déclencher l'ouverture des fichiers (📷/🎥)
    const [msg, setMsg] = useState(''); // Pour le texte
    const [tempMedia, setTempMedia] = useState(null); // Pour l'aperçu avant envoi


const [showEmoji, setShowEmoji] = useState(false);

// const onEmojiClick = (emojiData) => {
//   setMsg(prev => prev + emojiData.emoji); // On ajoute l'émoji à la suite du texte
//   setShowEmoji(false); // On referme après le choix
// };

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (

    
    <div className="flex flex-col max-h-[600px] md:h-[500px]  bg-white rounded-[40px] shadow-2xl shadow-purple-100/20 border border-purple-50 overflow-hidden animate-fadeIn">
      {/* HEADER MOBILE (Visible uniquement sur Mobile < 1024px) */}
            
            {/* 1. HEADER DU SALON */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-xl shadow-lg">
                    💬
                </div>
                <div className="text-left">
                    <h3 className="text-sm font-black uppercase italic tracking-tighter text-gray-900">
                    # {currentChannel || "Salon Entraide"}
                    </h3>
                    <p className="text-[7px] font-bold text-green-500 uppercase tracking-widest animate-pulse">
                    12 personnes en ligne 🟢
                    </p>
                </div>
                </div>
            </div>

            {/* 2. ZONE DES MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gray-50/30">
                {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} animate-slideIn`}>
                    <div className={`max-w-[80%] space-y-1 ${msg.isMine ? 'text-right' : 'text-left'}`}>
                    
                    {!msg.isMine && (
                        <span className={`text-[9px] font-black uppercase italic ml-2 ${msg.isCoach ? 'text-orange-500' : 'text-purple-400'}`}>
                        {msg.isCoach ? '👑 ' : ''}{msg.sender}
                        </span>
                    )}

                    <div className={`p-4 rounded-[25px] text-xs font-medium shadow-sm transition-all ${
                        msg.isMine 
                        ? 'bg-gray-900 text-white rounded-tr-none' 
                        : msg.isCoach 
                        ? 'bg-orange-50 text-orange-900 border border-orange-100 rounded-tl-none'
                        : 'bg-white text-gray-700 border border-purple-100 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                    
                    <p className="text-[8px] font-bold text-gray-300 uppercase px-2 italic">{msg.time}</p>
                    </div>
                </div>
                ))}
                <div ref={scrollRef} />
            </div>

                {/* 3. BARRE DE SAISIE */}
                {/* --- 3. BARRE DE SAISIE (L'INPUT SOUVERAIN) --- */}
            {/* --- 3. BARRE DE SAISIE (CORRIGÉE & ALIGNÉE) --- */}
                <div className="p-6 bg-white border-t border-gray-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                
                {/* APERÇU MÉDIA (S'affiche au-dessus de la barre) */}
                {tempMedia && (
                    <div className="mb-3 relative w-20 h-20 rounded-[20px] overflow-hidden border-2 border-purple-500 animate-slideUp">
                    <img src={tempMedia} className="w-full h-full object-cover" alt="Pre-upload" />
                    <button 
                        onClick={() => setTempMedia(null)} 
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                    >
                        ✕
                    </button>
                    </div>
                )}

                {/* BARRE GRISE PRINCIPALE */}
                <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-[30px] border border-purple-50 focus-within:ring-2 focus-within:ring-purple-100 transition-all relative">
                    
                    {/* ZONE ÉMOJI (Intégrée proprement) */}
                    <div className="relative flex items-center">
                    <button 
                        type="button" 
                        onClick={() => setShowEmoji(!showEmoji)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${showEmoji ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
                    >
                        😊
                    </button>

                    {showEmoji && (
                        <div className="absolute bottom-14 left-0 z-50 shadow-2xl animate-slideUp">
                        <EmojiPicker 
                            onEmojiClick={(emojiData) => {
                            setMsg(prev => prev + emojiData.emoji);
                            setShowEmoji(false);
                            }} 
                            theme="light"
                            width={280}
                            height={350}
                            skinTonesDisabled
                        />
                        </div>
                    )}
                    </div>

                    {/* BOUTON MÉDIA (Trombone 📎) */}
                    <button 
                    type="button" 
                    onClick={() => fileRef.current.click()}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-white transition-all text-gray-400 hover:text-purple-600"
                    >
                    📎
                    </button>
                    <input 
                    type="file" 
                    ref={fileRef} 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if(file) setTempMedia(URL.createObjectURL(file)); 
                    }} 
                    />

                    {/* ZONE DE TEXTE (Prend tout l'espace restant) */}
                    <input 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && console.log("Envoi !")}
                    placeholder="Écris ton message ici..." 
                    className="flex-1 bg-transparent py-3 px-2 text-xs font-bold outline-none italic text-gray-700"
                    />

                    {/* BOUTON ENVOYER (Fusée 🚀) */}
                    <button className="bg-gray-900 text-white w-11 h-11 rounded-full flex items-center justify-center shadow-xl hover:bg-purple-600 transition-all active:scale-90 group">
                    <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">🚀</span>
                    </button>
                </div>
                </div>
    </div>
  );
};

export default ChatWindow;