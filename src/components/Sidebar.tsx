import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  CalendarOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  EditOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  FileDoneOutlined, 
  QuestionOutlined, 
  RollbackOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { Menu, Button, Typography, Modal } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "../styles/Sidebar.css";

const { Text } = Typography;
const { confirm } = Modal;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/home",
    label: "Inicio",
    icon: <HomeOutlined />
  },
 
  {
    key: "events",
    label: "Eventos",
    icon: <CalendarOutlined />,
    children: [
      { key: "/events/upcoming", label: "Próximos Eventos", icon: <QuestionOutlined /> },
      { key: "/events/past", label: "Eventos Pasados", icon: <RollbackOutlined /> },
    ],
  },
  {
    key: "/daily-summary",
    label: "Resumen Diario",
    icon: <CommentOutlined />,
  },
  {
    key: "/blogs",
    label: "Blogs",
    icon: <FileDoneOutlined />,
  },
  {
    key: "/contacts",
    label: "Contactos",
    icon: <PhoneOutlined />,
  },
  {
    key: "/about-us",
    label: "Acerca de",
    icon: <InfoCircleOutlined />,
  },
  {
    key: "profile",
    label: "Mi Perfil",
    icon: <UserOutlined />,
    children: [
      {
        key: "/profile/edit",
        label: "Editar Perfil",
        icon: <EditOutlined />,
      },
      {
        key: "logout",
        label: "Cerrar Sesión",
        icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
      },
    ],
  }
];

interface SidebarProps {
  theme: "dark" | "light";
  onThemeChange?: (theme: "dark" | "light") => void;
  onMenuClick?: (key: string) => void;
  onLogout?: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ImprovedSidebar: React.FC<SidebarProps> = ({ 
  onMenuClick, 
  onLogout, 
  isMobile = false, 
  isOpen = false, 
  onClose,
  onCollapseChange,
  collapsed = false,
  onToggleCollapse
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useUser();

  const isDark = theme === "dark";



  const { userProfile, setUserProfile, isAdmin } = useUser();

  // Generar items del menú dinámicamente basado en el rol
  const getMenuItems = (): MenuItem[] => {
    const baseItems = [...items];
    
    // Si es admin, agregar opción de panel de administración con submenú
    if (isAdmin) {
      baseItems.splice(1, 0, {
        key: "admin",
        label: "Panel de Admin",
        icon: <SettingOutlined />,
        children: [
          {
            key: "/admin",
            label: "Resumen",
            icon: <InfoCircleOutlined />,
          },
          {
            key: "/admin/blogs",
            label: "Gestión de Blogs",
            icon: <FileDoneOutlined />,
          },
          {
            key: "/admin/events",
            label: "Gestión de Eventos",
            icon: <CalendarOutlined />,
          },
          {
            key: "/admin/users",
            label: "Gestión de Usuarios",
            icon: <UserOutlined />,
          },
        ],
      });
    }
    
    return baseItems;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedName = localStorage.getItem("userName");

    const fetchUserProfile = async () => {
      if (!token) return;

      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUserProfile(data);
      localStorage.setItem("userName", data.name); // actualiza cache
    };

    // Si hay un nombre cacheado, usalo de entrada
    if (cachedName) {
      setUserProfile(prev => ({ ...prev, name: cachedName }));
    }

    fetchUserProfile();

    // Escuchar cambios al localStorage (evento externo entre pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName') {
        setUserProfile(prev => ({ ...prev, name: e.newValue ?? '' }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setUserProfile]);

  // función opcional para mapear rutas a keys
  const mapPathToMenuKey = (pathname: string): string => {
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname === "/events/upcoming") return "/events/upcoming";
    if (pathname === "/events/past") return "/events/past";
    if (pathname.startsWith("/events")) return "events";
    if (pathname.startsWith("/admin")) return "admin";
    return pathname;
  };

  // El tema ahora se maneja completamente por UserContext
  useEffect(() => {
    // Limpiar localStorage antiguo si existe
    const oldTheme = localStorage.getItem("theme");
    if (oldTheme && !localStorage.getItem("userTheme")) {
      localStorage.setItem("userTheme", oldTheme);
      localStorage.removeItem("theme");
    }
  }, []);

  // Notificar cambios en el estado colapsado
  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  const handleLogout = () => {
    confirm({
      title: '¿Estás seguro de que quieres cerrar sesión?',
      icon: <ExclamationCircleOutlined />,
      content: 'Perderás cualquier cambio no guardado.',
      okText: 'Sí, cerrar sesión',
      okType: 'danger',
      cancelText: 'Cancelar',
      centered: true,
      onOk() {
        try {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userData');
          // Mantener el tema guardado
          // localStorage.removeItem('theme');

          sessionStorage.clear();

          if (onLogout) {
            onLogout();
          } else {
            // Redirección por defecto a la página de login hasta que tengamos landing
            window.location.href = '/login';
          }

          console.log('Sesión cerrada exitosamente');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          Modal.error({
            title: 'Error',
            content: 'Hubo un problema al cerrar la sesión. Por favor, intenta nuevamente.',
          });
        }
      },
      onCancel() {
        console.log('Logout cancelado');
      },
    });
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("Navegando a:", e.key);

    // Manejar cerrar sesión de manera especial
    if (e.key === 'logout') {
      handleLogout();
      return;
    }

    // En móvil, cerrar la sidebar después de navegar
    if (isMobile && onClose) {
      onClose();
    }

    navigate(e.key);
    onMenuClick?.(e.key);
  };



  const handleClose = () => {
    if (onClose) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 300);
    }
  };

  // Clases CSS dinámicas
  const sidebarClasses = [
    'sidebar-container',
    isDark ? 'dark' : 'light',
    collapsed ? 'collapsed' : '',
    isMobile ? 'mobile' : '',
    isOpen ? 'open' : '',
    isClosing ? 'closing' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
          onClick={handleClose}
        />
      )}
      
      <div className={sidebarClasses}>
        {/* Header del Sidebar */}
        <div className="sidebar-header">
          <Button
            type="text"
            icon={
              isMobile
                ? <CloseOutlined />
                : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)
            }
            onClick={() => {
              if (isMobile) {
                handleClose();
              } else {
                onToggleCollapse?.();
              }
            }}
            className="navbar-button sidebar-toggle"
            size="large"
          />
        </div>

        {/* Menú - Área scrollable */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Menu
            theme={theme}
            onClick={onClick}
            className="sidebar-menu"
            defaultOpenKeys={collapsed ? [] : ["profile"]}
            selectedKeys={[mapPathToMenuKey(location.pathname)]}
            mode="inline"
            inlineCollapsed={isMobile ? false : collapsed}
            items={getMenuItems()}
          />
        </div>

        {/* Footer del Sidebar - Siempre visible al final */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <UserOutlined style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            {!collapsed && (
              <div className="user-info">
                <Text className="user-name">
                  {userProfile?.name || "Usuario"}
                </Text>
                <Text className="user-status">
                  Conectado
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImprovedSidebar;