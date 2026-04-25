import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const Checkout = () => {
  const { productId } = useParams(); // ID du cours
 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // 1. CHARGER LES INFOS DU COURS (Vérifier le prix avant de payer)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/client/get-details/${productId}`);
        setCourse(res.data.data);
      } catch (err) {
        console.error("Erreur de récupération du cours"+ err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [productId]);

  // 2. LE MOTEUR DE PAIEMENT (LIAISON FEDAPAY)
  const handlePayment = async () => {
  try {
    setIsPaying(true);

    const res = await api.post('/payments/initiate', {
      courseId: course?._id
    });

    // ✅ Paiement nouveau ou existant
    if (res.data.success || res.data.paymentUrl) {
      window.location.href = res.data.paymentUrl;
    } else {
      alert(res.data.message || "Erreur d'initialisation. Réessayez ❌");
    }

  } catch (err) {
    alert("Erreur d'initialisation. Réessayez. ❌ " + (err.message || err));
  } finally {
    setIsPaying(false);
  }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">PRÉPARATION DE LA CAISSE... 🏛️</div>;

  return (
    <div className="min-h-screen bg-white font-sans italic-none">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-xl mx-auto">
        <div className="space-y-10 text-center">
          
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Finaliser l'achat 🔐</h1>
          
          {/* CARTE RÉCAPITULATIVE */}
          <div className="bg-gray-50 rounded-[45px] p-8 border border-gray-100 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden mb-6 shadow-lg">
              <img src={course?.thumbnail} className="w-full h-full object-cover" alt="Course" />
            </div>
            <h2 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-2">{course?.title}</h2>
            <p className="text-4xl font-black italic text-gray-900">{course?.price.toLocaleString()} <span className="text-lg">FCFA</span></p>
          </div>

          {/* MÉTHODES DE PAIEMENT (VISUEL UNIQUEMENT) */}
          <div className="flex justify-center items-center gap-6 opacity-40 grayscale">
            <span className="text-[10px] font-bold uppercase tracking-widest">MTN</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">MOOV</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">ORANGE</span>
          </div>

          {/* BOUTON FINAL */}
          <button 
            onClick={handlePayment}
            disabled={isPaying}
            className="w-full bg-gray-900 text-white py-6 rounded-[25px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-purple-200 hover:bg-purple-600 transition-all active:scale-95 disabled:bg-gray-300"
          >
            {isPaying ? "CONNEXION À LA BANQUE..." : "CONFIRMER & PAYER →"}
          </button>

          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">
            Paiement sécurisé par cryptage de bout en bout. <br />
            Aucune information bancaire n'est stockée sur nos serveurs.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Checkout;