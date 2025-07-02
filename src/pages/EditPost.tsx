import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Upload, 
  message, 
  Typography,
  Spin
} from 'antd';
import { 
  EditOutlined, 
  UploadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import '../styles/AdminPanel.css';

const { TextArea } = Input;
const { Title } = Typography;

interface PostFormValues {
  title: string;
  content: string;
  image?: { fileList: File[] };
}

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

const EditPost: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentPost, setCurrentPost] = useState<Blog | null>(null);

  // Verificar permisos de admin
  useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  // Cargar datos del post
  useEffect(() => {
    if (isAdmin && id) {
      fetchPost();
    }
  }, [isAdmin, id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const post = await response.json();
        setCurrentPost(post);
        editForm.setFieldsValue({
          title: post.title,
          content: post.content,
        });
      } else if (response.status === 404) {
        message.error('Post no encontrado');
        navigate('/admin/blogs');
      } else if (response.status === 403) {
        message.error('No tienes permisos para editar este post');
        navigate('/admin/blogs');
      } else {
        message.error('Error al cargar el post');
        navigate('/admin/blogs');
      }
    } catch (error) {
      console.error('Error al cargar post:', error);
      message.error('Error de conexión');
      navigate('/admin/blogs');
    } finally {
      setLoadingPost(false);
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

  const handleUpdatePost = async (values: PostFormValues) => {
    if (!currentPost) return;
    
    setLoading(true);
    let imageUrl = currentPost.image || '';
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

      // Actualizar el post
      const response = await fetch(`/api/blog/${currentPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          image: imageUrl
        }),
      });

      if (response.ok) {
        message.success('Post actualizado exitosamente');
        navigate('/admin/blogs');
      } else if (response.status === 403) {
        message.error('No tienes permisos para editar este post');
        // Limpiar nueva imagen si falla
        if (uploadedFilename) {
          await deleteUploadedImage(uploadedFilename);
        }
      } else {
        message.error('Error al actualizar el post');
        // Limpiar nueva imagen si falla
        if (uploadedFilename) {
          await deleteUploadedImage(uploadedFilename);
        }
      }
    } catch (error) {
      console.error('Error al actualizar post:', error);
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

  if (loadingPost) {
    return (
      <div className="admin-panel">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Cargando post...</p>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/blogs')}
          style={{ marginBottom: 16 }}
        >
          Volver a Gestión de Posts
        </Button>
        
        <Title level={2}>
          <EditOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Editar Post
        </Title>
        <p>Modifica la información del post</p>
      </div>

      <Card title={`Editando: ${currentPost.title}`}>
        <Form form={editForm} onFinish={handleUpdatePost} layout="vertical">
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'El título es requerido' }]}
          >
            <Input placeholder="Título del post" size="large" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Contenido"
            rules={[{ required: true, message: 'El contenido es requerido' }]}
          >
            <TextArea rows={8} placeholder="Contenido del post" />
          </Form.Item>

          {currentPost.image && (
            <Form.Item label="Imagen Actual">
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={currentPost.image} 
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
                <EditOutlined /> Actualizar Post
              </Button>
              <Button size="large" onClick={() => navigate('/admin/blogs')}>
                Cancelar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditPost; 