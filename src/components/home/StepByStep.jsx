// src/components/home/StepByStep.jsx
const StepByStep = () => {
  const steps = [
    { title: "Choisis ton Maître", desc: "Couture, Pâtisserie... accède au savoir des meilleurs coachs d'Afrique.", icon: "👑" },
    { title: "Pratique en Direct", desc: "Regarde les cours et pose tes questions dans le cercle privé.", icon: "💬" },
    { title: "Expose tes Succès", desc: "Poste tes créations sur le Feed et attire tes premiers clients.", icon: "🚀" }
  ];

  return (
    <section className="py-20 bg-gray-50/50 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <div key={i} className="text-center space-y-4 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:bg-purple-600 transition-all duration-500">
              <span className="text-3xl">{step.icon}</span>
            </div>
            <h3 className="font-black italic uppercase text-sm tracking-tighter">{step.title}</h3>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepByStep