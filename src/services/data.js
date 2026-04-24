export const MOCK_COURSES = [
  {
    _id: "1",
    title: "Empire Digital : De 0 à 1 Million avec ton Smartphone",
    thumbnail: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    category: "Formation",
    price: 15000,
    comparePrice: 25000,
    salesCount: 1250,
    totalLikes: 850,
    type:"video",
    descriptionLong: "Apprends les stratégies exactes que j'ai utilisées pour transformer mon audience en une machine à cash. Ce programme contient 12 modules vidéos et des ressources téléchargeables.",
    lessons: [
      { _id: "l1", title: "Introduction à la Souveraineté", isFree: true, type: "video" },
      { _id: "l2", title: "Choisir sa niche rentable", isFree: false, type: "video" },
      { _id: "l3", title: "Configuration du système de paiement", isFree: false, type: "video" }
    ]
  },
  {
    _id: "2",
    title: "E-book : 50 Idées de Business à lancer en Afrique",
    thumbnail: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    category: "E-book",
    price: 5000,
    comparePrice: 7500,
    salesCount: 3400,
    type:"audio",
    totalLikes: 2100,
    descriptionLong: "Le guide ultime pour ceux qui veulent entreprendre sans gros capital. Un condensé de conseils pratiques adaptés aux réalités de nos marchés locaux.",
    lessons: [
      { _id: "l4", title: "Télécharger l'E-book (PDF)", isFree: false, type: "text" }
    ]
  },
  {
    _id: "3",
    title: "Masterclass : Création de Contenu Viral (Reels/TikTok)",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    category: "Coaching",
    price: 30000,
    comparePrice: 45000,
    type:"text",
    salesCount: 450,
    totalLikes: 620,
    descriptionLong: "Je te montre comment je filme, je monte et je publie mes vidéos pour toucher des millions de personnes sans dépenser 1 FCFA en publicité.",
    lessons: [
      { _id: "l5", title: "Le secret de l'algorithme 2026", isFree: true, type: "video" },
      { _id: "l6", title: "Atelier Montage CapCut", isFree: false, type: "video" }
    ]
  }
];


export const FAKE_POSTS = [
  {
    _id: "1",
    authorName: "Aïcha Design",
    content: "Je viens de terminer ma première robe grâce à la formation ! Le patron était super clair. Qu'en pensez-vous ? ✨👗",
    imageUrl: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg", // Une belle image de mode
    likes: [24],
    comments: [
      { author: "Marc K.", text: "Magnifique travail sur les finitions ! 🔥" },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
      { author: "Sonia Luxe", text: "Le choix du tissu est incroyable." },
    ],
    createdAt: "2024-02-13T10:00:00Z"
  },
  {
    _id: "2",
    authorName: "Chef Ibrahim",
    content: "Petit secret pour réussir votre pâte feuilletée : la température du beurre est la clé ! 🥐🔥 #EmpireCulinaire",
    imageUrl: "https://images.pexels.com/photos/4145194/pexels-photo-4145194.jpeg", // Test du lecteur Vidéo (Réel)
    likes: [24],
    comments: [],
    createdAt: "2024-02-13T09:30:00Z"
  },
  {
    _id: "3",
    authorName: "Moussa IA",
    content: "L'intelligence artificielle n'est pas un remplacement, c'est un super-pouvoir pour votre business. 🤖🚀",
    imageUrl: null, // Test d'un post texte uniquement
    likes: [24],
    comments: [
      { author: "Admin", text: "Exactement ! C'est ce qu'on apprend dans le module 3." }
    ],
    createdAt: "2024-02-13T08:00:00Z"
  }
];