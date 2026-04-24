// src/components/admin/AcademyManager.jsx
import React from 'react';
import LessonEditor from './LessonEditor'; // Importe ton éditeur ici

const AcademyManager = ({ lessons, addLesson, updateLesson }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-purple-600 font-black text-xs uppercase tracking-widest italic">Sommaire du Métier</h2>
        <button type="button" onClick={addLesson} className="bg-gray-900 text-white px-6 py-2 rounded-2xl text-[10px] font-black hover:bg-purple-600 transition-all">+ AJOUTER</button>
      </div>

      <div className="space-y-6">
        {lessons.map((lesson, index) => (
          <div key={index} className="bg-white p-8 rounded-[40px] border border-purple-50 shadow-xl shadow-purple-100/20 space-y-4 animate-slideIn">
            {/* Header, Titre, Type, MediaUrl, Description (TipTap), et ton champ ATTACHMENT */}
            {/* COPIE ICI TOUT TON CODE DE LA TRANCHE 4 (le map des leçons) */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademyManager;