import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { userProfile, isAdmin } = useUser();
  
  // Si no hay token, redirigir al login
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere admin y no es admin, redirigir al home
  // El backend ya maneja la verificación real de permisos
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // Si el perfil aún se está cargando
  if (!userProfile && token) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 