// Données pour la courbe des ventes (Line Chart)
export const SALES_DATA = [
  { day: 'Lun', sales: 45000 },
  { day: 'Mar', sales: 52000 },
  { day: 'Mer', sales: 38000 },
  { day: 'Jeu', sales: 85000 }, // Gros pic après un post TikTok !
  { day: 'Ven', sales: 48000 },
  { day: 'Sam', sales: 60000 },
  { day: 'Dim', sales: 55000 },
];

// Données pour la provenance des fans (Pie Chart)
export const SOURCE_DATA = [
  { name: 'TikTok', value: 45, color: '#000000' },
  { name: 'Facebook', value: 30, color: '#1877F2' },
  { name: 'Instagram', value: 25, color: '#E4405F' },
];

// Statistiques globales (Cards)
export const SUMMARY_STATS = [
  { id: 1, label: "Ventes Totales", value: "383.000 FCFA", trend: "+12%" },
  { id: 2, label: "Nouveaux Fans", value: "1,240", trend: "+5%" },
  { id: 3, label: "Commandes", value: "42", trend: "+8%" },
];

export const MOCK_PRODUCTS = [
  { 
    id: 1, 
    name: "Formation Business Automatisé", 
    price: "25.000", 
    comparePrice: "45.000", 
    stock: 124, 
    type: "Digital", 
    status: "Actif", 
    sales: 45,
    description: "Apprenez à automatiser vos ventes en Afrique.",
    whatsappMessage: "Félicitations ! Voici l'accès à votre formation..."
  },
  { 
    id: 2, 
    name: "E-book : 30 jours pour percer", 
    price: "5.000", 
    comparePrice: "10.000", 
    stock: "Infini", 
    type: "Digital", 
    status: "Actif", 
    sales: 89,
    description: "Le guide ultime pour TikTok.",
    whatsappMessage: "Merci ! Voici ton e-book en PDF..."
  },
 { id: 3, name: "E-book : 30 jours pour percer", price: "5.000", stock: "Infini", type: "Digital", status: "Actif", sales: 89 },
  { id: 4, name: "Coaching Privé (1h)", price: "50.000", stock: 5, type: "Service", status: "Bientôt épuisé", sales: 12 },
];