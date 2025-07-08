import { useState, useEffect } from "react";
import { ChevronDown, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SvgIconProps {
  className?: string; 
}

interface NavbarProps {
  navItems?: Array<{ id: string; label: string }>;
  onNavigate?: (sectionId: string) => void;
  showNavigation?: boolean;
}

const HeartIcon = ({ className }: SvgIconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const Navbar = ({ 
  navItems = [], 
  onNavigate,
  showNavigation = true 
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { userProfile, setUserProfile, isAdmin, theme, setTheme } = useUser();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      
      // Limpiar contexto de usuario
      setUserProfile(null);
      
      // Cerrar menú
      setUserMenuOpen(false);
      
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const goToPanel = () => {
    if (isAdmin) {
      window.location.href = '/admin';
    } else {
      window.location.href = '/home';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleNavigation = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      // Comportamiento por defecto para scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    setMobileMenuOpen(false); // Cerrar menú móvil al navegar
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userMenuOpen && !target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className={`landing-navbar ${theme}`}>
      <div className="landing-navbar-logo" onClick={() => window.location.href = '/'}>
        <HeartIcon className="landing-navbar-logo-icon" />
        <span className="landing-navbar-logo-text">Mente Sana</span>
      </div>
      
      {/* Menú Desktop */}
      {showNavigation && (
        <div className="navbar-menu-desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`navbar-menu-item ${theme}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      
      <div className="navbar-actions">
        {/* Toggle de tema */}
        <button 
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          title={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
        >
          {theme === 'light' ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>
        
        {userProfile ? (
          <div className="user-menu-container">
            <button 
              className={`user-menu-trigger ${theme}`}
              onClick={toggleUserMenu}
            >
              <span className="user-name">Hola, {userProfile.name}</span>
              <ChevronDown className={`user-menu-arrow ${userMenuOpen ? 'open' : ''}`} size={16} />
            </button>
            
            {userMenuOpen && (
              <div className={`user-dropdown ${theme}`}>
                <button 
                  className={`user-dropdown-item ${theme}`}
                  onClick={goToPanel}
                >
                  <Settings size={16} />
                  <span>Panel Personal</span>
                </button>
                <button 
                  className={`user-dropdown-item logout ${theme}`}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="landing-login-button">
            Iniciar Sesión
          </a>
        )}
        
        {/* Botón hamburger para móvil */}
        {showNavigation && (
          <button 
            className={`mobile-menu-toggle ${theme}`}
            onClick={toggleMobileMenu}
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        )}
      </div>
      
      {/* Menú Móvil */}
      {showNavigation && (
        <div className={`navbar-menu-mobile ${mobileMenuOpen ? 'open' : ''} ${theme}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`navbar-menu-item-mobile ${theme}`}
            >
              {item.label}
            </button>
          ))}
          
          {/* Toggle de tema en móvil */}
          <button 
            className={`theme-toggle-mobile ${theme}`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} />
                <span>Modo Oscuro</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span>Modo Claro</span>
              </>
            )}
          </button>
          
          {userProfile ? (
            <div className="user-menu-mobile">
              <div className={`user-info-mobile ${theme}`}>
                <span className="user-name-mobile">{userProfile.name}</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
              </div>
              <button 
                className={`navbar-menu-item-mobile ${theme}`}
                onClick={goToPanel}
              >
                <Settings size={16} />
                <span>Ir al Panel</span>
              </button>
              <button 
                className={`navbar-menu-item-mobile logout ${theme}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <a href="/login" className="landing-login-button-mobile">
              Iniciar Sesión
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;