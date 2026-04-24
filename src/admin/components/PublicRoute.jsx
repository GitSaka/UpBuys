import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


export const PublicAdminRoute = () => {
 const {isAuthenticated,isLoading} = useSelector((state) => state.auth); 

  if (isLoading) return null; // spinner pro ici

  if (isAuthenticated) {
    // Si déjà connecté, on redirige vers le dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};