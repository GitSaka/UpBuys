import { Navigate} from 'react-router-dom';
import { getAuthToken } from '../services/feedService';


export const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem('fanToken');
  const token = getAuthToken();
  
  if (!token) {
    // Pas de passeport ? Retour à la case départ (Home)
    return <Navigate to="/admin/auth/login" replace />;
  }
  
  
  return children;
};




