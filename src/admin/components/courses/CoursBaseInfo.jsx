import React from 'react';
import MenuBar from './MenuBar'; // Je suppose que tu l'as extrait ou on le laisse dans CreateCourse
import { EditorContent } from '@tiptap/react';

const CourseBaseInfo = ({ course, setCourse, editor }) => {
  return (
    <div className="space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
      <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest">1. Identité du Produit</h2>
      
      <input required type="text" placeholder="Titre de la formation" value={course.title} className="w-full p-5 bg-white rounded-3xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-purple-500" onChange={e => setCourse({...course, title: e.target.value})} />
      
      <input required type="text" placeholder="Phrase d'accroche (ex: Devenez libre en 30 jours)" value={course.subtitle} className="w-full p-5 bg-white rounded-3xl text-sm shadow-sm outline-none" onChange={e => setCourse({...course, subtitle: e.target.value})} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Domaine</label>
          <select value={course.category} className="w-full p-4 bg-white rounded-2xl font-bold text-xs shadow-sm outline-none" onChange={e => setCourse({...course, category: e.target.value})}>
            <option value="Mode & Design">👗 Mode & Design</option>
            <option value="Art Culinaire">🍳 Art Culinaire</option>
            <option value="Agro-Business">🌱 Agro-Business</option>
            <option value="Beauté & Soins">✨ Beauté & Soins</option>
            <option value="Business & IA">🤖 Business & IA</option>
            <option value="Boîte à Outils">📂 Boîte à Outils</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Facturation</label>
          <select value={course.pricingType} className="w-full p-4 bg-white rounded-2xl font-bold text-xs shadow-sm outline-none" onChange={e => setCourse({...course, pricingType: e.target.value})}>
            <option value="Unique">Achat Unique</option>
            <option value="Mensuel">Abonnement</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between p-5 bg-purple-50 rounded-3xl border border-purple-100">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎁</span>
          <div>
            <p className="text-[10px] font-black uppercase text-purple-600 leading-none">Offrir cet Empire</p>
            <p className="text-[9px] text-purple-400 font-medium italic">Rendre tout le cours gratuit</p>
          </div>
        </div>
        <input type="checkbox" checked={course.isFree} className="w-6 h-6 accent-purple-600 cursor-pointer" onChange={e => setCourse({...course, isFree: e.target.checked})} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <input required type="number" placeholder="Prix CFA" value={course.price} className="p-5 bg-white rounded-3xl font-bold shadow-sm" onChange={e => setCourse({...course, price: e.target.value})} />
        <input type="number" placeholder="Prix Barré" value={course.comparePrice} className="p-5 bg-white rounded-3xl text-gray-400 shadow-sm" onChange={e => setCourse({...course, comparePrice: e.target.value})} />
      </div>

      <input type="text" placeholder="Lien Cloudinary Image" value={course.thumbnail} className="w-full p-5 bg-white rounded-3xl text-xs shadow-sm" onChange={e => setCourse({...course, thumbnail: e.target.value})} />

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Description Longue & Stickers ✨</label>
        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
          {/* Note: MenuBar doit être importé ou passé en prop */}
          <EditorContent editor={editor} className="p-6 min-h-[200px] outline-none prose prose-purple text-sm" />
        </div>
      </div>
    </div>
  );
};
export default CourseBaseInfo;