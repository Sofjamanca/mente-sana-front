import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Button, 
  message, 
  Table, 
  Space, 
  Modal,
  Typography,
  Tag,
  Select,
  Input,
  Badge,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  CrownOutlined,
  TeamOutlined,
  CalendarOutlined,
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

type RoleType = 'USER' | 'EDITOR' | 'ADMIN';

interface User {
  id: string;
  email: string;
  name: string;
  birthDate?: string;
  locality?: string;
  province?: string;
  role: RoleType;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    events: number;
    dailyEntries: number;
    notifications: number;
  };
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisWeek: number;
  usersWithActivity: number;
  usersByRole: {
    USER: number;
    EDITOR: number;
    ADMIN: number;
  };
}

const UsersManagement: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleType | 'ALL'>('ALL');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  // Cargar usuarios y estadísticas
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
    }
  }, [isAdmin, currentPage, pageSize, searchText, roleFilter, activeFilter]);

  const fetchUsers = async () => {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      
      if (searchText.trim()) {
        params.append('search', searchText.trim());
      }
      
      if (roleFilter !== 'ALL') {
        params.append('role', roleFilter);
      }
      
      if (activeFilter !== 'ALL') {
        params.append('isActive', (activeFilter === 'ACTIVE').toString());
      }

      const response = await fetch(`/api/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data); // Manejar respuesta con o sin paginación
        setTotalUsers(data.total || data.length);
      } else if (response.status === 403) {
        message.error('No tienes permisos para ver los usuarios');
        navigate('/home');
      } else {
        message.error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      message.error('Error de conexión al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: RoleType) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        message.success('Rol actualizado exitosamente');
        fetchUsers();
        fetchStats();
      } else {
        message.error('Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      message.error('Error de conexión');
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean, userName: string) => {
    const action = isActive ? 'activar' : 'desactivar';
    const actionPast = isActive ? 'activado' : 'desactivado';
    
    confirm({
      title: `¿Estás seguro de ${action} al usuario "${userName}"?`,
      content: isActive ? 
        'El usuario podrá volver a acceder a la plataforma' : 
        'El usuario no podrá iniciar sesión hasta que sea reactivado',
      okText: `Sí, ${action}`,
      okType: isActive ? 'primary' : 'danger',
      cancelText: 'Cancelar',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await fetch(`/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ isActive }),
          });

          if (response.ok) {
            message.success(`Usuario ${actionPast} exitosamente`);
            fetchUsers();
            fetchStats();
          } else {
            message.error(`Error al ${action} el usuario`);
          }
        } catch (error) {
          console.error('Error al cambiar estado del usuario:', error);
          message.error('Error de conexión');
        }
      },
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    confirm({
      title: `¿Estás seguro de eliminar al usuario "${userName}"?`,
      content: 'Esta acción eliminará todo el contenido asociado al usuario y no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            message.success('Usuario eliminado exitosamente');
            fetchUsers();
            fetchStats();
          } else {
            message.error('Error al eliminar el usuario');
          }
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          message.error('Error de conexión');
        }
      },
    });
  };

  const getRoleColor = (role: RoleType) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'EDITOR': return 'orange';
      case 'USER': return 'blue';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: RoleType) => {
    switch (role) {
      case 'ADMIN': return <CrownOutlined />;
      case 'EDITOR': return <EditOutlined />;
      case 'USER': return <UserOutlined />;
      default: return <UserOutlined />;
    }
  };



  const userColumns = [
    {
      title: 'Usuario',
      key: 'user',
      width: '20%',
      render: (_: unknown, record: User) => (
        <Space>
          <Badge 
            status={record.isActive ? 
              (record.role === 'ADMIN' ? 'error' : record.role === 'EDITOR' ? 'warning' : 'processing') : 
              'default'
            } 
          />
          <div>
            <div style={{ 
              fontWeight: 'bold',
              color: record.isActive ? 'inherit' : '#999',
              textDecoration: record.isActive ? 'none' : 'line-through'
            }}>
              {record.name}
            </div>
            <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      width: '12%',
      render: (role: RoleType) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Ubicación',
      key: 'location',
      width: '20%',
      render: (_: unknown, record: User) => (
        <div>
          {record.locality && record.province ? 
            `${record.locality}, ${record.province}` : 
            'No especificada'
          }
        </div>
      ),
    },
    {
      title: 'Último Login',
      key: 'lastLogin',
      width: '20%',
      render: (_: unknown, record: User) => {
        if (!record.lastLogin) {
          return (
            <div style={{ color: '#999', fontStyle: 'italic' }}>
              Nunca ha iniciado sesión
            </div>
          );
        }
        
        const loginDate = new Date(record.lastLogin);
        const now = new Date();
        const diffTime = now.getTime() - loginDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo = '';
        if (diffDays === 0) {
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            timeAgo = diffMinutes <= 1 ? 'Hace un momento' : `Hace ${diffMinutes} min`;
          } else {
            timeAgo = diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
          }
        } else if (diffDays === 1) {
          timeAgo = 'Ayer';
        } else if (diffDays < 7) {
          timeAgo = `Hace ${diffDays} días`;
        } else {
          timeAgo = loginDate.toLocaleDateString('es-ES');
        }
        
        return (
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {loginDate.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              marginTop: '2px' 
            }}>
              {loginDate.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} • {timeAgo}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => new Date(date).toLocaleDateString('es-ES'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '30%',
      render: (_: unknown, record: User) => (
        <Space wrap>
          <Tooltip title="Ver detalles">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => navigate(`/admin/users/${record.id}`)}
            />
          </Tooltip>
          
          <Select
            value={record.role}
            size="small"
            style={{ width: 90 }}
            onChange={(newRole: RoleType) => handleRoleChange(record.id, newRole)}
          >
            <Select.Option value="USER">USER</Select.Option>
            <Select.Option value="EDITOR">EDITOR</Select.Option>
            <Select.Option value="ADMIN">ADMIN</Select.Option>
          </Select>

          <Tooltip title={record.isActive ? "Desactivar usuario" : "Activar usuario"}>
            <Button 
              icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
              size="small" 
              type={record.isActive ? "default" : "primary"}
              onClick={() => handleStatusChange(record.id, !record.isActive, record.name)}
            >
              {record.isActive ? 'Desactivar' : 'Activar'}
            </Button>
          </Tooltip>
          
          <Tooltip title="Eliminar usuario">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              onClick={() => handleDeleteUser(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <Title level={2}>
          <TeamOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Gestión de Usuarios
        </Title>
        <p>Administra usuarios, roles y permisos de la plataforma</p>
      </div>

      {/* Estadísticas */}
      {stats && stats.usersByRole && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Usuarios"
                value={stats.totalUsers || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Administradores"
                value={stats.usersByRole.ADMIN || 0}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Editores"
                value={stats.usersByRole.EDITOR || 0}
                prefix={<EditOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Usuarios Activos"
                value={stats.activeUsers || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Usuarios Inactivos"
                value={stats.inactiveUsers || 0}
                prefix={<StopOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Nuevos Esta Semana"
                value={stats.newUsersThisWeek || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filtros y Crear Usuario */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="Buscar por nombre, email, localidad..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filtrar por rol"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="ALL">Todos los roles</Select.Option>
              <Select.Option value="ADMIN">Administradores</Select.Option>
              <Select.Option value="EDITOR">Editores</Select.Option>
              <Select.Option value="USER">Usuarios</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Estado"
              value={activeFilter}
              onChange={setActiveFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="ALL">Todos</Select.Option>
              <Select.Option value="ACTIVE">Activos</Select.Option>
              <Select.Option value="INACTIVE">Inactivos</Select.Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/users/create')}
              >
                Crear Usuario
              </Button>
              <Button 
                type="default" 
                icon={<CalendarOutlined />}
                onClick={() => navigate('/admin/users/stats')}
              >
                Estadísticas Detalladas
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabla de usuarios */}
      <Card title={`Usuarios (${totalUsers})`}>
        <Table 
          columns={userColumns} 
          dataSource={users} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            current: currentPage,
            pageSize: pageSize,
            total: totalUsers,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuarios`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
                setCurrentPage(1); // Reset to first page when changing page size
              }
            },
            pageSizeOptions: ['10', '25', '50', '100'],
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default UsersManagement; 