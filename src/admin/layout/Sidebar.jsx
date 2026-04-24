import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation,Link } from "react-router-dom";
import { useSelector } from 'react-redux';


const Sidebar = ({ isOpen, onClose }) => {
  // const [bg,setBg] = useState(1)
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);


  const tab = [
    {
      id:1,
      name:"Tableau de bord",
      path:"/admin/dashboard"
    },
    {
      id:2,
      name:" Mes Produits",
      path:"/admin/productlist"
    },
    {
      id:3,
      name:"Mes Ventes"
    },
    {
      id:4,
      name:"Audience",
      path:"/admin/audiance"
    }
  ]
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white p-6 flex flex-col 
        transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:sticky md:top-0 md:h-screen md:shrink-0 md:shadow-none
      `}
    >
      {/* HEADER PROFIL */}
      <div className="flex items-center justify-between mb-10">
        <Link onClick={() => onClose()} to={`/admin/profile/${user?.slug}` } className="flex items-center gap-2">
          <img
            src={user?.avatar}
            className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover shadow-md"
            alt="Profil"
          />
          <span className="font-black uppercase tracking-tighter">Souveraine</span>
        </Link>
        <button onClick={onClose} className="md:hidden text-2xl">×</button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-4 text-left">
        {
          tab.map((p)=>(
              <button onClick={() => {

                          navigate(p.path);
                          onClose()
                        }} 
                key={p.id}  className={`w-full p-3 ${location.pathname === p.path ? "bg-purple-600" : "hover:bg-gray-800"}  rounded-xl font-bold text-[10px] uppercase tracking-widest text-left`}>
              {p.name}
              </button>
          ))
        }
        {/* <button className="w-full p-3 bg-purple-600 rounded-xl font-bold text-[10px] uppercase tracking-widest text-left">
          Tableau de bord
        </button>
        <button className="w-full p-3 hover:bg-gray-800 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-400 text-left">
          Mes Produits
        </button>
        <button className="w-full p-3 hover:bg-gray-800 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-400 text-left">
          Mes Ventes
        </button>
        <button className="w-full p-3 hover:bg-gray-800 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-400 text-left">
          Audience
        </button> */}

        <div className="pt-10">
          <button className="w-full p-3 border border-red-500/30 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest text-left">
            🔴 Urgence
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
