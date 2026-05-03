import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import EmojiPicker from "emoji-picker-react";
import { TextStyle } from '@tiptap/extension-text-style';
import Blockquote from '@tiptap/extension-blockquote';
import Color from '@tiptap/extension-color';
import FontSize from '../components/courses/FontSize';
import { useNavigate } from "react-router-dom";
import ConfirmModal from '../components/product/ConfirmModal';
import api from '../services/api'
import { uploadToCloudinary }from '../components/courses/UploadCloudiry.jsx'
import axios from "axios";
import { Image } from '@tiptap/extension-image';
import RichEditor from '../tiptap/RichEdictor.jsx';







const LessonEditor = ({ initialContent, onChange }) => {
  const editor = useEditor({
        extensions: [ 
          StarterKit,
          // Underline,
          TextStyle,
          FontSize,
          Color,
          // Blockquote
          Image.configure({
            inline: false,
            allowBase64: false,
          }),
        ],
        content: initialContent || '<p>Écris ta leçon ici... ✍️</p>',
        onUpdate: ({ editor }) => {
          onChange(editor.getHTML());
          
        },
      });

      return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-2">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="p-4 min-h-[150px] outline-none text-sm prose prose-purple" />
        </div>
      );
  };
// --- Petit composant de barre d'outils pour l'éditeur ---



const CreateCourse = () => {
  const [course, setCourse] = useState(
    { 
       title: '',
       subtitle: '', 
       price: '', 
       comparePrice: '',
       thumbnail: '', 
       category: 'Mode & Design',
       pricinType:'Unique',
       isFree:false,
       productType:'Metier',
       materials: [{ name: '', isMandatory: true }], // On commence avec un champ vide
       descriptionLong:'',
       mainFileUrl: ''
       
       });

  const [uploadProgress, setUploadProgress] = useState({}); 

  const [lessons, setLessons] = useState([{attachmentName:'',title: '', type: 'video', mediaUrl: '', duration: '', description: '', isFree: false }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const fileInputRefs = useRef([]);
  const [imageCount, setImageCount] = useState(0);
  const [uploading, setUploading] = useState(false);



  const [statusModal, setStatusModal] = useState({ 
    isOpen: false, 
    mode: 'info', 
    title: '', 
    message: '' 
    });
  
  const editor = useEditor({
    extensions: [ 
      StarterKit,
      // Underline,
      TextStyle,
      FontSize,
      Color,
      // Blockquote
      Image.configure({
      inline: false,
      allowBase64: false
    }),
    ],
    content: '<p>Décris ton programme ici... ✨🚀</p>',
    onUpdate: ({ editor }) => {
    const html = editor.getHTML();
     const json = editor.getJSON();

      let count = 0;

      const countImages = (node) => {
        if (node.type === 'image') count++;
        if (node.content) {
          node.content.forEach(countImages);
        }
      };

      countImages(json);

      setImageCount(count);
    setCourse(prev => ({ ...prev, descriptionLong: html }));
  },
  });


  const MenuBar = ({ editor, imageCount }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);

  const isLimitReached = imageCount >= 5;

  if (!editor) return null;

  const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  
  if (!file || !editor) return;

  if (imageCount >= 5) {
    alert("Limite de 5 images atteinte ❌");
    return;
  }

  try {
    setUploading(true); // ✅ démarre le loader
    const url = await uploadToCloudinary(file);
    console.log(url)

    if (!url) throw new Error("Upload échoué");

    editor
      .chain()
      .focus()
      .setImage({ 
        src: url,
         
          height: null, // TipTap/HTML garde ratio automatique
          alt: "Image du cours",
          class: "rounded my-2",
          
      })
      .run();

  } catch (error) {
    console.error("Erreur upload image :", error);
    alert("Erreur lors de l'envoi de l'image ❌");
  } finally {
    setUploading(false); // ✅ stop le loader
    e.target.value = "";
  }

  e.target.value = "";
};
 
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-100">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Gras</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Italique</button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('underline') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Souligné</button>
      <span className="text-gray-300 self-center">|</span>

      <button
        type="button"
        onClick={() => editor.chain().focus().setColor('#ef4444').run()}
        className="w-5 h-5 rounded-full bg-red-500"
      />

      <button
        type="button"
        onClick={() => editor.chain().focus().setColor('#3b82f6').run()}
        className="w-5 h-5 rounded-full bg-blue-500"
      />

      <button
        type="button"
        onClick={() => editor.chain().focus().setColor('#22c55e').run()}
        className="w-5 h-5 rounded-full bg-green-500"
      />

      <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        className="px-2 py-1 text-[10px] font-black text-gray-400"
      >
        A
      </button>

      <button
        type="button"
        disabled={isLimitReached || uploading}
        onClick={() => fileInputRef.current?.click()}
        className={`px-3 py-1 rounded-lg text-xs font-black ${
          isLimitReached || uploading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-400'
        }`}
      >
       {uploading ? (
      <span className="text-xs text-purple-600 animate-pulse">Uploading… ⏳</span>
    ) : (
      <><span >📷 image ({imageCount}/5)</span></>
    )}
       
      </button>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="absolute w-0 h-0 opacity-0"
          />

      <span className="text-gray-300 self-center">|</span>
      <select
          className="text-xs bg-white border rounded px-2"
          onChange={e =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
        >
          <option value="12">Petit</option>
          <option value="16">Normal</option>
          <option value="20">Grand</option>
          <option value="28">Titre</option>
      </select>

      <button
  type="button"
  onClick={() => editor.chain().focus().toggleBlockquote().run()}
  className={`px-3 py-1 rounded-lg text-xs font-black ${
    editor.isActive('blockquote') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'
  }`}
>
  Citation
</button>

      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="px-3 py-1 rounded-lg text-xs font-black bg-white text-gray-400"
      >
        😊
      </button>
      
      {showEmoji && (
        <div className="absolute z-50 mt-2">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              editor.chain().focus().insertContent(emojiData.emoji).run();
              setShowEmoji(false);
            }}
          />
        </div>
      )}


      
      <span className="text-gray-300 self-center">|</span>
      <span className="text-[10px] text-gray-400 font-bold self-center italic">✨ Astuce : "Win + ." sur PC pour les Emojis</span>
    </div>
  );
};

  const addLesson = () => setLessons([...lessons, { title: '', type: 'video', mediaUrl: '', duration: '', description: '', isFree: false }]);

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };
  const [isUploading,setIsUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState(null);


const handleFileUpload = async (e, index = null, field = 'thumbnail') => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 🔒 Sécurité minimale
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'video/mp4'
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Type de fichier non autorisé ❌");
    return;
  }

  setIsUploading(true);

  try {
    const url = await uploadToCloudinary(file);
    if (!url) throw new Error("Upload échoué");
    console.log(url)

    // 🟣 1. Image de couverture
    if (field === 'thumbnail') {
      setCourse(prev => ({
        ...prev,
        thumbnail: url
      }));
    }

    // 🟣 2. Fichier principal du cours
    else if (field === 'mainFileUrl') {
      setCourse(prev => ({
        ...prev,
        mainFileUrl: url
      }));
    }

    // 🟣 3. Fichier lié à une leçon
    else if (index !== null) {
      setLessons(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: url
        };

        if (field === 'attachmentUrl') {
          updated[index].attachmentName = file.name;
        }

        return updated;
      });
    }

  } catch (error) {
    console.error("❌ Erreur upload fichier :", error);
    alert("Erreur lors de l'envoi du fichier ❌");
  } finally {
    setIsUploading(false);
  }
};


const handlePublish = async (e) => {
  e.preventDefault();

  if (!course.isFree) {
    if (!course.title || !course.price) {
      setStatusModal({
        isOpen: true,
        mode: 'warning',
        title: 'Oups ! Erreur',
        message: 'Titre et prix obligatoires ❌'
      });
      return;
    }
  }

  if (Number(course.price) < 0) {
    setStatusModal({
      isOpen: true,
      mode: 'warning',
      title: 'Erreur',
      message: "Le prix ne peut pas être négatif ❌"
    });
    return;
  }

  const finalData = {
    ...course,
    descriptionLong: editor.getHTML(),
    // lessons: course.productType === 'Metier' ? lessons : [],
    lessons: course.productType === 'Metier' ? lessons.map(l => ({
      ...l,
      // Si c'est un lien YouTube, on force la source, sinon par défaut Cloudinary
      videoSource: l.videoSource || 'cloudinary' 
    })) : [],
    price: course.isFree ? 0 : course.price
  };

  try {
    setLoading(true);

    const res = await api.post("/admin/create-empire", finalData);

    console.log("✅ Créé :", res.data);

    // 1. reset propre AVANT navigation
    setCourse({
      title: '',
      subtitle: '',
      price: '',
      thumbnail: '',
      descriptionLong: '',
      isFree: false,
      productType: 'Metier'
    });

    setLessons([]);

    editor.commands.setContent('<p></p>');

    setStatusModal({
      isOpen: true,
      mode: 'success',
      title: 'Bravooo',
      message: 'Empire créé avec succès 👑🚀'
    });

    // 2. navigation rapide (pas 5 secondes inutiles)
    setTimeout(() => {
      navigate(`/admin/success/${res.data.courseId}`);
    }, 1200);

  } catch (err) {
    console.error(err);

    setStatusModal({
      isOpen: true,
      mode: 'warning',
      title: 'Erreur',
      message: err.response?.data?.message || 'Serveur indisponible ❌'
    });

  } finally {
    setLoading(false);
  }
};



  const handleVideoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

     // 🛡️ Sécurité : Si la leçon est configurée sur YouTube, on n'upload pas
  if (lessons[index].videoSource === 'youtube') {
    alert("Vous êtes en mode Lien YouTube. Changez pour 'Fichier Local' si vous voulez uploader.");
    return;
  }

    e.target.value = null; // 🔑 Permet de re-sélectionner le même fichier

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "WhatsUpload"); // preset UNSIGNED
    formData.append("cloud_name", "dyen5y5kh");

  // On indique que cette leçon est en train d’uploader
    setUploadingIndex(index);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dyen5y5kh/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [index]: percentCompleted }));
          },
        }
      );
       // On met à jour la leçon correspondante
      const updatedLessons = [...lessons];
      updatedLessons[index].mediaUrl = res.data.secure_url;
      setLessons(updatedLessons);

      // Reset barre de progression après 2s
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [index]: 0 }));
      }, 2000);
    } catch (error) {
      console.error("Erreur d'upload vidéo :", error);
      alert("L'upload a échoué. Vérifie ta connexion.");
    }
  };


const addMaterial = () => {
  setCourse({
    ...course,
    materials: [...course.materials, { name: '', isMandatory: true }]
  });
};

const updateMaterial = (index, value) => {
  const newMaterials = [...course.materials];
  newMaterials[index].name = value;
  setCourse({ ...course, materials: newMaterials });
};

const removeMaterial = (index) => {
  const newMaterials = course.materials.filter((_, i) => i !== index);
  setCourse({ ...course, materials: newMaterials });
};

// const updateLesson = (index, field, value) => {
//   // 1. On crée une copie propre du tableau des leçons
//   const newLessons = [...course.lessons];
  
//   // 2. On modifie uniquement le champ (ex: 'attachmentUrl') de la leçon à cet index
//   newLessons[index] = { 
//     ...newLessons[index], 
//     [field]: value 
//   };
  
//   // 3. On met à jour l'état global du formulaire
//   setCourse({ 
//     ...course, 
//     lessons: newLessons 
//   });
// };


  return (
    <div className="p-4 lg:p-10 bg-white min-h-screen text-left">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Créer mon Empire 👑</h1>
        <p className="text-gray-400 text-sm font-bold">Remplis les détails et lance ta boutique digitale.</p>
      </header>

      <form onSubmit={handlePublish} className="">
        {/* Champ à ajouter au début du formulaire */}
      <div className="flex gap-4 mb-8 bg-purple-50 p-2 rounded-[25px]">
        <button 
          type="button"
          onClick={() => setCourse({...course, productType: 'Metier'})}
          className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase transition-all ${course.productType === 'Metier' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400'}`}
        >
          🎥 Formation Métier
        </button>
        <button 
          type="button"
          onClick={() => setCourse({...course, productType: 'Outil'})}
          className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase transition-all ${course.productType === 'Outil' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400'}`}
        >
          📂 Outil / E-book
        </button>
      </div>
        {/* COLONNE 1 : TABLE COURSE */}
        <div className="space-y-8 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
          <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest">1. Identité du Produit</h2>
          <input required type="text" placeholder="Titre de la formation" className="w-full p-5 bg-white rounded-3xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-purple-500" onChange={e => setCourse({...course, title: e.target.value})} />
          <input required type="text" placeholder="Phrase d'accroche (ex: Devenez libre en 30 jours)"  className="w-full p-5 bg-white rounded-3xl text-sm shadow-sm outline-none" onChange={e => setCourse({...course, subtitle: e.target.value})} />
          {/* SOUS-TITRE (Accroche) */}


          {/* GRILLE THÉMATIQUE & MODE DE VENTE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Domaine</label>
              <select 
                className="w-full p-4 bg-white rounded-2xl font-bold text-xs shadow-sm outline-none"
                onChange={e => setCourse({...course, category: e.target.value})}
              >
                <option value="Mode & Design">👗 Mode & Design</option>
                <option value="Art Culinaire">🍳 Art Culinaire</option>
                <option value="Agro-Business">🌱 Agro-Business</option>
                <option value="Business & IA">🤖 Business & IA</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Facturation</label>
              <select 
                className="w-full p-4 bg-white rounded-2xl font-bold text-xs shadow-sm outline-none"
                onChange={e => setCourse({...course, pricingType: e.target.value})}
              >
                <option value="Unique">Achat Unique</option>
                <option value="Mensuel">Abonnement</option>
              </select>
            </div>
          </div>

          {/* MODE CADEAU (SWITCH) */}
          <div className="flex items-center justify-between p-5 bg-purple-50 rounded-3xl border border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <div>
                <p className="text-[10px] font-black uppercase text-purple-600 leading-none">Offrir cet Empire</p>
                <p className="text-[9px] text-purple-400 font-medium italic">Rendre tout le cours gratuit</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="w-6 h-6 accent-purple-600 cursor-pointer"
              onChange={e => setCourse({...course, isFree: e.target.checked})} 
            />
          </div>
          
         {/* ON ENVELOPPE LA CONDITION DANS LE MÊME MOULE QUE LE RESTE */}
        <div className="w-full">
          {!course.isFree ? (
            /* ICI : On utilise EXACTEMENT la même grille que pour Domaine/Facturation */
            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
              
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Prix de vente (CFA)</label>
                <input 
                  required 
                  type="number" 
                  placeholder="Prix CFA" 
                  className="w-full p-5 bg-white rounded-3xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-purple-500" 
                  onChange={e => setCourse({...course, price: e.target.value})} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Prix avant réduction</label>
                <input 
                  type="number" 
                  placeholder="Prix Barré" 
                  className="w-full p-5 bg-white rounded-3xl text-gray-400 shadow-sm outline-none" 
                  onChange={e => setCourse({...course, comparePrice: e.target.value})} 
                />
              </div>

            </div>
          ) : (
            /* BLOC GRATUIT : Lui aussi doit respecter la largeur */
            <div className="w-full p-6 bg-green-50 border border-dashed border-green-200 rounded-[35px] flex items-center gap-4 animate-slideIn">
              <span className="text-2xl">🌟</span>
              <div>
                <p className="text-[10px] font-black uppercase text-green-700 leading-none">Accès Cadeau activé</p>
                <p className="text-[9px] text-green-600 font-medium italic mt-1">Cet Empire sera gratuit sur la boutique.</p>
              </div>
            </div>
          )}
        </div>

          {/* --- ZONE D'UPLOAD IMAGE --- */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4 italic tracking-widest">
              📸 Image de couverture
            </label>
            
            {/* L'INPUT RÉEL (CACHÉ) */}
            <input 
              type="file" 
              id="thumbnail-input"
              accept="image/*"
              className="hidden" 
              onChange={(e) => handleFileUpload(e,null,'thumbnail')}
            />

            {/* TA CARTE DESIGN (C'EST ELLE QU'ON CLIQUE) */}
            <div 
              onClick={() => document.getElementById('thumbnail-input').click()}
              className="relative group cursor-pointer overflow-hidden border-2 border-dashed border-purple-100 bg-white hover:border-purple-600 transition-all duration-500 rounded-[35px] p-2"
            >
              {course.thumbnail ? (
                <div className="relative h-48 w-full rounded-[30px] overflow-hidden shadow-inner">
                  <img src={course.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest">Changer la photo</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-125 transition-transform duration-500">
                    🖼️
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-gray-900">Clique pour choisir une photo</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Portrait recommandé</p>
                  </div>
                </div>
              )}
            </div>
    </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Description Longue & Stickers ✨</label>
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
              <MenuBar 
                      imageCount={imageCount} 
                       setImageCount={setImageCount}
                       editor={editor} />
              <EditorContent editor={editor} className="p-6 min-h-[200px] outline-none prose prose-purple text-sm" />
            </div>
          </div>
        </div>
        {/* --- SECTION MATÉRIEL (Uniquement si c'est un métier) --- */}
        {(course.productType === 'Metier' &&
          ['Mode & Design','Art Culinaire','Agro-Business'].includes(course.category)) && ( 
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-4 px-4">
              <label className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">
                🛠️ Matériel & Fournitures
              </label>
              <button 
                type="button"
                onClick={addMaterial}
                className="text-[9px] font-black bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full uppercase hover:bg-purple-600 hover:text-white transition-all"
              >
                + Ajouter un élément
              </button>
            </div>
            

            <div className="space-y-3">
              {course.materials.map((item, idx) => (
                <div key={idx} className="flex gap-2 group animate-slideIn">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => updateMaterial(idx, e.target.value)}
                    placeholder="Ex: Machine à coudre, Farine T45..."
                    className="flex-1 bg-white p-5 rounded-[22px] border border-gray-100 font-bold text-sm outline-none focus:border-purple-300 shadow-sm transition-all"
                  />
                  {course.materials.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeMaterial(idx)}
                      className="bg-red-50 text-red-400 w-14 h-14 rounded-[20px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-300 font-medium mt-3 ml-4">
              * Ces éléments seront affichés sur la page de vente pour informer l'élève.
            </p>
          </div>
        )}

        {/* COLONNE 2 : TABLE LESSONS */}

    {
      course.productType === 'Metier' ? (
       <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest">2. Sommaire Dynamique</h2>
            <button type="button" onClick={addLesson} className="bg-gray-900 text-white px-6 py-2 rounded-2xl text-[10px] font-black">+ AJOUTER</button>
          </div>

        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 no-scrollbar">
        {lessons.map((lesson, index) => (
          <div key={index} className="bg-white p-6 rounded-[35px] border border-purple-50 shadow-xl shadow-purple-100/20 space-y-4 animate-fadeIn">
      
      {/* 1. HEADER DU CHAPITRE */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-gray-300 uppercase italic underline">Chapitre {index + 1}</span>
        <select 
          className="bg-gray-50 text-[9px] font-black p-2 rounded-xl border-none outline-none focus:ring-1 focus:ring-purple-400" 
          value={lesson.type}
          onChange={e => handleLessonChange(index, 'type', e.target.value)}
        >
          <option value="video">📺 VIDÉO</option>
          <option value="audio">🎧 AUDIO</option>
          <option value="text">📖 TEXTE</option>
          <option value="pdf">📄 PDF / DOCUMENT</option>
        </select>
      </div>

      {/* 2. TITRE DU CHAPITRE (Commun à tous) */}
      <input 
        required
        type="text" 
        placeholder="Titre du chapitre (ex: Introduction)" 
        className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-none focus:ring-2 focus:ring-purple-100" 
        value={lesson.title}
        onChange={e => handleLessonChange(index, 'title', e.target.value)} 
      />

      {/* 3. AFFICHAGE CONDITIONNEL SELON LE TYPE */}

        {/* CAS AUDIO : UPLOAD DIRECT */}

          {lesson.type === 'audio' && (
            <div className="relative w-full p-6 bg-blue-50 rounded-[30px] border-2 border-dashed border-blue-200 overflow-hidden">
              {/* Input caché spécifique à l'audio */}
              <input 
                id={`audio-upload-${index}`}
                type="file" 
                accept="audio/*" 
                className="hidden" 
                onChange={(e) => handleVideoUpload(e, index)} // On utilise la même fonction puissante
              />

              <div 
                onClick={() => document.getElementById(`audio-upload-${index}`).click()}
                className="flex flex-col items-center justify-center cursor-pointer group"
              >
                <span className="text-3xl mb-2 group-hover:animate-pulse">🎧</span>
                <p className="text-[10px] font-black uppercase text-blue-600">
                  {uploadProgress[index] > 0 && uploadProgress[index] < 100 
                    ? `Envoi du son : ${uploadProgress[index]}%` 
                    : lesson.mediaUrl ? "Audio prêt à l'écoute ✅" : "Téléverser le fichier Audio"}
                </p>
              </div>

              {/* Barre de progression bleue */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all"
                style={{ width: `${uploadProgress[index] || 0}%` }}
              ></div>
            </div>
          )}
      
     {/* --- DEBUT DU BLOC CONDITIONNEL --- */}
        {lesson.type === 'pdf' ? (
                <div 
                  onClick={() => document.getElementById(`upload-pdf-lesson-${index}`).click()}
                  className="w-full p-8 bg-purple-50 rounded-[30px] border-2 border-dashed border-purple-200 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-all"
                >
                  <input 
                    type="file"
                    id={`upload-pdf-lesson-${index}`}
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, index, 'mediaUrl')} 
                  />
                  <span className="text-4xl mb-2">📄</span>
                  <p className="text-[11px] font-black uppercase text-purple-600">
                    {isUploading ? 'Chargement en cours...' : lesson.mediaUrl ? "Document chargé avec succès ✅" : "Téléverser le cours PDF"}
                  </p>
                  {lesson.mediaUrl && <p className="text-[8px] text-gray-400 mt-2 truncate max-w-[250px] italic">{lesson.mediaUrl}</p>}
                </div>
              ) : (
                <>
                  {/* --- CAS VIDÉO : AVEC SÉLECTEUR DE SOURCE --- */}
                  {lesson.type === 'video' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-full max-w-[320px] mx-auto">
                        <button 
                          type="button"
                          onClick={() => handleLessonChange(index, 'videoSource', 'cloudinary')}
                          className={`flex-1 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${lesson.videoSource !== 'youtube' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400'}`}
                        >
                          📁 Fichier Local
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleLessonChange(index, 'videoSource', 'youtube')}
                          className={`flex-1 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${lesson.videoSource === 'youtube' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}
                        >
                          🔴 Lien YouTube
                        </button>
                      </div>

                      {lesson.videoSource === 'youtube' ? (
                        <div className="p-6 bg-red-50 border-2 border-dashed border-red-200 rounded-[30px] animate-slideIn text-center">
                          <span className="text-3xl mb-3">🎬</span>
                          <input 
                            type="text" 
                            placeholder="Colle le lien YouTube ou Vimeo ici..." 
                            className="w-full p-4 bg-white border-2 border-red-100 rounded-2xl font-bold text-xs outline-none focus:border-red-400 transition-all text-center"
                            value={lesson.mediaUrl}
                            onChange={(e) => handleLessonChange(index, 'mediaUrl', e.target.value)} 
                          />
                        </div>
                        
                      ) : (
                        <div className="relative w-full p-6 bg-purple-50 rounded-[30px] border-2 border-dashed border-purple-200 overflow-hidden text-center">
                          <input 
                            type="file" 
                            id={`video-upload-${index}`} 
                            className="hidden" 
                            accept="video/*" 
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            onChange={(e) => handleVideoUpload(e, index)} 
                          />
                          <div className="absolute bottom-0 left-0 h-1 bg-purple-600 transition-all" style={{ width: `${uploadProgress[index] || 0}%` }}></div>
                          <div 
                            onClick={uploadingIndex === index ? undefined : () => document.getElementById(`video-upload-${index}`).click()}
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <span className="text-3xl mb-2 italic">🎥</span>
                            <p className="text-[10px] font-black uppercase text-purple-600">
                              {uploadProgress[index] > 0 && uploadProgress[index] < 100 ? `Téléchargement : ${uploadProgress[index]}%` : lesson.mediaUrl ? "Vidéo prête ✅" : "Cliquer pour uploader la vidéo"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

            {/* --- CAS AUDIO : UPLOAD DIRECT (SANS SÉLECTEUR YOUTUBE) --- */}
            {/* {lesson.type === 'audio' && (
              <div className="relative w-full p-6 bg-blue-50 rounded-[30px] border-2 border-dashed border-blue-200 overflow-hidden text-center animate-fadeIn">
                <input 
                  type="file" 
                  id={`audio-upload-${index}`} 
                  className="hidden" 
                  accept="audio/*" 
                  onChange={(e) => handleVideoUpload(e, index)} 
                />
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all" style={{ width: `${uploadProgress[index] || 0}%` }}></div>
                <div 
                  onClick={uploadingIndex === index ? undefined : () => document.getElementById(`audio-upload-${index}`).click()}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-3xl mb-2">🎧</span>
                  <p className="text-[10px] font-black uppercase text-blue-600">
                    {uploadProgress[index] > 0 && uploadProgress[index] < 100 ? `Envoi : ${uploadProgress[index]}%` : lesson.mediaUrl ? "Audio prêt ✅" : "Téléverser le fichier Audio"}
                  </p>
                </div>
              </div>
            )} */}
          </>
          )}


      {/* 4. CONTENU TEXTE OU PETITE NOTE */}
      {lesson.type === 'text' ? (
        <div className="space-y-2">
          <label className="text-[9px] font-black text-purple-400 uppercase ml-2">Contenu de la leçon écrite ✨</label>
           <RichEditor 
            content={lesson.description} 
            onChange={(html) => handleLessonChange(index, 'description', html)} 
          />
        </div>
      ) : (
        <textarea 
          placeholder={lesson.type === 'pdf' ? "Petite note sur ce document..." : "Petites notes sous le média (optionnel)..."} 
          className="w-full p-4 bg-gray-50 rounded-2xl text-xs outline-none min-h-[80px] resize-none"
          value={lesson.description}
          onChange={e => handleLessonChange(index, 'description', e.target.value)}
        />
      )}

      {/* 5. PIÈCE JOINTE (Caché si c'est déjà un PDF) */}
      {(lesson.type !== 'pdf') && (
        <div className="mt-6 p-5 bg-gray-50/50 rounded-[25px] border border-dashed border-gray-200">
          <label className="text-[10px] font-black uppercase text-gray-400 italic mb-3 block">📎 Ressource d'accompagnement (Patron, Recette...)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              onClick={() => document.getElementById(`upload-attach-${index}`).click()}
              className="cursor-pointer bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-center gap-2 hover:bg-purple-50 transition-all"
            >
              <span className="text-[10px] font-black uppercase text-purple-600">
                
                {
                  isUploading ? 'Chargement en cours...' : 
                  lesson.attachmentUrl ? 'Changer le fichier' :  'Téléverser le fichier'  }
              </span>
            </div>
            <input 
              type="file" id={`upload-attach-${index}`} className="hidden" accept=".pdf,.zip"
              onChange={(e) => handleFileUpload(e, index, 'attachmentUrl')} 
            />
            <div className="bg-white/50 p-4 rounded-xl text-[10px] font-bold text-gray-400 truncate italic border border-gray-50">
              {lesson.attachmentName || "Aucun fichier joint"}
            </div>
          </div>
        </div>
      )}

      {/* 6. PIED DE CHAPITRE (DURÉE & GRATUIT) */}
      <div className="flex gap-4">
        {lesson.type !== 'text' && lesson.type !== 'pdf' && (
          <input 
            type="text" 
            placeholder="Durée (ex: 12:45)" 
            className="flex-1 p-4 bg-gray-50 rounded-2xl text-[10px] outline-none" 
            value={lesson.duration}
            onChange={e => handleLessonChange(index, 'duration', e.target.value)} 
          />
        )}
        <div className="flex items-center gap-2 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <input 
            type="checkbox" 
            className="w-4 h-4 accent-purple-600"
            checked={lesson.isFree}
            onChange={e => handleLessonChange(index, 'isFree', e.target.checked)} 
          />
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Offert</label>
        </div>
      </div>
          </div>
         ))}
        </div>
          
        </div>
          ):(
            <div className="p-10 bg-purple-50 rounded-[40px] border-2 border-dashed border-purple-200 text-center relative group">
                                {/* --- ZONE D'UPLOAD PDF (MODE PACK) --- */}

              
                  {/* L'INPUT CACHÉ POUR PDF */}
                  <input 
                    type="file" 
                    id="pack-file-upload"
                    accept=".pdf,.zip,.doc,.docx"
                    className="hidden" 
                    onChange={(e) =>handleFileUpload(e,null,'mainFileUrl')}
                  />

                    <div 
                      onClick={() => document.getElementById('pack-file-upload').click()}
                      className="cursor-pointer"
                    >
                      
                      
                      <span className="text-5xl block mb-4 group-hover:scale-105 transition-transform duration-500">📦</span>
                      <h3 className="font-black text-xs uppercase italic mb-2 text-gray-900">
                        {isUploading ?  
                        (<div className="absolute mt-7 inset-0 bg-white/60 flex items-center justify-center z-10 rounded-[30px]">
                          <span>Chargement en cours...</span>
                          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          )
                         : course.mainFileUrl ? 'Fichier chargé avec succès ✅' : "Charger ton Pack ou E-book"}
                      </h3>
                      
                      {course.mainFileUrl ? (
                        <p className="text-[10px] text-purple-600 font-bold break-all px-4">
                          {course.mainFileUrl}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-10">
                          Clique pour choisir ton PDF ou ton Pack ZIP sur ton appareil
                        </p>
                      )}
                    </div>

                    {/* Bouton de réinitialisation si besoin */}
                    {course.mainFileUrl && (
                      <button 
                        onClick={() => setCourse({...course, mainFileUrl: ''})}
                        className="mt-4 text-[9px] font-black text-red-400 uppercase underline"
                      >
                        Supprimer et changer de fichier
                      </button>
                    )}

                    

            </div>
          )
          
        }

        <div className='mt-12 pb-7'>

         {course.productType === 'Metier' &&
           ( <button type="button" onClick={addLesson} className="bg-gray-900 mb-7 text-white px-6 py-2 rounded-2xl text-[10px] font-black">
              + AJOUTER
            </button>)
         } 
          <button 
              type="submit" 
              disabled={loading}
              className={`w-full p-7 rounded-[40px] font-black uppercase tracking-widest transition-all ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white shadow-2xl hover:bg-purple-700 active:scale-95'
              }`}
                      >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Construction de ton Empire...</span>
              </div>
            ) : (
              "🚀 Lancer mon Empire Digital"
            )}
          </button>

        </div>

      </form>
      <ConfirmModal 
            isOpen={statusModal.isOpen}
            mode={statusModal.mode}
            title={statusModal.title}
            message={statusModal.message}
            onConfirm={() => {
                setStatusModal({ ...statusModal, isOpen: false });
                if (statusModal.mode === 'success') navigate('/admin/manage-courses');
            }}
            onCancel={() => setStatusModal({ ...statusModal, isOpen: false })}
            />
    </div>
  );
};

export default CreateCourse;