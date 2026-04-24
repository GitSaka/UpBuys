// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../services/feedService';

const PrivateRoute = ({ children }) => {
  const token = getAuthToken();

  if (!token) {
    // Redirige vers login ou page d'accueil si non connecté
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;