import React from 'react';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';
import '../styles/MobileMenuButton.css';

interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick, isOpen = false }) => {
  const { theme } = useUser();
  const isDark = theme === 'dark';

  return (
    <Button
      type="text"
      icon={<MenuOutlined />}
      onClick={onClick}
      className={`mobile-menu-btn ${isOpen ? 'open' : ''} ${isDark ? 'dark' : 'light'}`}
      size="large"
    />
  );
};

export default MobileMenuButton;





