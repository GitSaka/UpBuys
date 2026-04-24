const ProductTypeSwitch = ({ value, onChange }) => (
  <div className="flex gap-4 mb-8 bg-purple-50 p-2 rounded-[25px]">
    {['Metier', 'Outil'].map(type => (
      <button
        key={type}
        type="button"
        onClick={() => onChange(type)}
        className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase ${
          value === type ? 'bg-gray-900 text-white' : 'text-gray-400'
        }`}
      >
        {type === 'Metier' ? '🎥 Formation Métier' : '📂 Outil / E-book'}
      </button>
    ))}
  </div>
);

export default ProductTypeSwitch;
