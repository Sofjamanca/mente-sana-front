import React from 'react';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  FileDoneOutlined, 
  UserOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface PageNavbarProps {
  theme: 'dark' | 'light';
}

const PageNavbar: React.FC<PageNavbarProps> = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: '/home', label: 'Inicio', icon: <HomeOutlined /> },
    { key: '/daily-summary', label: 'Mi Día', icon: <PlusOutlined /> },
    { key: '/events', label: 'Eventos', icon: <CalendarOutlined /> },
    { key: '/blogs', label: 'Blogs', icon: <FileDoneOutlined /> },
    { key: '/contacts', label: 'Contactos', icon: <UserOutlined /> }
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      onClick={({ key }) => navigate(key)}
      style={{
        marginBottom: '16px',
        background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
        borderBottom: `1px solid ${theme === 'dark' ? '#303030' : '#f0f0f0'}`,
      }}
    />
  );
};

export default PageNavbar;





