import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Upload, 
  message, 
  Typography,
  Spin
} from 'antd';
import { 
  EditOutlined, 
  UploadOutlined,
  ArrowLeftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import '../styles/AdminPanel.css';

const { TextArea } = Input;
const { Title } = Typography;

interface EventFormValues {
  title: string;
  description: string;
  date: dayjs.Dayjs;
  location: string;
  image?: { fileList: File[] };
}

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

const EditEvent: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  // Cargar datos del evento
  useEffect(() => {
    if (isAdmin && id) {
      fetchEvent();
    }
  }, [isAdmin, id]);

  const fetchEvent = async () => {

    
    try {
      const url = `/api/events/event/${id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      
      if (response.ok) {
        const event = await response.json();
        setCurrentEvent(event);
        editForm.setFieldsValue({
          title: event.title,
          description: event.description,
          date: dayjs(event.date),
          location: event.location,
        });
      } else {
        const errorText = await response.text();
        
        if (response.status === 404) {
          message.error(`Evento no encontrado (ID: ${id})`);
          navigate('/admin/events');
        } else if (response.status === 403) {
          message.error('No tienes permisos para editar este evento');
          navigate('/admin/events');
        } else {
          message.error(`Error al cargar el evento (${response.status}): ${errorText}`);
          navigate('/admin/events');
        }
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      message.error('Error de conexión al cargar el evento');
      navigate('/admin/events');
    } finally {
      setLoadingEvent(false);
    }
  };

  // Validar tamaño de archivo (máximo 5MB según la documentación)
  const beforeUpload = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('La imagen debe ser menor a 5MB!');
      return false;
    }
    return false; // Previene subida automática
  };

  const handleUploadChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList);
  };

  // Función para eliminar imagen subida si es necesario
  const deleteUploadedImage = async (filename: string) => {
    try {
      await fetch(`/api/upload/image/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  };

  const handleUpdateEvent = async (values: EventFormValues) => {
    if (!currentEvent) return;
    
    setLoading(true);
    let imageUrl = currentEvent.image || '';
    let uploadedFilename = '';
    
    try {
      // Subir nueva imagen si se seleccionó una
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append('image', fileList[0].originFileObj as File);
        
        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.image.url;
          uploadedFilename = uploadData.image.filename;
        } else {
          message.error('Error al subir la nueva imagen');
          setLoading(false);
          return;
        }
      }

      // Actualizar el evento
      const response = await fetch(`/api/events/${currentEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          date: values.date.toISOString(),
          location: values.location,
          image: imageUrl
        }),
      });

      if (response.ok) {
        message.success('Evento actualizado exitosamente');
        navigate('/admin/events');
      } else if (response.status === 403) {
        message.error('No tienes permisos para editar este evento');
        // Limpiar nueva imagen si falla
        if (uploadedFilename) {
          await deleteUploadedImage(uploadedFilename);
        }
      } else {
        message.error('Error al actualizar el evento');
        // Limpiar nueva imagen si falla
        if (uploadedFilename) {
          await deleteUploadedImage(uploadedFilename);
        }
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      message.error('Error de conexión');
      // Limpiar nueva imagen si hay error
      if (uploadedFilename) {
        await deleteUploadedImage(uploadedFilename);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loadingEvent) {
    return (
      <div className="admin-panel">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/events')}
          style={{ marginBottom: 16 }}
        >
          Volver a Gestión de Eventos
        </Button>
        
        <Title level={2}>
          <CalendarOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Editar Evento
        </Title>
        <p>Modifica la información del evento</p>
      </div>

      <Card title={`Editando: ${currentEvent.title}`}>
        <Form form={editForm} onFinish={handleUpdateEvent} layout="vertical">
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'El título es requerido' }]}
          >
            <Input placeholder="Título del evento" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'La descripción es requerida' }]}
          >
            <TextArea rows={6} placeholder="Descripción del evento" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Fecha y Hora"
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <DatePicker 
              showTime={{ format: 'HH:mm' }} 
              placeholder="Seleccionar fecha y hora" 
              size="large"
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Ubicación"
            rules={[{ required: true, message: 'La ubicación es requerida' }]}
          >
            <Input placeholder="Ubicación del evento" size="large" />
          </Form.Item>

          {currentEvent.image && (
            <Form.Item label="Imagen Actual">
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={currentEvent.image} 
                  alt="Imagen actual" 
                  style={{ 
                    maxWidth: 300, 
                    maxHeight: 200, 
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #d9d9d9'
                  }}
                />
              </div>
            </Form.Item>
          )}

          <Form.Item 
            name="image" 
            label="Nueva Imagen (opcional)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              name="image"
              listType="picture"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} size="large">
                Cambiar Imagen (máx. 5MB)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                <EditOutlined /> Actualizar Evento
              </Button>
              <Button size="large" onClick={() => navigate('/admin/events')}>
                Cancelar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditEvent; 