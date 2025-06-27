import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Upload, 
  message, 
  Table, 
  Space, 
  Modal,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

interface EventFormValues {
  title: string;
  description: string;
  date: Date | string;
  location: string;
  image?: File;
}

const EventsManagement: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventForm] = Form.useForm();

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
      const response = await fetch('http://localhost:3000/api/events', {
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

  const handleCreateEvent = async (values: EventFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Evento creado exitosamente');
        eventForm.resetFields();
        fetchEvents();
      } else if (response.status === 403) {
        message.error('No tienes permisos para crear eventos');
        navigate('/home');
      } else {
        message.error('Error al crear el evento');
      }
    } catch (error) {
      console.error('Error al crear evento:', error);
      message.error('Error de conexión');
    } finally {
      setLoading(false);
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
          const response = await fetch(`http://localhost:3000/api/events/${id}`, {
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

  const eventColumns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('es-ES'),
    },
    {
      title: 'Ubicación',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: unknown, record: Event) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {/* TODO: Implementar edición */}}
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
      </div>

      <Card title="Crear Nuevo Evento" style={{ marginBottom: 16 }}>
        <Form form={eventForm} onFinish={handleCreateEvent} layout="vertical">
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'El título es requerido' }]}
          >
            <Input placeholder="Título del evento" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'La descripción es requerida' }]}
          >
            <TextArea rows={4} placeholder="Descripción del evento" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Fecha y Hora"
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <DatePicker showTime placeholder="Seleccionar fecha y hora" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Ubicación"
            rules={[{ required: true, message: 'La ubicación es requerida' }]}
          >
            <Input placeholder="Ubicación del evento" />
          </Form.Item>

          <Form.Item name="image" label="Imagen">
            <Upload
              name="image"
              listType="picture"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Subir Imagen</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              <PlusOutlined /> Crear Evento
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Eventos Existentes">
        <Table 
          columns={eventColumns} 
          dataSource={events} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default EventsManagement; 