import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  CalendarOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  MoonOutlined,
  SunOutlined,
  EditOutlined,
  LogoutOutlined,
  HeartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  FileDoneOutlined, 
  QuestionOutlined, 
  RollbackOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Menu, Switch, Button, Typography, Space, Modal } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const { Title, Text } = Typography;
const { confirm } = Modal;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/home",
    label: "Inicio",
    icon: <HomeOutlined />
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
  }
];

interface SidebarProps {
  theme: "dark" | "light";
  onThemeChange?: (theme: "dark" | "light") => void;
  onMenuClick?: (key: string) => void;
  onLogout?: () => void;
}

const ImprovedSidebar: React.FC<SidebarProps> = ({ onMenuClick, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useUser();

  const isDark = theme === "dark";

  const changeTheme = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    setTheme(newTheme);
  };

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
  }, []);

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
  navigate(e.key);
  onMenuClick?.(e.key);
};

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        minWidth: collapsed ? 80 : 320,
        width: collapsed ? 80 : '20vw',
        maxWidth: collapsed ? 80 : 400,
        background: isDark ? '#001529' : '#fff',
        borderRight: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        padding: collapsed ? '16px 12px' : '20px 24px',
        borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
        background: isDark ? '#002140' : '#fafafa',
        transition: 'all 0.2s'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          marginBottom: collapsed ? '0' : '16px'
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <HeartOutlined style={{
                fontSize: '24px',
                color: '#ff4d4f',
                marginRight: '12px'
              }} />
              <Title
                level={4}
                style={{
                  color: isDark ? '#fff' : '#000',
                  margin: '0',
                  fontWeight: 600
                }}
              >
                Mente Sana
              </Title>
            </div>
          )}
          {collapsed && (
            <HeartOutlined style={{
              fontSize: '24px',
              color: '#ff4d4f'
            }} />
          )}
        </div>

        {!collapsed && (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text style={{
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                fontSize: '12px'
              }}>
                Tema
              </Text>
              <Switch
                size="small"
                checked={isDark}
                onChange={changeTheme}
                checkedChildren={<MoonOutlined style={{ fontSize: '10px' }} />}
                unCheckedChildren={<SunOutlined style={{ fontSize: '10px' }} />}
                style={{
                  backgroundColor: isDark ? '#1890ff' : '#52c41a'
                }}
              />
            </div>
            <Text style={{
              color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
              fontSize: '11px',
              fontStyle: 'italic'
            }}>
              Tu bienestar, nuestra prioridad
            </Text>
          </Space>
        )}
      </div>

      {/* Botón de colapsar */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        style={{
          position: 'absolute',
          top: '16px',
          right: '-12px',
          zIndex: 1000,
          background: isDark ? '#1890ff' : '#fff',
          border: `1px solid ${isDark ? '#1890ff' : '#d9d9d9'}`,
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: isDark ? '#fff' : '#1890ff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />

      {/* Menú */}
      <div style={{ flex: 1 }}>
        <Menu
          theme={theme}
          onClick={onClick}
          style={{
            border: 'none',
            fontSize: '14px',
            background: 'transparent'
          }}
          defaultOpenKeys={collapsed ? [] : ["profile"]}
          selectedKeys={[mapPathToMenuKey(location.pathname)]} mode="inline"
          inlineCollapsed={collapsed}
          items={getMenuItems()}
        />
      </div>

      {/* Footer del Sidebar */}
      {!collapsed && (
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
          background: isDark ? '#000c17' : '#f9f9f9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${isDark ? '#1890ff' : '#52c41a'}, ${isDark ? '#722ed1' : '#1890ff'})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <UserOutlined style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <Text strong style={{
                color: isDark ? '#fff' : '#000',
                fontSize: '14px',
                display: 'block',
                lineHeight: '1.2'
              }}>
                {userProfile?.name || "Usuario"}
              </Text>
              <Text style={{
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                fontSize: '12px'
              }}>
                Conectado
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedSidebar;