const UniversGrid = () => {
  const categories = [
    { name: 'Couture', img: 'https://picsum.photos/seed/pic1/800/600' },
    { name: 'Pâtisserie', img: 'https://picsum.photos/800/600' },
    { name: 'Coiffure', img: 'https://picsum.photos/800/600' },
    { name: 'Esthétique', img: 'https://picsum.photos/seed/pic1/800/600' },
    { name: 'Décoration', img: 'https://picsum.photos/seed/pic1/800/600' }
  ];

  return (
    <section className="py-24 px-6 max-w-[1800px] mx-auto">
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-12 text-center italic">
        Explorez les Univers de l'Excellence
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-[600px]">
        {categories.map((cat, i) => (
          <div key={i} className="relative group overflow-hidden rounded-[45px] cursor-pointer shadow-2xl">
            <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale hover:grayscale-0" alt={cat.name} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-purple-900/40 transition-colors" />
            <div className="absolute bottom-10 left-8 text-white z-10">
              <h3 className="text-2xl font-black uppercase italic leading-none">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UniversGrid;