import React, { useState, useEffect } from 'react';
import { 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  EditOutlined,
  HeartOutlined,
  ExclamationCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,

} from '@ant-design/icons';
import { 
  Badge, 
  Dropdown, 
  Avatar, 
  Typography, 
  Space, 
  Modal, 
  List,
  Button,
  Divider,
  Empty,
} from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { useUser } from '../contexts/UserContext';
import '../styles/Navbar.css';

const { Title } = Typography;
const { confirm } = Modal;

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NavbarProps {
  theme: 'dark' | 'light';
  sidebarCollapsed?: boolean;
  sidebarOpen?: boolean;
  isMobile?: boolean;
  onSidebarToggle?: () => void;
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  theme, 
  sidebarCollapsed = false, 
  sidebarOpen = false,
  isMobile = false,
  onSidebarToggle,
}) => {
  // Ya no es necesario ajustar el ancho del scrollbar al usar navbar sticky dentro del contenido
  const navigate = useNavigate();
  // const { userProfile } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsPanelVisible, setNotificationsPanelVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const token = localStorage.getItem("token");
      
      const [notificationsRes, unreadRes] = await Promise.all([
        fetch("/api/notifications?limit=10", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/notifications/unread-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ]);

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data.notifications || []);
      }

      if (unreadRes.ok) {
        const countData = await unreadRes.json();
        setUnreadCount(countData.count || 0);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
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
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userData');
          localStorage.removeItem('userName');
          sessionStorage.clear();
          window.location.href = '/login';
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      },
    });
  };


  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Space>
          <EditOutlined />
          Editar Perfil
        </Space>
      ),
      onClick: () => navigate('/profile/edit'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <Space>
          <LogoutOutlined />
          Cerrar Sesión
        </Space>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${diffDays}d`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    setNotificationsPanelVisible(false);
  };

  const notificationsContent = (
    <div className="notifications-panel">
      <div className="notifications-header">
        <Title level={5} style={{ margin: 0 }}>
          Notificaciones
        </Title>
        {unreadCount > 0 && (
          <Button 
            type="link" 
            size="small" 
            onClick={markAllAsRead}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="notifications-list">
        {loadingNotifications ? (
          <div className="loading-container">
            <div className="ant-spin-dot">
              <i></i><i></i><i></i><i></i>
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <List
            size="small"
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title}
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-time">
                    {formatTimeAgo(notification.createdAt)}
                  </div>
                </div>
                {!notification.read && (
                  <div className="notification-dot" />
                )}
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="No hay notificaciones"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className={`navbar ${theme} ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="navbar-content">
        {/* Botón hamburguesa para sidebar (solo mobile, a la izquierda del logo) */}
        {isMobile && (
          <Button
            type="text"
            icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            className="navbar-button sidebar-toggle"
            size="large"
            onClick={() => onSidebarToggle?.()}
          />
        )}
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/home')}>
          <HeartOutlined className="logo-icon" />
          <span className="logo-text">Mente Sana</span>
        </div>

        {/* Controles centrales */}
        <div className="navbar-center">
         
              </div>

        {/* Controles de la derecha */}
        <div className="navbar-controls">
          {/* Botón hamburguesa removido de la navbar; ahora está en el header del sidebar */}

          
          
          {/* Notificaciones */}
          <Dropdown
            open={notificationsPanelVisible}
            onOpenChange={setNotificationsPanelVisible}
            dropdownRender={() => notificationsContent}
            placement="bottomRight"
            trigger={['click']}
          >
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                className="navbar-button"
                size="large"
              />
            </Badge>
          </Dropdown>

          {/* Menú de usuario */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div >
              <Avatar 
                size="default" 
                icon={<UserOutlined />}
                className="user-avatar"
              />
            
        </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;