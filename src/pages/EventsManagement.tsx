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
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Title } = Typography;
const { confirm } = Modal;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  image?: string;
}

const EventsManagement: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  // Cargar eventos
  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
    }
  }, [isAdmin]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else if (response.status === 403) {
        message.error('No tienes permisos para ver los eventos');
        navigate('/home');
      } else {
        message.error('Error al cargar eventos');
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      message.error('Error de conexión al cargar eventos');
    }
  };

  const handleDeleteEvent = (id: string) => {
    confirm({
      title: '¿Estás seguro de eliminar este evento?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const response = await fetch(`/api/events/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            message.success('Evento eliminado exitosamente');
            fetchEvents();
          } else {
            message.error('Error al eliminar el evento');
          }
        } catch (error) {
          console.error('Error al eliminar evento:', error);
          message.error('Error de conexión');
        }
      },
    });
  };

  // Función para determinar si un evento es futuro o pasado
  const getEventStatus = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    return eventDate > now ? 'upcoming' : 'past';
  };

  const eventColumns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
      render: (date: string) => {
        const eventDate = new Date(date);
        const status = getEventStatus(date);
        return (
          <div>
            <div>{eventDate.toLocaleDateString('es-ES')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <Tag color={status === 'upcoming' ? 'green' : 'orange'} style={{ marginTop: 4 }}>
              {status === 'upcoming' ? 'Próximo' : 'Pasado'}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Ubicación',
      dataIndex: 'location',
      key: 'location',
      width: '20%',
    },
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
      width: '15%',
      render: (author: { name: string }) => author?.name || 'Sin autor',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '20%',
      render: (_: unknown, record: Event) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              console.log('🎯 Editing event with ID:', record.id);
              console.log('🎯 Full event record:', record);
              navigate(`/admin/events/edit/${record.id}`);
            }}
          >
            Editar
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteEvent(record.id)}
          >
            Eliminar
          </Button>
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
          <CalendarOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Gestión de Eventos
        </Title>
        <p>Administra todos los eventos de la plataforma</p>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => navigate('/admin/events/create')}
          style={{ marginTop: 16 }}
        >
          Crear Nuevo Evento
        </Button>
      </div>

      <Card title="Eventos Existentes" style={{ marginTop: 24 }}>
        <Table 
          columns={eventColumns} 
          dataSource={events} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} eventos`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default EventsManagement; 