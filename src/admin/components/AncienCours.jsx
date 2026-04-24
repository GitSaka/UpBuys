import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import EmojiPicker from "emoji-picker-react";
import { TextStyle } from '@tiptap/extension-text-style';
import Blockquote from '@tiptap/extension-blockquote';
import Color from '@tiptap/extension-color';
import FontSize from '../components/courses/fontSize';
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../components/product/ConfirmModal';
import api from '../services/api';

// --- COMPOSANT ÉDITEUR TIPTAP (LEÇONS) ---
const LessonEditor = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, FontSize, Color, Blockquote],
    content: initialContent || '<p>Écris ta leçon ici... ✍️</p>',
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
  });
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[150px] outline-none text-sm prose prose-purple" />
    </div>
  );
};

// --- COMPOSANT BARRE D'OUTILS ---
const MenuBar = ({ editor }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-100">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Gras</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Italique</button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('underline') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Souligné</button>
      <span className="text-gray-300 self-center">|</span>
      <select className="text-xs bg-white border rounded px-2" onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}>
        <option value="12">Petit</option>
        <option value="16">Normal</option>
        <option value="20">Grand</option>
        <option value="28">Titre</option>
      </select>
      <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="px-3 py-1 rounded-lg text-xs font-black bg-white text-gray-400">😊</button>
      {showEmoji && (
        <div className="absolute z-50 mt-10"><EmojiPicker onEmojiClick={(emojiData) => { editor.chain().focus().insertContent(emojiData.emoji).run(); setShowEmoji(false); }} /></div>
      )}
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---
const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState({ isOpen: false, mode: 'info', title: '', message: '' });

  // ÉTAT DU COURS
  const [course, setCourse] = useState({ 
    title: '', subtitle: '', price: '', comparePrice: '', thumbnail: '', 
    category: 'Mode & Design', pricingType: 'Unique', isFree: false, 
    productType: 'Metier', mainFileUrl: '',
    materials: [{ name: '', isMandatory: true }] 
  });

  // ÉTAT DES LEÇONS
  const [lessons, setLessons] = useState([{ 
    title: '', type: 'video', mediaUrl: '', duration: '', description: '', isFree: false,
    attachmentUrl: '', attachmentName: '' 
  }]);

  // ÉDITEUR DESCRIPTION LONGUE
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, FontSize, Color, Blockquote],
    content: '<p>Décris ton programme ici... ✨🚀</p>',
  });

  // --- LOGIQUE GESTION ---
  const addLesson = () => setLessons([...lessons, { title: '', type: 'video', mediaUrl: '', duration: '', description: '', isFree: false, attachmentUrl: '', attachmentName: '' }]);
  
  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const addMaterial = () => setCourse({ ...course, materials: [...course.materials, { name: '', isMandatory: true }] });
  
  const updateMaterial = (index, value) => {
    const newMaterials = [...course.materials];
    newMaterials[index].name = value;
    setCourse({ ...course, materials: newMaterials });
  };

  const removeMaterial = (index) => {
    const newMaterials = course.materials.filter((_, i) => i !== index);
    setCourse({ ...course, materials: newMaterials });
  };

  // SOUMISSION
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!course.title || !course.price) {
      setStatusModal({ isOpen: true, mode: 'warning', title: 'Erreur', message: 'Titre et prix obligatoires ❌' });
      return;
    }
    setLoading(true);
    const finalData = { ...course, descriptionLong: editor.getHTML(), lessons };
    try {
      const res = await api.post("http://localhost:5000/api/admin/create-empire", finalData);
      setStatusModal({ isOpen: true, mode: 'success', title: 'Bravooo', message: 'Empire créé avec succès 👑🚀' });
      setTimeout(() => navigate(`/admin/manage-courses`), 3000);
    } catch (err) {
      setStatusModal({ isOpen: true, mode: 'warning', title: 'Erreur', message: err.response?.data?.message || 'Erreur serveur ❌' });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4 lg:p-10 bg-white min-h-screen text-left italic-none">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Créer mon Empire 👑</h1>
        <p className="text-gray-400 text-sm font-bold">L'Académie des Métiers et des Outils.</p>
      </header>

      <form onSubmit={handlePublish}>
        {/* SWITCH TYPE PRODUIT */}
        <div className="flex gap-4 mb-10 bg-purple-50 p-2 rounded-[25px]">
          <button type="button" onClick={() => setCourse({...course, productType: 'Metier'})} className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase transition-all ${course.productType === 'Metier' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400'}`}>🎥 Formation Métier</button>
          <button type="button" onClick={() => setCourse({...course, productType: 'Outil'})} className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase transition-all ${course.productType === 'Outil' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400'}`}>📂 Outil / E-book</button>
        </div>

        {/* 1. IDENTITÉ */}
        <div className="space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 mb-10">
          <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest italic">1. Identité du Produit</h2>
          <input required type="text" placeholder="Titre de la formation" className="w-full p-5 bg-white rounded-3xl font-bold outline-none" onChange={e => setCourse({...course, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <select className="p-4 bg-white rounded-2xl font-bold text-xs" onChange={e => setCourse({...course, category: e.target.value})}>
              <option value="Mode & Design">👗 Mode & Design</option>
              <option value="Art Culinaire">🍳 Art Culinaire</option>
              <option value="Agro-Business">🌱 Agro-Business</option>
              <option value="Business & IA">🤖 Business & IA</option>
            </select>
            <select className="p-4 bg-white rounded-2xl font-bold text-xs" onChange={e => setCourse({...course, pricingType: e.target.value})}>
              <option value="Unique">Achat Unique</option>
              <option value="Mensuel">Abonnement</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Prix CFA" className="p-5 bg-white rounded-3xl font-bold" onChange={e => setCourse({...course, price: e.target.value})} />
            <input type="text" placeholder="URL Image Cloudinary" className="p-5 bg-white rounded-3xl text-xs" onChange={e => setCourse({...course, thumbnail: e.target.value})} />
          </div>
          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="p-6 min-h-[200px] outline-none prose prose-purple text-sm" />
          </div>
        </div>

        {/* 2. MATÉRIEL (CONDITIONNEL MÉTIER) */}
        {course.productType === 'Metier' && (
          <div className="mb-12 p-4 bg-gray-50 rounded-[40px] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-purple-600 font-black text-xs uppercase italic tracking-widest">🛠️ Matériel Requis</h2>
              <button type="button" onClick={addMaterial} className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-[10px] font-black">+ AJOUTER</button>
            </div>
            {course.materials.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-3">
                <input type="text" value={item.name} placeholder="Ex: Machine à coudre" className="flex-1 p-4 bg-white rounded-2xl font-bold" onChange={(e) => updateMaterial(idx, e.target.value)} />
                {course.materials.length > 1 && <button type="button" onClick={() => removeMaterial(idx)} className="bg-red-50 text-red-400 px-4 rounded-2xl">✕</button>}
              </div>
            ))}
          </div>
        )}

        {/* 3. SOMMAIRE OU PACK */}
        {course.productType === 'Metier' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest italic">2. Sommaire Dynamique</h2>
              <button type="button" onClick={addLesson} className="bg-gray-900 text-white px-6 py-2 rounded-2xl text-[10px] font-black">+ AJOUTER</button>
            </div>
            {lessons.map((lesson, index) => (
              <div key={index} className="bg-white p-8 rounded-[40px] border border-purple-50 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase italic">Chapitre {index + 1}</span>
                  <select className="bg-gray-50 text-[9px] font-black p-2 rounded-xl" value={lesson.type} onChange={e => handleLessonChange(index, 'type', e.target.value)}>
                    <option value="video">📺 VIDÉO</option>
                    <option value="audio">🎧 AUDIO</option>
                    <option value="text">📖 TEXTE</option>
                    <option value="pdf">📄 PDF</option>
                  </select>
                </div>
                <input required type="text" placeholder="Titre du chapitre" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm" value={lesson.title} onChange={e => handleLessonChange(index, 'title', e.target.value)} />
                
                {/* BLOC PIÈCE JOINTE / PDF */}
                {(lesson.type === 'pdf' || lesson.type === 'video' || lesson.type === 'audio') && (
                  <div className="p-4 bg-purple-50/50 rounded-[25px] border border-dashed border-purple-200 grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Nom du fichier" className="p-3 rounded-xl text-[10px] font-bold" value={lesson.attachmentName} onChange={e => handleLessonChange(index, 'attachmentName', e.target.value)} />
                    <input type="text" placeholder="URL du fichier" className="p-3 rounded-xl text-[10px] font-bold" value={lesson.attachmentUrl} onChange={e => handleLessonChange(index, 'attachmentUrl', e.target.value)} />
                  </div>
                )}

                {lesson.type !== 'text' && (
                  <input type="text" placeholder="Lien Cloudinary" className="w-full p-4 bg-purple-50/50 rounded-2xl text-xs" value={lesson.mediaUrl} onChange={e => handleLessonChange(index, 'mediaUrl', e.target.value)} />
                )}
                <textarea placeholder="Notes sous le média..." className="w-full p-4 bg-gray-50 rounded-2xl text-xs min-h-[80px]" value={lesson.description} onChange={e => handleLessonChange(index, 'description', e.target.value)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 bg-purple-50 rounded-[40px] border-2 border-dashed border-purple-200 text-center">
            <span className="text-4xl block mb-4">📦</span>
            <h3 className="font-black text-xs uppercase italic mb-4">Lien du Pack / E-book Principal</h3>
            <input type="text" placeholder="Coller le lien de l'outil ici" className="w-full p-5 rounded-3xl font-bold shadow-inner" onChange={e => setCourse({...course, mainFileUrl: e.target.value})} />
          </div>
        )}

        <button type="submit" disabled={loading} className={`w-full mt-10 p-7 rounded-[40px] font-black uppercase tracking-widest ${loading ? 'bg-gray-400' : 'bg-gray-900 text-white shadow-2xl hover:bg-purple-700'}`}>
          {loading ? "Construction de l'Empire..." : "🚀 Lancer mon Empire"}
        </button>
      </form>

      <ConfirmModal isOpen={statusModal.isOpen} mode={statusModal.mode} title={statusModal.title} message={statusModal.message} 
        onConfirm={() => { setStatusModal({ ...statusModal, isOpen: false }); if (statusModal.mode === 'success') navigate('/admin/manage-courses'); }}
        onCancel={() => setStatusModal({ ...statusModal, isOpen: false })} />
    </div>
  );
};

export default CreateCourse;