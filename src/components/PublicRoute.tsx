import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Spin } from 'antd';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { userProfile } = useUser();
  
  // Si hay token, verificar si el perfil está cargado
  const token = localStorage.getItem('token');
  
  // Si hay token pero el perfil aún se está cargando, mostrar spinner
  if (token && !userProfile) {
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

  // Si el usuario está autenticado, redirigir según su rol
  if (token && userProfile) {
    const userRole = userProfile.role?.toLowerCase();
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Si no está autenticado, mostrar la página pública
  return <>{children}</>;
};

export default PublicRoute;
