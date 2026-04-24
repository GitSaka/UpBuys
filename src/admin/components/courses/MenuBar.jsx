// components/courses/MenuBar.jsx
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const MenuBar = ({ editor }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-100 relative">
      {/* Gras */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded-lg text-xs font-black ${
          editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'
        }`}
      >
        Gras
      </button>

      {/* Italique */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded-lg text-xs font-black ${
          editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'
        }`}
      >
        Italique
      </button>

      {/* Souligné */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1 rounded-lg text-xs font-black ${
          editor.isActive('underline') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'
        }`}
      >
        Souligné
      </button>

      <span className="text-gray-300 self-center">|</span>

      {/* Couleurs */}
      {['#ef4444', '#3b82f6', '#22c55e'].map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={`w-5 h-5 rounded-full`}
          style={{ backgroundColor: color }}
        />
      ))}

      <button
        type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        className="px-2 py-1 text-[10px] font-black text-gray-400"
      >
        A
      </button>

      <span className="text-gray-300 self-center">|</span>

      {/* Taille de police */}
      <select
        className="text-xs bg-white border rounded px-2"
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
      >
        <option value="12">Petit</option>
        <option value="16">Normal</option>
        <option value="20">Grand</option>
        <option value="28">Titre</option>
      </select>

      {/* Citation */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-3 py-1 rounded-lg text-xs font-black ${
          editor.isActive('blockquote') ? 'bg-purple-600 text-white' : 'bg-white text-gray-400'
        }`}
      >
        Citation
      </button>

      {/* Emoji */}
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
      <span className="text-[10px] text-gray-400 font-bold self-center italic">
        ✨ Astuce : "Win + ." sur PC pour les Emojis
      </span>
    </div>
  );
};

export default MenuBar;
