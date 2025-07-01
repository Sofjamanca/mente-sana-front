import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
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
  FileTextOutlined
} from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
}

interface BlogFormValues {
  title: string;
  content: string;
  image?: File;
}

const BlogsManagement: React.FC = () => {
  const { userProfile, isAdmin } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogForm] = Form.useForm();

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  // Cargar blogs
  useEffect(() => {
    if (isAdmin) {
      fetchBlogs();
    }
  }, [isAdmin]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else if (response.status === 403) {
        message.error('No tienes permisos para ver los blogs');
        navigate('/home');
      } else {
        message.error('Error al cargar blogs');
      }
    } catch (error) {
      console.error('Error al cargar blogs:', error);
      message.error('Error de conexión al cargar blogs');
    }
  };

  const handleCreateBlog = async (values: BlogFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...values,
          author: userProfile?.name || 'Admin'
        }),
      });

      if (response.ok) {
        message.success('Blog creado exitosamente');
        blogForm.resetFields();
        fetchBlogs();
      } else if (response.status === 403) {
        message.error('No tienes permisos para crear blogs');
        navigate('/home');
      } else {
        message.error('Error al crear el blog');
      }
    } catch (error) {
      console.error('Error al crear blog:', error);
      message.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = (id: string) => {
    confirm({
      title: '¿Estás seguro de eliminar este blog?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const response = await fetch(`/api/blog/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            message.success('Blog eliminado exitosamente');
            fetchBlogs();
          } else {
            message.error('Error al eliminar el blog');
          }
        } catch (error) {
          console.error('Error al eliminar blog:', error);
          message.error('Error de conexión');
        }
      },
    });
  };

  const blogColumns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('es-ES'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: unknown, record: Blog) => (
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
            onClick={() => handleDeleteBlog(record.id)}
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
          <FileTextOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Gestión de Blogs
        </Title>
        <p>Administra todos los blogs de la plataforma</p>
      </div>

      <Card title="Crear Nuevo Blog" style={{ marginBottom: 16 }}>
        <Form form={blogForm} onFinish={handleCreateBlog} layout="vertical">
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'El título es requerido' }]}
          >
            <Input placeholder="Título del blog" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Contenido"
            rules={[{ required: true, message: 'El contenido es requerido' }]}
          >
            <TextArea rows={6} placeholder="Contenido del blog" />
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
              <PlusOutlined /> Crear Blog
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Blogs Existentes">
        <Table 
          columns={blogColumns} 
          dataSource={blogs} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default BlogsManagement; 