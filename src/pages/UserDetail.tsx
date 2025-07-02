import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Button, 
  message, 
  Descriptions, 
  Space, 
  Typography,
  Tag,
  Select,
  Row,
  Col,
  Statistic,
  Avatar,
  Spin,
  List,
  Badge
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserOutlined, 
  EditOutlined, 
  CrownOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  FileTextOutlined,
  BulbOutlined,
  MessageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../styles/AdminPanel.css';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

type RoleType = 'USER' | 'EDITOR' | 'ADMIN';

interface UserDetail {
  id: string;
  email: string;
  name: string;
  birthDate?: string;
  locality?: string;
  province?: string;
  role: RoleType;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  posts?: Array<{
    id: string;
    title: string;
    createdAt: string;
    published: boolean;
  }>;
  events?: Array<{
    id: string;
    title: string;
    date: string;
    createdAt: string;
  }>;
  dailyEntries?: Array<{
    id: string;
    mood: number;
    date: string;
    notes?: string;
  }>;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
}

interface UserActivity {
  type: 'post' | 'event' | 'dailyEntry' | 'notification';
  id: string;
  title: string;
  date: string;
  extra?: {
    published?: boolean;
    eventDate?: string;
    mood?: number;
    notes?: string;
  };
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<UserActivity[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
    if (id) {
      fetchUser();
    }
  }, [isAdmin, id, navigate]);

  const fetchUser = async () => {

    try {
      const url = `/api/users/${id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const response_data = await response.json();
        
        const userData = response_data.user || response_data;
        setUser(userData);
        processActivity(userData);
      } else {
        const errorText = await response.text();
        
        if (response.status === 404) {
          message.error(`Usuario no encontrado (ID: ${id})`);
          navigate('/admin/users');
        } else if (response.status === 403) {
          message.error('No tienes permisos para ver este usuario');
          navigate('/admin/users');
        } else {
          message.error(`Error al cargar el usuario (${response.status}): ${errorText}`);
          navigate('/admin/users');
        }
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      message.error('Error de conexión al cargar el usuario');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const processActivity = (userData: UserDetail) => {
    const activities: UserActivity[] = [];

    // Agregar posts (con verificación)
    if (userData.posts && Array.isArray(userData.posts)) {
      userData.posts.forEach(post => {
        activities.push({
          type: 'post',
          id: post.id,
          title: `Creó el post: "${post.title}"`,
          date: post.createdAt,
          extra: { published: post.published }
        });
      });
    }

    // Agregar eventos (con verificación)
    if (userData.events && Array.isArray(userData.events)) {
      userData.events.forEach(event => {
        activities.push({
          type: 'event',
          id: event.id,
          title: `Creó el evento: "${event.title}"`,
          date: event.createdAt,
          extra: { eventDate: event.date }
        });
      });
    }

    // Agregar entradas diarias (con verificación)
    if (userData.dailyEntries && Array.isArray(userData.dailyEntries)) {
      userData.dailyEntries.forEach(entry => {
        activities.push({
          type: 'dailyEntry',
          id: entry.id,
          title: `Registró estado de ánimo: ${getMoodEmoji(entry.mood)}`,
          date: entry.date,
          extra: { mood: entry.mood, notes: entry.notes }
        });
      });
    }

    // Ordenar por fecha (más reciente primero)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setActivity(activities.slice(0, 20)); // Mostrar últimas 20 actividades
    
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😄';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
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

  const handleRoleChange = async (newRole: RoleType) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        message.success('Rol actualizado exitosamente');
        setUser({ ...user, role: newRole });
      } else {
        message.error('Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      message.error('Error de conexión');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'event': return <CalendarOutlined style={{ color: '#52c41a' }} />;
      case 'dailyEntry': return <BulbOutlined style={{ color: '#fa8c16' }} />;
      case 'notification': return <MessageOutlined style={{ color: '#722ed1' }} />;
      default: return <UserOutlined />;
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const age = user.birthDate ? dayjs().diff(dayjs(user.birthDate), 'year') : null;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/users')}
          style={{ marginBottom: 16 }}
        >
          Volver a Gestión de Usuarios
        </Button>
        
        <Title level={2}>
          <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Detalle de Usuario
        </Title>
      </div>

      <Row gutter={24}>
        {/* Información del Usuario */}
        <Col span={16}>
          <Card title="Información Personal" style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <div>
                  <Title level={3} style={{ margin: 0 }}>{user.name}</Title>
                  <Text type="secondary">{user.email}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={getRoleColor(user.role)} icon={getRoleIcon(user.role)}>
                      {user.role}
                    </Tag>
                  </div>
                </div>
              </div>

              <Descriptions bordered column={2}>
                <Descriptions.Item label="Email" span={2}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Nombre Completo" span={2}>
                  {user.name}
                </Descriptions.Item>
                <Descriptions.Item label="Edad">
                  {age ? `${age} años` : 'No especificada'}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Nacimiento">
                  {user.birthDate ? dayjs(user.birthDate).format('DD/MM/YYYY') : 'No especificada'}
                </Descriptions.Item>
                <Descriptions.Item label="Ubicación" span={2}>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {user.locality && user.province ? 
                    `${user.locality}, ${user.province}` : 
                    'No especificada'
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Registro">
                  {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Última Actualización">
                  {dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
              </Descriptions>

              <div>
                <Text strong>Cambiar Rol:</Text>
                <Select
                  value={user.role}
                  onChange={handleRoleChange}
                  style={{ marginLeft: 16, width: 120 }}
                >
                  <Select.Option value="USER">USER</Select.Option>
                  <Select.Option value="EDITOR">EDITOR</Select.Option>
                  <Select.Option value="ADMIN">ADMIN</Select.Option>
                </Select>
              </div>
            </Space>
          </Card>

          {/* Actividad Reciente */}
          <Card title="Actividad Reciente" style={{ marginBottom: 24 }}>
            <List
              dataSource={activity}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={item.title}
                    description={`${dayjs(item.date).format('DD/MM/YYYY HH:mm')} - ${dayjs(item.date).fromNow()}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'No hay actividad registrada' }}
            />
          </Card>
        </Col>

        {/* Estadísticas */}
        <Col span={8}>
          <Card title="Estadísticas" style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Statistic
                title="Posts Creados"
                value={user.posts?.length || 0}
                prefix={<FileTextOutlined />}
                suffix={
                  <Badge 
                    count={user.posts?.filter(p => p.published).length || 0} 
                    style={{ backgroundColor: '#52c41a' }} 
                    title="Publicados"
                  />
                }
              />
              <Statistic
                title="Eventos Creados"
                value={user.events?.length || 0}
                prefix={<CalendarOutlined />}
              />
              <Statistic
                title="Entradas Diarias"
                value={user.dailyEntries?.length || 0}
                prefix={<BulbOutlined />}
              />
              <Statistic
                title="Notificaciones"
                value={user.notifications?.length || 0}
                prefix={<MessageOutlined />}
                suffix={
                  <Badge 
                    count={user.notifications?.filter(n => !n.read).length || 0} 
                    style={{ backgroundColor: '#ff4d4f' }} 
                    title="Sin leer"
                  />
                }
              />
            </Space>
          </Card>

          {/* Estado de Ánimo Promedio */}
          {user.dailyEntries && user.dailyEntries.length > 0 && (
            <Card title="Estado de Ánimo" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic
                  title="Promedio General"
                  value={(user.dailyEntries.reduce((sum, entry) => sum + entry.mood, 0) / user.dailyEntries.length).toFixed(1)}
                  suffix="/ 10"
                  prefix={getMoodEmoji(user.dailyEntries.reduce((sum, entry) => sum + entry.mood, 0) / user.dailyEntries.length)}
                />
                <Text type="secondary">
                  Basado en {user.dailyEntries.length} registros
                </Text>
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail; 