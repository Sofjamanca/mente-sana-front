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
  Typography
} from 'antd';
import { 
  PlusOutlined, 
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

const CreateEvent: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

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

  const handleCreateEvent = async (values: EventFormValues) => {
    setLoading(true);
    let imageUrl = '';
    let uploadedFilename = '';
    
    try {
      // Subir imagen primero si existe
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
        } else if (uploadResponse.status === 400) {
          const errorData = await uploadResponse.json();
          message.error(errorData.message || 'Error al subir la imagen');
          setLoading(false);
          return;
        } else if (uploadResponse.status === 429) {
          message.error('Límite de uploads alcanzado. Intenta en 1 hora.');
          setLoading(false);
          return;
        } else {
          message.error('Error al subir la imagen');
          setLoading(false);
          return;
        }
      }

      // Crear el evento con la URL de la imagen
      const response = await fetch('/api/events', {
        method: 'POST',
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
        message.success('Evento creado exitosamente');
        navigate('/admin/events');
      } else if (response.status === 403) {
        message.error('No tienes permisos para crear eventos');
        navigate('/home');
        // Limpiar imagen subida si falla la creación del evento
        if (uploadedFilename) {
          await deleteUploadedImage(uploadedFilename);
        }
      } else {
        message.error('Error al crear el evento');
        // Limpiar imagen subida si falla la creación del evento
        if (uploadedFilename) {
          await deleteUploadedImage(uploadedFilename);
        }
      }
    } catch (error) {
      console.error('Error al crear evento:', error);
      message.error('Error de conexión');
      // Limpiar imagen subida si hay error de conexión
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
          Crear Nuevo Evento
        </Title>
        <p>Crea un nuevo evento para la plataforma</p>
      </div>

      <Card title="Información del Evento">
        <Form form={eventForm} onFinish={handleCreateEvent} layout="vertical">
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

          <Form.Item 
            name="image" 
            label="Imagen del Evento"
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
                Subir Imagen (máx. 5MB)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                <PlusOutlined /> Crear Evento
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

export default CreateEvent; 