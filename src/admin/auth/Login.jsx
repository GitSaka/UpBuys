import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../store/slices/authThunks";
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
   const dispatch = useDispatch();
  const navigate = useNavigate();
   const { isLoading, error, user } = useSelector((state) => state.auth);
   

  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(loginAdmin(credentials));
};


useEffect(() => {
  if (user) {
    navigate("/admin/dashboard");
  }
}, [user, navigate]);


console.log("isLoading:", isLoading);
if (isLoading) return <p className="p-20 text-center font-black text-gray-300 animate-pulse uppercase italic tracking-widest">Chargement de l'Empire... ⏳</p>;


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl animate-fadeIn">
        
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Souveraine</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Accède à ton centre de commande</p>
        </header>
        
        

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email de ton Empire</label>
            <input 
              type="email" 
              placeholder="reine@empire.com"
              required
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium transition-all"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Mot de passe</label>
              <button type="button" className="text-[9px] font-bold text-purple-600 uppercase tracking-tighter">Oublié ?</button>
            </div>
            <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none pr-12"
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
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

            {error && (
              <div className="mt-4 flex justify-center">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium shadow-sm">
                  ❌ {error}
                </div>
              </div>
            )}


          <button 
            type="submit"
            className="w-full bg-gray-900 hover:bg-purple-700 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] mt-4"
          >
            {isLoading ? "Vérification..." : "Se Connecter👑"}
          </button>
        </form>
        

        <div className="mt-10 pt-6 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            Nouvelle Reine ? <span className="text-purple-600 cursor-pointer hover:underline">Créer un Empire</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;