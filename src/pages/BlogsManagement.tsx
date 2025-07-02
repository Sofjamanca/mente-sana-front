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
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Title } = Typography;
const { confirm } = Modal;

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  image?: string;
}

const BlogsManagement: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);

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
        message.error('No tienes permisos para ver los posts');
        navigate('/home');
      } else {
        message.error('Error al cargar posts');
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
      message.error('Error de conexión al cargar posts');
    }
  };

  const handleDeleteBlog = (id: string) => {
    confirm({
      title: '¿Estás seguro de eliminar este post?',
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
            message.success('Post eliminado exitosamente');
            fetchBlogs();
          } else {
            message.error('Error al eliminar el post');
          }
        } catch (error) {
          console.error('Error al eliminar post:', error);
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
      width: '30%',
    },
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
      width: '20%',
      render: (author: { name: string }) => author?.name || 'Sin autor',
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: (date: string) => new Date(date).toLocaleDateString('es-ES'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '30%',
      render: (_: unknown, record: Blog) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => navigate(`/admin/blogs/edit/${record.id}`)}
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
          Gestión de Posts
        </Title>
        <p>Administra todos los posts de la plataforma</p>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => navigate('/admin/blogs/create')}
          style={{ marginTop: 16 }}
        >
          Crear Nuevo Post
        </Button>
      </div>

      <Card title="Posts Existentes" style={{ marginTop: 24 }}>
        <Table 
          columns={blogColumns} 
          dataSource={blogs} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} posts`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default BlogsManagement; 