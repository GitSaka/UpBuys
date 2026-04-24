import React from 'react';

const MaterialsManager = ({ materials, onAdd, onUpdate, onRemove }) => {
  return (
    <div className="mb-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-4 px-4">
        <label className="text-[10px] font-black uppercase text-gray-400 italic tracking-widest">
          🛠️ Matériel & Fournitures
        </label>
        <button type="button" onClick={onAdd} className="text-[9px] font-black bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full uppercase hover:bg-purple-600 hover:text-white transition-all">
          + Ajouter un élément
        </button>
      </div>

      <div className="space-y-3">
        {materials.map((item, idx) => (
          <div key={idx} className="flex gap-2 group animate-slideIn">
            <input 
              type="text" 
              value={item.name}
              onChange={(e) => onUpdate(idx, e.target.value)}
              placeholder="Ex: Machine à coudre, Farine T45..."
              className="flex-1 bg-white p-5 rounded-[22px] border border-gray-100 font-bold text-sm outline-none focus:border-purple-300 shadow-sm"
            />
            {materials.length > 1 && (
              <button type="button" onClick={() => onRemove(idx)} className="bg-red-50 text-red-400 w-14 h-14 rounded-[20px] flex items-center justify-center hover:bg-red-500 hover:text-white">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default MaterialsManager;