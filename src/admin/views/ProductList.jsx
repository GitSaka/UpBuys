import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import ConfirmModal from '../components/product/ConfirmModal';
import api from '../services/api'

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, id: null, title: '' });
  const [loadingr, setLoadingr] = useState(false);
   const [loadingId, setLoadingId] = useState(null);


  // 2. Modifie ta fonction de suppression
const openDeleteModal = (id, title) => {
  setModal({ isOpen: true, id: id, title: title });
};

const confirmDelete = async () => {
  const id = modal.id;
  setLoadingr(true)
  try {
    await api.delete(`/admin/delete-course/${id}`);
    setCourses(courses.filter(c => c._id !== id));
    setModal({ ...modal, isOpen: false }); // Ferme le modal après succès
  } catch (err) {
    console.log(err)
  } finally {
        setLoadingr(false);
      }
};

  // 1. CHARGEMENT DES VRAIES DONNÉES DEPUIS LE BACKEND
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const res = await api.get('/admin/getAll-courses');
        
        setCourses(res.data.data);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Actif' ? 'Brouillon' : 'Actif';
         setLoadingId(id); // 👈 active le loading UNIQUEMENT pour cette ligne
          try {
            await api.patch(`/admin/courses/${id}/status`, { status: newStatus });
            // Mise à jour de l'état local
            setCourses(courses.map(c => c._id === id ? { ...c, status: newStatus } : c));
          } catch (err) {
            alert("Erreur lors du changement de statut");
            console.log(err)
          
          }finally {
            setLoadingId(null); // 👈 stop le loading
          }
};

 
  
 if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.3em] text-gray-300">Synchronisation de l'Empire...</div>;
  return (
    <div className="animate-fadeIn pb-10">
      {/* HEADER : Recherche + Nouveau Bouton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-left">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher une formation..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none text-sm"
          />
        </div>
        
        <button 
          onClick={() => navigate("/admin/courses/new")} 
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-purple-100 active:scale-95 transition-all"
        >
          + Créer un Empire
        </button>
      </div>

      {/* TABLEAU DES FORMATIONS */}
      {courses.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-gray-400">
              Aucun produit n'existe pour le moment 📦
            </h2>
            <p className="text-sm text-gray-300 mt-2">
              Commencez par créer votre premier produit.
            </p>
          </div>
      ) :(
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-20 text-center font-black text-gray-300 uppercase tracking-widest animate-pulse">Synchronisation des coffres...</div>
                ) : (
                  <div className="overflow-x-auto text-left">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Contenu Digital</th>
                          <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Prix CFA</th>
                          <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Engagement</th>
                          <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Ventes</th>
                          <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                          <th className="p-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {courses.map((course) => (
                          <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <img src={course.thumbnail} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                                <div>
                                  <p className="font-black text-gray-900 text-sm leading-tight">{course.title}</p>
                                  <p className="text-[10px] text-purple-400 font-bold uppercase">{course.lessons.length} Chapitres</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="font-black text-gray-900 text-sm">{course.price.toLocaleString()}</span>
                            </td>
                            <td className="p-6">
                              <span className="flex items-center gap-1 text-xs font-bold text-purple-600">❤️ {course.totalLikes}</span>
                            </td>
                            <td className="p-6">
                              <span className="text-xs font-black text-gray-900 bg-orange-50 text-orange-600 px-3 py-1 rounded-full italic">🔥 {course.salesCount}</span>
                            </td>
                            {/* Nouvelle Colonne Statut */}
                          <td className="p-6 text-center">
                          <button 
                            onClick={() => toggleStatus(course._id, course.status)}
                            disabled={loadingId === course._id}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                              course.status === 'Actif' 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            } ${loadingId === course._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {loadingId === course._id
                              ? '⏳ en cours...'
                              : course.status === 'Actif'
                                ? '● Actif'
                                : '○ Brouillon'}
                          </button>
                        </td>

                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => navigate(`/admin/edit-course/${course._id}`)}
                                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-900 hover:text-white transition-all"
                                >👁️</button>
                                <button 
                                  onClick={() => openDeleteModal(course._id, course.title)}
                                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
          </div>
        )}

        <ConfirmModal 
          isOpen={modal.isOpen}
          mode="delete"
          title="Supprimer l'Empire ?"
          message={`Es-tu sûre de vouloir supprimer ${modal.title} ? Toutes les leçons seront perdues.`}
          onConfirm={confirmDelete}
          loadingr = {loadingr}
          onCancel={() => setModal({ ...modal, isOpen: false })}
          type="danger"
      />
      </div>
)}
      
    </div>
  );
};

export default ManageCourses;