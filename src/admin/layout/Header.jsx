import React from "react";
import { useSelector } from 'react-redux';

 


const Header = ({ onMenuClick }) => {

  const { user } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 py-4 z-30 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center mb-8">
      <div className="flex items-center gap-4 text-left">
        <button onClick={onMenuClick} className="md:hidden pl-3 text-2xl text-gray-900">☰</button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-none">Hello, {user?.storeName} ! 👑</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
            {user?.slogan}
          </p>
        </div>
      </div>

      <div className="pr-3 flex items-center gap-3">
        <button className="hidden md:block bg-gray-900 text-white px-5 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
          DIEU
        </button>
      </div>
    </header>
  );
};

export default Header;
