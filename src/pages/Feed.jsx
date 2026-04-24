import React, { useState } from 'react';

// N'oublie pas d'importer tes MOCK_POSTS ou de les laisser ici pour le test
const MOCK_POSTS = [
  {
    id: 1,
    type: "video",
    url: "assets.mixkit.co",
    caption: "3 secrets pour vendre sur WhatsApp ! 🚀",
    fullText: "Voici la méthode complète pour 2026 : \n1. Utilisez le statut pour créer l'urgence. \n2. Répondez aux objections en audio. \n3. Automatisez vos paiements avec votre propre Hub. Ne dépendez plus de l'algorithme !",
    source: "TikTok"
  },
  {
    id: 2,
    type: "image",
    url: "./App.jpg",
    caption: "Le mindset est la clé du succès. 💎",
    fullText: "Le succès ne vient pas de ce que vous faites occasionnellement, mais de ce que vous faites avec persévérance. Sur ce Hub, je partage mon quotidien de femme d'affaires pour vous inspirer.",
    source: "Instagram"
  },
  {
    id: 3,
    type: "image",
    url: "./App.jpg",
    caption: "Le mindse 💎",
    fullText: "Le succès ne vient pas de ce que vous faites occasionnellement, mais de ce que vous faites avec persévérance. Sur ce Hub, je partage mon quotidien de femme d'affaires pour vous inspirer.",
    source: "Instagram"
  },
  {
    id: 4,
    type: "text",
    content: "Une élève a fait sa première vente grâce à mon site. Fier d'elle ! ✍️",
    caption: "Témoignage ",
    fullText: "Félicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveraineté numérique change des vies en Afrique.Félicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souvevFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souve",
    source: "Facebook"
  },

  {
    id: 5,
    type: "text",
    content: "Une élève a fait sa première vente grâce à mon site. Fier d'elle ! ✍️",
    caption: "Témoignage du jour",
    fullText: "Félicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveraineté numérique change des vies en Afrique.Félicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souvevFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souveFélicitations à Mariam qui a réussi à exporter ses produits depuis son Hub. C'est la preuve que la souve",
    source: "Facebook"
  }
];

const Feed = ({ onBack }) => {
  const [expandedId, setExpandedId] = useState(null);
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

const togglePlay = () => {
  if (videoRef.current.paused) {
    videoRef.current.play();
    setIsPlaying(true);
  } else {
    videoRef.current.pause();
    setIsPlaying(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Header fixe */}
      <div className="fixed top-0 w-full z-40 flex justify-between p-5 items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onBack} className="text-white text-2xl">←</button>
        <span className="font-bold tracking-widest text-xs uppercase text-purple-400">Flux Souverain</span>
        <div className="w-8"></div>
      </div>

      {/* Container avec Snap Scroll */}
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="h-screen w-full relative snap-start flex items-center justify-center bg-gray-900">
              
            {/* RENDU MEDIA */}
            {post.type === "video" && (
                <div className="relative h-full w-full" onClick={togglePlay}>
                  <video 
                    ref={videoRef}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" 
                    muted 
                    autoPlay 
                    loop 
                    playsInline 
                    className="h-full w-full object-contain bg-black"
                  />
                  
                  {/* Optionnel : Affiche une icône Play au milieu si c'est en pause */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="text-6xl opacity-50 text-white">▶️</span>
                    </div>
                  )}
                </div>
            )}
            {post.type === "image" && (
              <img src={post.url} alt="Post" className=" max-h-full max-w-full objet-contain mx-auto opacity-70" />
            )}
            {post.type === "text" && (
              <div className="p-8 text-center bg-gradient-to-br from-purple-900/40 to-black w-full h-full flex flex-col justify-center items-center">
                {
                  expandedId === post.id ? null : <p className="text-xl italic leading-relaxed px-4">"{post.content}"</p>
                }
                
              </div>
            )}

            {/* OVERLAY DYNAMIQUE CORRIGÉ */}
            <div 
              className={`absolute scrollbar-hide flex flex-col max-h-[65%] w-full overflow-hidden bottom-0 pr-16 md:w-[80%] p-6 transition-all duration-500 bg-gradient-to-t from-black via-black/90 to-transparent 
              ${expandedId === post.id ? 'h-[65%] overflow-y-auto' : 'h-auto pb-12'}`}
            >
              <div className="flex justify-between items-start gap-4">
                
                {/* TEXTE (Cliquable pour agrandir) */}
                <div 
                  className="flex-1  shrink-0  cursor-pointer" 
                  onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                >
                  <span className="bg-purple-600 sticky top-[-14px] bg-black z-10  text-[10px] font-bold px-2 py-1 rounded mb-3 inline-block uppercase">
                    {post.source}
                  </span>

                  {/* Si non-déplié : Texte court */}
                  {expandedId !== post.id ? (
                    <div> {
                        
                      }
                      <p className="text-sm overflow-y-auto flex-1 font-medium line-clamp-2 leading-snug">
                        {post.caption}
                      </p>
                      <span className="text-purple-400 text-[10px] font-bold mt-1 block uppercase tracking-tighter italic">
                        ... Lire la suite
                      </span>
                    </div>
                  ) : (
                    /* Si déplié : Tout le texte */
                    <div className="animate-fadeIn">
                      <h3 className="font-bold text-lg mb-3">{post.caption}</h3>
                      <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-line">
                        {post.fullText}
                      </p>
                      <button className="mt-4 text-purple-400 text-xs font-bold underline uppercase">
                        Réduire
                      </button>
                    </div>
                  )}
                </div>

                

              </div>
             
            </div>
             {/* BOUTONS D'ACTIONS (Toujours visibles et agencés) */}
              <div className="absolute right-4 z-50  bottom-20 flex flex-col gap- items-center">
                  <div className="flex flex-col active:scale-75 items-center">
                    <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 active:scale-90 transition">
                      <span className="text-xl leading-none">❤️</span>
                    </button>
                    <span className="text-[10px] mt-1 font-bold">1.2K</span>
                  </div>

                  <div className="flex flex-col active:scale-75 items-center">
                    <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 active:scale-90 transition">
                      <span className="text-xl leading-none">💬</span>
                    </button>
                    <span className="text-[10px] mt-1 font-bold">avis</span>
                  </div>

                  <div className="flex flex-col active:scale-75 items-center">
                    <button className="bg-green-500 p-3 rounded-full shadow-lg shadow-green-900/50 active:scale-90 transition">
                      <span className="text-xl leading-none text-white font-bold">🔔</span>
                    </button>
                    <span className="text-[10px] mt-1 font-bold text-green-500 uppercase tracking-tighter">Partager</span>
                  </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;