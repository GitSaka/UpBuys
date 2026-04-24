// import React, { useState } from 'react';

// const AddProductForm = ({ onCancel }) => {
//   const [productData, setProductData] = useState({
//     name: '',
//     price: '',
//     type: 'digital', // ou 'physique'
//     stock: '',
//     deliveryUrl: '', // Le lien de la formation ou du PDF
//     description: '', // Pour l'Agent IA
//     category: 'Formation',
//     imageUrl: '',
//     comparePrice:"",
//     whatsappMessage:"",
//     fakeSalesCount:''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Données prêtes pour la base :", productData);
//     // Ici on appellera notre API Backend plus tard
//   };

//   return (
//     <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 max-w-2xl mx-auto animate-fadeIn text-left">
//       <div className="mb-8">
//         <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Nouveau Produit 💎</h2>
//         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Configure ton offre souveraine</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
        
//         {/* 1. NOM ET PRIX */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nom du produit</label>
//             <input 
//               type="text" 
//               required
//               className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
//               placeholder="Ex: Coaching VIP"
//               onChange={(e) => setProductData({...productData, name: e.target.value})}
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Prix (FCFA)</label>
//             <input 
//               type="number" 
//               required
//               className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-black text-purple-600"
//               placeholder="5000"
//               onChange={(e) => setProductData({...productData, price: e.target.value})}
//             />
//           </div>
//         </div>

//         {/* 2. TYPE ET STOCK */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Type de produit</label>
//             <select 
//               className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-gray-700"
//               onChange={(e) => setProductData({...productData, type: e.target.value})}
//             >
//               <option value="digital">Digital (E-book / Formation)</option>
//               <option value="physique">Physique (Cosmétique / Habit)</option>
//               <option value="service">Service (Appel / Coaching)</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Stock (0 pour illimité)</label>
//             <input 
//               type="number" 
//               className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
//               placeholder="100"
//               onChange={(e) => setProductData({...productData, stock: e.target.value})}
//             />
//           </div>
//         </div>

//         {/* 3. LIVRAISON AUTOMATIQUE (Crucial pour le digital) */}
//         {productData.type === 'digital' && (
//           <div className="space-y-2 animate-fadeIn">
//             <label className="text-[10px] font-black uppercase text-purple-500 ml-2 flex items-center gap-1">
//               <span>🚀</span> Lien de livraison (Google Drive / PDF / Lien Vidéo)
//             </label>
//             <input 
//               type="url" 
//               className="w-full p-4 bg-purple-50/50 border border-purple-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium"
//               placeholder="votre-lien-prive.com"
//               onChange={(e) => setProductData({...productData, deliveryUrl: e.target.value})}
//             />
//           </div>
//         )}

//         {/* 4. DESCRIPTION POUR L'AGENT IA */}
//         <div className="space-y-2">
//           <label className="text-[10px] font-black uppercase text-gray-400 ml-2 flex items-center gap-1">
//             <span>🤖</span> Description détaillée (Pour que l'IA puisse vendre ce produit)
//           </label>
//           <textarea 
//             rows="4"
//             className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium leading-relaxed"
//             placeholder="Explique ici les bénéfices de ton produit. L'IA utilisera ce texte pour répondre aux clients sur WhatsApp."
//             onChange={(e) => setProductData({...productData, description: e.target.value})}
//           ></textarea>
//         </div>

//         {/* 5. BOUTONS */}
//         <div className="flex items-center gap-4 pt-4">
//           <button 
//             type="button"
//             onClick={onCancel}
//             className="flex-1 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
//           >
//             Annuler
//           </button>
//           <button 
//             type="submit"
//             className="flex-[2] p-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all"
//           >
//             Sauvegarder en Base de Données
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProductForm;

import React, { useState} from 'react';
// import { useNavigate } from 'react-router-dom';
// 
const AddProductForm = ({ productToEdit, onSave, onCancel }) => {
  // const navigate = useNavigate();
  // 1. État complet avec tous les champs nécessaires pour la base de données
  const [productData, setProductData] = useState(() =>
    productToEdit ?? {
    name: '',
    price: '',
    comparePrice: '', // Prix barré (Promotion)
    type: 'digital',
    stock: '',
    deliveryUrl: '', // Lien auto pour le digital
    description: '', // Pour l'Agent IA
    whatsappMessage: '', // Message auto post-achat
    fakeSalesCount: '', // Preuve sociale
    imageUrl: ''
  });
    
console.log(productData);
  // 2. Logique de pré-remplissage en mode "Modifier"
//   useEffect(() => {
//     if(!productToEdit) return 
//     if (productToEdit) {
//       setProductData(productToEdit);
//     }
//   }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(productData); // Cette fonction enverra les données vers ton futur Backend
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-2xl border border-gray-100 max-w-2xl mx-auto animate-fadeIn text-left overflow-y-auto max-h-[90vh]">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
            {productToEdit ? 'Modifier le Produit ⚙️' : 'Nouveau Produit 💎'}
          </h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Configuration de l'Empire</p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-900 text-2xl">×</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1 : IDENTITÉ ET PRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nom du produit</label>
            <input 
              type="text" 
              required
               value={productData?.name ?? ''}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
              placeholder="Ex: Coaching VIP"
              onChange={(e) => setProductData({...productData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Prix de vente (CFA)</label>
            <input 
              type="number" required value={productData?.price ?? ''}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-black text-purple-600"
              placeholder="5000"
              onChange={(e) => setProductData({...productData, price: e.target.value})}
            />
          </div>
        </div>

        {/* SECTION 2 : PSYCHOLOGIE DE VENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Prix Barré (Promo)</label>
            <input 
              type="number" value={productData?.comparePrice ?? ""}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none text-gray-400 line-through"
              placeholder="Ex: 15000"
              onChange={(e) => setProductData({...productData, comparePrice: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Ventes affichées (Preuve Sociale)</label>
            <input 
              type="number" value={productData?.fakeSalesCount ?? ''}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none"
              placeholder="Ex: 47 acheteurs"
              onChange={(e) => setProductData({...productData, fakeSalesCount: e.target.value})}
            />
          </div>
        </div>

        {/* SECTION 3 : TYPE ET LOGISTIQUE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Type de produit</label>
            <select 
              value={productData?.type ?? ''}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-gray-700"
              onChange={(e) => setProductData({...productData, type: e.target.value})}
            >
              <option value="digital">Digital (Lien auto)</option>
              <option value="physique">Physique (Stock)</option>
            </select>
          </div>
          {productData.type === 'digital' ? (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-purple-500 ml-2">Lien de téléchargement</label>
              <input 
                type="url" value={productData?.deliveryUrl ?? ''}
                className="w-full p-4 bg-purple-50 border border-purple-100 rounded-2xl outline-none text-sm"
                placeholder="drive.google.com..."
                onChange={(e) => setProductData({...productData, deliveryUrl: e.target.value})}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Stock disponible</label>
              <input 
                type="number" value={productData?.stock ?? ""}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none"
                placeholder="Ex: 20"
                onChange={(e) => setProductData({...productData, stock: e.target.value})}
              />
            </div>
          )}
        </div>

        {/* SECTION 4 : INTELLIGENCE & AUTOMATION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-purple-600 ml-2 flex items-center gap-1">
            <span>🤖</span> Description pour l'Agent IA (Détails de vente)
          </label>
          <textarea 
            rows="3" value={productData?.description ?? ''}
            className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none text-sm leading-relaxed"
            placeholder="Décris les bénéfices ici. L'IA utilisera ce texte pour convaincre tes clients."
            onChange={(e) => setProductData({...productData, description: e.target.value})}
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-green-600 ml-2 flex items-center gap-1">
            <span>💬</span> Message WhatsApp après paiement
          </label>
          <textarea 
            rows="2" value={productData?.whatsappMessage ?? ''}
            className="w-full p-4 bg-green-50/30 border border-green-100 rounded-2xl outline-none text-xs"
            placeholder="Ex: Merci ! Voici l'accès à ton produit..."
            onChange={(e) => setProductData({...productData, whatsappMessage: e.target.value})}
          ></textarea>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="flex items-center gap-4 pt-4">
          <button 
            type="button" onClick={onCancel}
            className="flex-1 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="flex-[2] p-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all"
          >
            {productToEdit ? 'Mettre à jour le produit' : 'Enregistrer le produit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;