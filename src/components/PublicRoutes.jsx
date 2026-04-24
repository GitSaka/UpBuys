// src/routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
 const token = localStorage.getItem('fanToken');
const PublicRoute = ({ children }) => {
  if (token) {
    return <Navigate to="/saka/feed" replace />;
  }
  return children;
};

export default PublicRoute;
