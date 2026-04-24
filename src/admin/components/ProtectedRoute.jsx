import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedAdminRoute = () => {
 const {isAuthenticated,isLoading} = useSelector((state) => state.auth); 
    
  if (isLoading) return null; // spinner pro ici
 
  if (!isAuthenticated) {
    
    // Si pas de token, on redirige vers le login
    return <Navigate to="/admin/auth/login" replace />;
  }

  // Si le token existe, on affiche la page demandée
  return <Outlet />;
};