import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  message, 
  Statistic,
  Typography,
  Spin,
  Button,
  Row,
  Col
} from 'antd';
import { 
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UserOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Title } = Typography;

interface GeneralStats {
  totalUsers: number;
  totalPublishedPosts: number;
  totalEvents: number;
  totalDailyEntries: number;
}

interface DailyEntry {
  date: string;
  count: number;
}

interface UsersByRole {
  role: string;
  count: number;
}

const AdminPanel: React.FC = () => {
  const { userProfile, isAdmin } = useUser();
  const navigate = useNavigate();
  const [statsLoading, setStatsLoading] = useState(true);
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [usersByRole, setUsersByRole] = useState<UsersByRole[]>([]);

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  // Cargar estadísticas
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Hacer todas las llamadas en paralelo
      const [generalResponse, dailyResponse, usersResponse] = await Promise.all([
        fetch('/api/stats/general', { headers }),
        fetch('/api/stats/daily-entries/daily', { headers }),
        fetch('/api/stats/users/by-role', { headers })
      ]);

      if (generalResponse.ok) {
        const generalData = await generalResponse.json();
        setGeneralStats(generalData);
      } else if (generalResponse.status === 403) {
        message.error('No tienes permisos para ver las estadísticas');
        navigate('/home');
        return;
      }

      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        setDailyEntries(dailyData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsersByRole(usersData);
      }

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      message.error('Error de conexión al cargar estadísticas');
    } finally {
      setStatsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <Title level={2}>
          <BarChartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Panel de Administración
        </Title>
        <p>Bienvenido, {userProfile?.name}.</p>
      </div>

      {/* Navegación Rápida */}
      <Card title="Gestión Rápida" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Button 
              type="primary" 
              icon={<FileTextOutlined />} 
              size="large" 
              style={{ width: '100%', height: '60px' }}
              onClick={() => navigate('/admin/blogs')}
            >
              Gestionar Posts
            </Button>
          </Col>
          <Col span={6}>
            <Button 
              type="primary" 
              icon={<CalendarOutlined />} 
              size="large" 
              style={{ width: '100%', height: '60px' }}
              onClick={() => navigate('/admin/events')}
            >
              Gestionar Eventos
            </Button>
          </Col>
          <Col span={6}>
            <Button 
              type="primary" 
              icon={<TeamOutlined />} 
              size="large" 
              style={{ width: '100%', height: '60px' }}
              onClick={() => navigate('/admin/users')}
            >
              Gestionar Usuarios
            </Button>
          </Col>
          <Col span={6}>
            <Button 
              type="default" 
              icon={<SettingOutlined />} 
              size="large" 
              style={{ width: '100%', height: '60px' }}
              disabled
            >
              Configuración
              <div style={{ fontSize: '12px', color: '#999' }}>Próximamente</div>
            </Button>
          </Col>
        </Row>
      </Card>

      {statsLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px' }}>Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <Card>
              <Statistic
                title="Total de Usuarios"
                value={generalStats?.totalUsers || 0}
                prefix={<UserOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Total de Blogs"
                value={generalStats?.totalPublishedPosts || 0}
                prefix={<FileTextOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Total de Eventos"
                value={generalStats?.totalEvents || 0}
                prefix={<CalendarOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Registros Diarios"
                value={generalStats?.totalDailyEntries || 0}
                prefix={<LineChartOutlined />}
              />
            </Card>
          </div>

          {/* Sección preparada para gráficos futuros */}
          <div className="secondary-stats-grid equal-height-cards">
            <Card title="Usuarios por Rol">
              {usersByRole.length > 0 ? (
                usersByRole.map((role, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>{role.role}:</span> {role.count} usuarios
                  </div>
                ))
              ) : (
                <p>No hay datos de roles disponibles</p>
              )}
            </Card>
            <Card 
              title="Registros Diarios Recientes"
              extra={<span style={{ fontSize: '12px', color: '#666' }}>Últimos 7 días</span>}
            >
              {dailyEntries.length > 0 ? (
                dailyEntries.slice(-7).map((entry, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>
                      {new Date(entry.date).toLocaleDateString('es-ES')}:
                    </span> {entry.count} registros
                  </div>
                ))
              ) : (
                <p>No hay datos de registros diarios disponibles</p>
              )}
              <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <small style={{ color: '#666' }}>
                  proximamente grafico de lineas
                </small>
              </div>
            </Card>
          </div>

          <Card title="Actividad Reciente" style={{ marginTop: 16 }}>
            <p>• Total de {generalStats?.totalPublishedPosts || 0} blogs publicados</p>
            <p>• {generalStats?.totalEvents || 0} eventos programados</p>
            <p>• {generalStats?.totalUsers || 0} usuarios registrados en total</p>
            <p>• {generalStats?.totalDailyEntries || 0} registros de estado de ánimo realizados</p>
          </Card>

         
        </>
      )}
    </div>
  );
};

export default AdminPanel; 