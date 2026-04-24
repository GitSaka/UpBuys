// import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { registerAdmin } from '../../store/slices/authThunks';
import { CATEGORIES } from '../constants/category';



const Register = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    telephone:'',
    email: '',
    slug:'',
    countryCode: '+229',
    password: '',
    confirmPassword: '',
    category:''
  });

  const dispatch = useDispatch();
 const { isLoading, error } = useSelector((state) => state.auth); // Récupère l'état depuis Redux

const westAfricanCountries = [
  { name: "Bénin", dialCode: 229 },
  { name: "Burkina Faso", dialCode: 226 },
  { name: "Cap-Vert", dialCode: 238 },
  { name: "Côte d'Ivoire", dialCode: 225 },
  { name: "Gambie", dialCode: 220 },
  { name: "Ghana", dialCode: 233 },
  { name: "Guinée", dialCode: 224 },
  { name: "Guinée-Bissau", dialCode: 245 },
  { name: "Liberia", dialCode: 231 },
  { name: "Mali", dialCode: 223 },
  { name: "Mauritanie", dialCode: 222 },
  { name: "Niger", dialCode: 227 },
  { name: "Nigéria", dialCode: 234 },
  { name: "Sénégal", dialCode: 221 },
  { name: "Sierra Leone", dialCode: 232 },
  { name: "Togo", dialCode: 228 }
];


  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [erro, setErro] = useState('');


  // 1. Logique du Slug Automatique
  console.log(formData);
  const generateSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

 const handleStoreNameChange = (e) => {
  const value = e.target.value;

  setFormData(prev => ({
    ...prev,
    storeName: value,
    slug: isSlugEditable ? prev.slug : generateSlug(value)
  }));
};

  // 2. Validation du téléphone (Bordures)
  const validatePhone = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, telephone: cleanValue }));
    setIsValidPhone(cleanValue.length >= 8 && cleanValue.length <= 10);
  };

  
  // 3. Envoi au Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setErro("Les mots de passe ne correspondent pas");
    }
   dispatch(registerAdmin(formData))
    .unwrap() // permet de gérer le succès / erreur directement
    .then(() => {
      window.location.href = "/admin/dashboard";
    })
    .catch(err => {
      setErro(err); // l'erreur vient du thunk
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-[40px] p-10 shadow-2xl animate-fadeIn">
        
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">CRÉER TON EMPIRE 👑</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Étape 1 : Identité & Sécurité</p>
        </header>
         

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* SECTION : NOM ET SLUG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nom de la Boutique</label>
              <input
                required
                type="text" placeholder="Ex: Aïcha Cosmétique"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold"
                onChange={handleStoreNameChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-purple-600 ml-2 flex justify-between">
                Lien de ton site
                <button type="button" onClick={() => setIsSlugEditable(!isSlugEditable)} className="text-[9px] underline">
                  {isSlugEditable ? "Valider" : "Modifier"}
                </button>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs italic">io/</span>
                <input
                  required 
                  type="text" value={formData.slug}
                  readOnly={!isSlugEditable}
                  className={`w-full pl-10 pr-4 py-4 rounded-2xl outline-none font-bold text-sm transition-all ${isSlugEditable ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-100 text-gray-400 border-none'}`}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>
            </div>
          </div>
          {/* --- CHAMP DOMAINE D'EXPERTISE --- */}
<div className="space-y-3 text-left animate-fadeIn">
  <label className="text-[10px] font-black uppercase italic tracking-[0.2em] text-gray-400 ml-4">
    Votre Domaine d'Empire 👑
  </label>
  
  <div className="relative">
    <select 
      name="category"
      required
      value={formData.category}
      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      className="w-full bg-white border border-gray-100 p-5 rounded-[25px] text-xs font-bold outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all appearance-none cursor-pointer italic shadow-sm"
    >
      <option value="">Sélectionnez votre métier...</option>
      
      {/* 🚀 LA BOUCLE MAGIQUE SUR TES CONSTANTES */}
      {CATEGORIES.map((cat) => (
        <option key={cat.id} value={cat.id} className="font-sans py-2">
          {cat.icon} {cat.title}
        </option>
      ))}
    </select>

    {/* PETITE FLÈCHE DESIGN (Optionnelle pour le look) */}
    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
      ▼
    </div>
  </div>
</div>

          {/* SECTION : EMAIL ET WHATSAPP */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email Pro</label>
              <input 
                type="email" 
                required
                placeholder="reine@empire.com"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* WHATSAPP */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">WhatsApp Business</label>
              
              {/* SELECT PAYS sous email */}
              <select
                required
                className="w-full mb-2 p-4 bg-gray-50 rounded-2xl outline-none text-sm font-bold"
                value={formData.countryName} // pour afficher le pays choisi
                onChange={(e) => {
                  const selected = westAfricanCountries.find(c => c.name === e.target.value);
                  if (selected) {
                    setFormData(prev => ({
                      ...prev,
                      countryName: selected.name,
                      countryCode: `+${selected.dialCode}`
                    }));
                  }
                }}
              >
                {westAfricanCountries.map(country => (
                  <option key={country.dialCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              {/* INPUT PHONE */}
              <div className="flex gap-2 items-center">
                <span className="px-4 py-4 bg-gray-50 rounded-2xl font-bold">{formData.countryCode}</span>
                <input 
                  required
                  type="tel" 
                  placeholder="07000000"
                  value={formData.telephone}
                  className={`w-full flex-1 p-4 rounded-2xl outline-none border-2 transition-all font-bold ${
                    formData.telephone.length === 0
                      ? 'border-transparent bg-gray-50'
                      : isValidPhone
                      ? 'border-green-500 bg-white'
                      : 'border-red-500 bg-white'
                  }`}
                  onChange={(e) => validatePhone(e.target.value)}
                />
              </div>
            </div>
          </div>


          {/* SECTION : MOT DE PASSE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
  
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
              Mot de passe
            </label>

                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none pr-12"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                  >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* CONFIRMATION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                Confirmation
              </label>

              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none pr-12"
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

          </div>
              {erro && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 text-center uppercase tracking-widest">
                  {error}
                </div>
              )}

          <button className="w-full bg-gray-900 hover:bg-purple-700 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] mt-6">
            {isLoading ? "Création en cours..." : "Valider et Continuer 👑"}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Register;