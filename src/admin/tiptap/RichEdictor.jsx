import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color';
import { Extension } from '@tiptap/core';



import { uploadToCloudinary }from '../components/courses/UploadCloudiry.jsx'



const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        fontSize =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize })
            .run();
        },

      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .run();
        },
    };
  },
});


// --- LE MENU (BARRE D'OUTILS) ---
const MenuBar = ({ editor, imageCount, uploading}) => {
  const fileInputRef = useRef(null);
  if (!editor) return null;
  
  const handleImageUpload = async (file) => {
        if (!file || !editor) return;

        if (imageCount >= 5) {
            alert("Limite de 5 images atteinte ❌");
            return;
        }

        try {
            

            const url = await uploadToCloudinary(file);
            if (!url) throw new Error("Upload échoué");

            editor
            .chain()
            .focus()
            .setImage({
                src: url,
                alt: "Image du cours",
                
            })
            .run();

        } catch (error) {
            console.error("Erreur upload image :", error);
            alert("Erreur lors de l'envoi de l'image ❌");
        } 
};


  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-100">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${editor.isActive('bold') ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>Gras</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${editor.isActive('italic') ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>Italique</button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-3 py-1 rounded-lg text-xs font-black ${editor.isActive('underline') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'}`}>Souligné</button>
      
  <span className="text-gray-300 self-center">|</span>
      <select
          className="text-xs bg-white border rounded px-2"
          onChange={e =>
            editor.chain().focus().setFontSize(`${e.target.value}px`).run()
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
        onClick={() => editor.chain().focus().setColor('#ef4444').run()}
        className="w-5 h-5 rounded-full bg-red-500"
      />


      <button
        type="button"
        onClick={() => editor.chain().focus().setColor('#3b82f6').run()}
        className="w-5 h-5 rounded-full bg-blue-500"
      />

      
      <span className="text-gray-200 self-center">|</span>

      {/* BOUTON IMAGE AVEC COMPTEUR */}
      <button
        type="button"
        disabled={imageCount >= 5 || uploading}
        onClick={() => fileInputRef.current?.click()}
        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${uploading ? 'animate-pulse text-purple-600' : 'bg-white text-gray-400 border border-gray-100'}`}
      >
        {uploading ? "Chargement..." : `📷 Photos (${imageCount}/5)`}
      </button>
      
      <input 
  type="file" 
  ref={fileInputRef} 
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  }} 
  className="hidden" 
  accept="image/*"
/>
    </div>
  );
};

// --- LE COMPOSANT PRINCIPAL ---
const RichEditor = ({ content, onChange }) => {
  const [imageCount, setImageCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize, // 🔥 IMPORTANT
      Color,
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Compter les images dans le JSON
      const json = editor.getJSON();
      let count = 0;
      const countImgs = (node) => {
        if (node.type === 'image') count++;
        if (node.content) node.content.forEach(countImgs);
      };
      countImgs(json);
      setImageCount(count);
      
      onChange(html); // 🚀 On renvoie le HTML au parent (la page profil)
    },
  });

  // Logique d'upload intégrée
 
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm transition-all focus-within:border-purple-200">
      <MenuBar editor={editor} imageCount={imageCount} uploading={uploading} />
      <EditorContent editor={editor} className="p-6 min-h-[250px] outline-none prose prose-purple max-w-none italic-none" />
    </div>
  );
};

export default RichEditor;