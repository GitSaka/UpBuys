import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import EmojiPicker from "emoji-picker-react";
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from '../components/courses/FontSize';
import ConfirmModal from '../components/product/ConfirmModal';
import api from '../services/api';
import { uploadToCloudinary } from '../components/courses/UploadCloudiry.jsx';
import axios from "axios";
import { Image } from '@tiptap/extension-image';

// --- COMPOSANT ÉDITEUR POUR LES LEÇONS ---
const LessonEditor = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, Color, Image.configure({ inline: false, allowBase64: false })],
    content: initialContent || '',
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
  });

  useEffect(() => {
    if (editor && initialContent) { editor.commands.setContent(initialContent); }
  }, [editor, initialContent]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-2 text-left italic-none">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[150px] outline-none text-sm prose prose-purple" />
    </div>
  );
};

// --- BARRE D'OUTILS TIPTAP ---
const MenuBar = ({ editor, imageCount,}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  if (!editor) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || imageCount >= 5) return;
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        editor.chain().focus().setImage({ src: url, width: 250, alt: "Image", class: "rounded my-2" }).run();
      }
    } catch (error) { console.error(error); }
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-100">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded-lg text-[10px] font-black ${editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Gras</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded-lg text-[10px] font-black ${editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Italique</button>
      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black italic">📷 Image ({imageCount || 0}/5)</button>
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
      <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="px-3 py-1 rounded-lg text-xs bg-white text-gray-400 font-black italic">😊</button>
      {showEmoji && (
        <div className="absolute z-50 mt-2">
          <EmojiPicker onEmojiClick={(emoji) => { editor.chain().focus().insertContent(emoji.emoji).run(); setShowEmoji(false); }} />
        </div>
      )}
    </div>
  );
};

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const [course, setCourse] = useState({ 
    title: '', subtitle: '', price: '', comparePrice: '', thumbnail: '', 
    category: 'Mode & Design', pricingType: 'Unique', isFree: false, 
    productType: 'Metier', materials: [], descriptionLong: '', mainFileUrl: '' 
  });
  const [lessons, setLessons] = useState([]);
  const [statusModal, setStatusModal] = useState({ isOpen: false, mode: 'info', title: '', message: '' });

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, Color, Image.configure({ inline: false, allowBase64: false })],
    content: '',
    onUpdate: ({ editor }) => {
      setCourse(prev => ({ ...prev, descriptionLong: editor.getHTML() }));
      const images = (editor.getJSON().content || []).filter(node => node.type === 'image').length;
      setImageCount(images);
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/admin/get-courses/${id}`);
        const data = res.data.data;
        setCourse({ ...data, materials: data.materials || [] });
        setLessons(data.lessons || []);
        if (editor && data.descriptionLong) { editor.commands.setContent(data.descriptionLong); }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (editor) fetchCourse();
  }, [editor, id]);

  const addMaterial = () => setCourse(prev => ({ ...prev, materials: [...prev.materials, { name: '', isMandatory: true }] }));
  const updateMaterial = (idx, val) => {
    const updated = [...course.materials];
    updated[idx].name = val;
    setCourse({ ...course, materials: updated });
  };
  const removeMaterial = (idx) => setCourse({ ...course, materials: course.materials.filter((_, i) => i !== idx) });

  const addLesson = () => setLessons([...lessons, { title: '', type: 'video', mediaUrl: '', duration: '', description: '', isFree: false, attachmentName: '' }]);
  const handleLessonChange = (idx, field, val) => {
    const updated = [...lessons];
    updated[idx][field] = val;
    setLessons(updated);
  };

  const handleFileUpload = async (e, index = null, field = 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadToCloudinary(file);
      if (field === 'thumbnail' || field === 'mainFileUrl') { setCourse(prev => ({ ...prev, [field]: url })); }
      else if (index !== null) { 
        handleLessonChange(index, field, url);
        if (field === 'attachmentUrl') handleLessonChange(index, 'attachmentName', file.name);
      }
    } catch (error) { alert("Erreur upload ❌"+error); } finally { setSaving(false); }
  };

  const handleVideoUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "WhatsUpload"); 

    try {
      const res = await axios.post(`https://api.cloudinary.com`, formData, {
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setUploadProgress(prev => ({ ...prev, [index]: percent }));
        },
      });
      handleLessonChange(index, 'mediaUrl', res.data.secure_url);
    } catch (error) { console.error(error); } finally { setUploadingIndex(null); setUploadProgress(prev => ({ ...prev, [index]: 0 })); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...course, descriptionLong: editor.getHTML(), lessons: course.productType === 'Metier' ? lessons : [] };
    try {
      await api.put(`/admin/update-course/${id}`, payload);
      setStatusModal({ isOpen: true, mode: 'success', title: 'Bravo !', message: 'Empire mis à jour 👑' });
    } catch (err) {
       setStatusModal({ isOpen: true, mode: 'warning', title: 'Erreur', message: 'Échec de la mise à jour ❌' }); 
       console.log(err)} finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-200 uppercase animate-pulse italic">Synchronisation...</div>;

  return (
    <div className="p-4 lg:p-10 bg-white min-h-screen text-left italic-none">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Modifier mon Empire ✏️</h1>
        <p className="text-gray-400 text-sm font-bold">Mise à jour de ton contenu digital.</p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-12">
        {/* TYPE PRODUIT */}
        <div className="flex gap-4 bg-purple-50 p-2 rounded-[25px]">
          <button type="button" onClick={() => setCourse({...course, productType: 'Metier'})} className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase transition-all ${course.productType === 'Metier' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400'}`}>🎥 Formation Métier</button>
          <button type="button" onClick={() => setCourse({...course, productType: 'Outil'})} className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase transition-all ${course.productType === 'Outil' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400'}`}>📂 Outil / E-book</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* COLONNE 1 */}
          <div className="space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
            <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest italic underline">1. Identité du Produit</h2>
            <input required value={course.title} onChange={e => setCourse({...course, title: e.target.value})} className="w-full p-5 bg-white rounded-3xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-purple-500" placeholder="Titre" />
            <input required value={course.subtitle} onChange={e => setCourse({...course, subtitle: e.target.value})} className="w-full p-5 bg-white rounded-3xl text-sm outline-none" placeholder="Sous-titre" />
            
            <div className="grid grid-cols-2 gap-4">
              <select value={course.category} onChange={e => setCourse({...course, category: e.target.value})} className="p-4 bg-white rounded-2xl font-bold text-xs shadow-sm outline-none">
                <option value="Mode & Design">👗 Mode & Design</option>
                <option value="Art Culinaire">🍳 Art Culinaire</option>
                <option value="Agro-Business">🌱 Agro-Business</option>
                <option value="Business & IA">🤖 Business & IA</option>
              </select>
              <select value={course.pricingType} onChange={e => setCourse({...course, pricingType: e.target.value})} className="p-4 bg-white rounded-2xl font-bold text-xs shadow-sm outline-none">
                <option value="Unique">Achat Unique</option>
                <option value="Mensuel">Abonnement</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-5 bg-purple-50 rounded-3xl border border-purple-100">
              <p className="text-[10px] font-black uppercase text-purple-600">Offrir cet Empire</p>
              <input type="checkbox" checked={course.isFree} onChange={e => setCourse({...course, isFree: e.target.checked})} className="w-6 h-6 accent-purple-600" />
            </div>

            {!course.isFree && (
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={course.price} onChange={e => setCourse({...course, price: e.target.value})} className="p-5 bg-white rounded-3xl font-bold" placeholder="Prix" />
                <input type="number" value={course.comparePrice} onChange={e => setCourse({...course, comparePrice: e.target.value})} className="p-5 bg-white rounded-3xl text-gray-400" placeholder="Prix Barré" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4">📸 Image de couverture</label>
              <div onClick={() => document.getElementById('edit-thumb').click()} className="h-48 border-2 border-dashed border-purple-100 bg-white rounded-[35px] overflow-hidden cursor-pointer relative group">
                {course.thumbnail ? <img src={course.thumbnail} className="w-full h-full object-cover" alt="Cover" /> : <div className="h-full flex items-center justify-center font-black uppercase italic text-gray-300 text-[10px]">Aucune image</div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">Changer l'image</div>
              </div>
              <input type="file" id="edit-thumb" className="hidden" onChange={(e) => handleFileUpload(e, null, 'thumbnail')} />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase italic ml-4 italic underline underline-offset-4">🖋️ Description longue</label>
               <div className="bg-white rounded-[35px] overflow-hidden border border-gray-100">
                  <MenuBar editor={editor} imageCount={imageCount} />
                  <EditorContent editor={editor} className="p-6 min-h-[250px] prose prose-purple outline-none" />
               </div>
            </div>
          </div>

          {/* COLONNE 2 */}
          <div className="space-y-12">
            {course.productType === 'Metier' ? (
              <div className="space-y-8">
                {/* MATÉRIELS */}
                <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-purple-600 font-black text-[10px] uppercase tracking-widest italic underline">🛠️ Matériels</h2>
                    <button type="button" onClick={addMaterial} className="text-[9px] font-black bg-purple-600 text-white px-4 py-2 rounded-full uppercase">+ Ajouter</button>
                  </div>
                  <div className="space-y-3">
                    {course.materials.map((m, idx) => (
                      <div key={idx} className="flex gap-2 animate-fadeIn">
                        <input value={m.name} onChange={(e) => updateMaterial(idx, e.target.value)} className="flex-1 p-4 rounded-[22px] border-none shadow-sm text-sm font-bold outline-none italic" placeholder="Ex: Farine, Wax..." />
                        <button type="button" onClick={() => removeMaterial(idx)} className="bg-red-50 text-red-400 px-4 rounded-[20px] shadow-sm hover:bg-red-500 hover:text-white transition-all font-black text-xs italic uppercase underline">Supprimer</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SOMMAIRE */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <h2 className="text-purple-600 font-black text-[10px] uppercase tracking-widest italic underline underline-offset-4">📚 Sommaire Dynamique</h2>
                    <button type="button" onClick={addLesson} className="bg-gray-900 text-white px-6 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase">Ajouter</button>
                  </div>

                  <div className="space-y-6 max-h-[800px] overflow-y-auto no-scrollbar pb-10">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="bg-white p-6 rounded-[35px] border border-purple-50 shadow-xl shadow-purple-100/20 space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-300 uppercase italic">Chapitre {index + 1}</span>
                          <select value={lesson.type} onChange={e => handleLessonChange(index, 'type', e.target.value)} className="bg-gray-50 text-[9px] font-black p-2 rounded-xl border-none outline-none">
                            <option value="video">📺 VIDÉO</option>
                            <option value="audio">🎧 AUDIO</option>
                            <option value="text">📖 TEXTE</option>
                            <option value="pdf">📄 PDF</option>
                          </select>
                        </div>

                        <input required value={lesson.title} onChange={e => handleLessonChange(index, 'title', e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none" placeholder="Titre du chapitre" />

                        {/* MÉDIA SELON TYPE */}
                        {lesson.type === 'video' && (
                          <div className="relative p-6 bg-purple-50 rounded-[30px] border-2 border-dashed border-purple-200 text-center cursor-pointer group overflow-hidden" onClick={() => document.getElementById(`video-edit-${index}`).click()}>
                             <input type="file" id={`video-edit-${index}`} className="hidden" accept="video/*" onChange={(e) => handleVideoUpload(e, index)} />
                             <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🎥</span>
                             <p className="text-[10px] font-black uppercase text-purple-600">
                                {uploadProgress[index] > 0 ? `Upload : ${uploadProgress[index]}%` : lesson.mediaUrl ? "Vidéo prête ✅" : "Changer la vidéo"}
                             </p>
                             <div className="absolute bottom-0 left-0 h-1 bg-purple-600 transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)]" style={{ width: `${uploadProgress[index] || 0}%` }} />
                          </div>
                        )}

                        {lesson.type === 'pdf' && (
                           <div className="p-6 bg-purple-50 rounded-[30px] border-2 border-dashed border-purple-200 text-center cursor-pointer" onClick={() => document.getElementById(`pdf-edit-${index}`).click()}>
                             <input type="file" id={`pdf-edit-${index}`} className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, index, 'mediaUrl')} />
                             <span className="text-3xl mb-2 block animate-bounce italic font-black">📄</span>
                             <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest">{lesson.mediaUrl ? "Document prêt ✅" : "Uploader le PDF"}</p>
                           </div>
                        )}

                        {lesson.type === 'text' ? (
                          <LessonEditor initialContent={lesson.description} onChange={(html) => handleLessonChange(index, 'description', html)} />
                        ) : (
                          <textarea value={lesson.description} onChange={e => handleLessonChange(index, 'description', e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl text-xs outline-none min-h-[80px]" placeholder="Petites notes..." />
                        )}

                        {/* PIÈCE JOINTE DISCRÈTE */}
                        {lesson.type !== 'pdf' && (
                          <div className="mt-4 p-4 bg-gray-50/50 rounded-[25px] border border-dashed border-gray-200">
                             <p className="text-[9px] font-black text-gray-400 uppercase mb-2 italic tracking-tighter">📎 Ressource jointe (Patron/PDF)</p>
                             <div className="flex gap-2 items-center">
                               <button type="button" onClick={() => document.getElementById(`attach-edit-${index}`).click()} className="bg-white px-4 py-2 rounded-xl text-[9px] font-black border border-gray-100 shadow-sm transition-all hover:bg-purple-600 hover:text-white">CHANGER</button>
                               <input type="file" id={`attach-edit-${index}`} className="hidden" accept=".pdf,.zip" onChange={(e) => handleFileUpload(e, index, 'attachmentUrl')} />
                               <span className="text-[8px] font-bold text-gray-300 italic truncate max-w-[150px]">{lesson.attachmentName || "Aucun fichier"}</span>
                             </div>
                          </div>
                        )}

                        {/* DURÉE & GRATUIT */}
                        <div className="flex gap-4">
                          {lesson.type !== 'text' && lesson.type !== 'pdf' && (
                             <input value={lesson.duration} onChange={e => handleLessonChange(index, 'duration', e.target.value)} className="flex-1 p-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-500 shadow-inner" placeholder="Durée (ex: 12:45)" />
                          )}
                          <div className="flex items-center gap-2 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                             <input type="checkbox" checked={lesson.isFree} onChange={e => handleLessonChange(index, 'isFree', e.target.checked)} className="w-5 h-5 accent-purple-600 cursor-pointer" />
                             <label className="text-[9px] font-black text-gray-400 uppercase italic">Libre</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* CAS OUTIL / EBOOK */
              <div className="bg-purple-50 p-12 rounded-[50px] border-2 border-dashed border-purple-200 text-center relative group">
                 <input type="file" id="edit-pack-up" className="hidden" accept=".pdf,.zip,.doc" onChange={(e) => handleFileUpload(e, null, 'mainFileUrl')} />
                 <div onClick={() => document.getElementById('edit-pack-up').click()} className="cursor-pointer">
                    <span className="text-6xl block mb-6 group-hover:scale-110 transition-transform">📦</span>
                    <h3 className="font-black text-xs uppercase italic text-gray-900 mb-2">Modifier le Pack / E-book</h3>
                    <p className="text-[10px] text-purple-600 font-bold break-all px-10 underline">{course.mainFileUrl || "Cliquer pour charger le fichier principal"}</p>
                 </div>
              </div>
            )}

            <div className="pt-10">
              <button 
                type="submit" 
                disabled={saving} 
                className={`w-full p-8 rounded-[40px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${saving ? 'bg-gray-400' : 'bg-gray-900 text-white hover:bg-purple-700 active:scale-95'}`}
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Synchronisation...</span>
                  </div>
                ) : "💾 Mettre à jour mon Empire"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmModal 
        isOpen={statusModal.isOpen} 
        mode={statusModal.mode} 
        title={statusModal.title} 
        message={statusModal.message} 
        onConfirm={() => { setStatusModal({ ...statusModal, isOpen: false }); if (statusModal.mode === 'success') navigate('/admin/productlist'); }} 
        onCancel={() => setStatusModal({ ...statusModal, isOpen: false })} 
      />
    </div>
  );
};

export default EditCourse;