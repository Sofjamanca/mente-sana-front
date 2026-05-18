import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useResponsive from '../hooks/useResponsive';
import { useUser } from '../contexts/UserContext';
import '../styles/Layout.css';


const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const { isMobile, sidebarOpen, closeSidebar, toggleSidebar } = useResponsive();
  const { theme, setTheme } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const userShellRoutes = [
    '/home',
    '/daily-summary',
    '/contacts',
    '/blogs',
    '/about-us',
    '/profile/edit',
    '/events/upcoming',
    '/events/past',
  ];
  const isBlogsRoute = location.pathname === "/blogs" || location.pathname.startsWith("/blogs/");
  const usesCustomDashboardShell =
    userShellRoutes.includes(location.pathname) ||
    isBlogsRoute ||
    /^\/events\/[^/]+$/.test(location.pathname);

  // Manejar cambios en el estado collapsed del sidebar
  const handleSidebarCollapse = (collapsed: boolean) => {
    console.log('Sidebar collapsed:', collapsed);
    setSidebarCollapsed(collapsed);
  };

  const handleSidebarToggle = () => {
    if (isMobile) {
      // En mobile, usar toggleSidebar del hook useResponsive
      console.log('Toggle sidebar mobile, current state:', sidebarOpen);
      toggleSidebar();
    } else {
      // En desktop, usar el estado collapsed
      console.log('Toggle sidebar desktop, current state:', sidebarCollapsed);
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  if (usesCustomDashboardShell) {
    return <>{children}</>;
  }

  return (
    <div className="layout-container">
      

      {/* Sidebar */}
      <Sidebar 
        theme={theme}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onLogout={onLogout}
        onCollapseChange={handleSidebarCollapse}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
      />

      

      {/* Contenido principal */}
      <main className={`main-content ${!isMobile ? 'with-sidebar' : ''} ${isMobile ? 'mobile' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navbar pegajosa dentro del flujo del contenido */}
        <Navbar 
          theme={theme} 
          sidebarCollapsed={sidebarCollapsed}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          onSidebarToggle={handleSidebarToggle}
          onThemeChange={setTheme}
        />
        <Content className="page-content">
         
          
          <div className="page-content-wrapper">
            {children}
          </div>
        </Content>
      </main>
    </div>
  );
};

export default Layout;
