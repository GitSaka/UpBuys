// components/courses/LessonEditor.jsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Blockquote from '@tiptap/extension-blockquote';
import FontSize from './fontSize';
import MenuBar from './MenuBar';

const LessonEditor = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, FontSize, Color, Blockquote],
    content: initialContent || '<p>Écris ta leçon ici... ✍️</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-2">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-h-[150px] outline-none text-sm prose prose-purple"
      />
    </div>
  );
};

export default LessonEditor;
