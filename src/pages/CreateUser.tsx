import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  Card, 
  Button, 
  message, 
  Form, 
  Input,
  Select,
  DatePicker,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserAddOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EnvironmentOutlined,
  CrownOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import '../styles/AdminPanel.css';

const { Title } = Typography;
const { Option } = Select;

type RoleType = 'USER' | 'EDITOR' | 'ADMIN';

interface UserFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: RoleType;
  birthDate?: dayjs.Dayjs;
  locality?: string;
  province?: string;
}

const CreateUser: React.FC = () => {
  const { isAdmin } = useUser();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Verificar permisos de admin
  React.useEffect(() => {
    if (!isAdmin) {
      message.error('No tienes permisos para acceder a esta página');
      navigate('/home');
      return;
    }
  }, [isAdmin, navigate]);

  const handleCreateUser = async (values: UserFormValues) => {
    if (values.password !== values.confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
        birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
        locality: values.locality || undefined,
        province: values.province || undefined,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        message.success('Usuario creado exitosamente');
        navigate('/admin/users');
      } else {
        const errorData = await response.json();
        if (response.status === 400) {
          if (errorData.message.includes('email')) {
            message.error('El email ya está registrado');
          } else {
            message.error(errorData.message || 'Error en los datos proporcionados');
          }
        } else if (response.status === 403) {
          message.error('No tienes permisos para crear usuarios');
        } else {
          message.error('Error al crear el usuario');
        }
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      message.error('Error de conexión');
    } finally {
      setLoading(false);
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

  if (!isAdmin) {
    return null;
  }

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
          <UserAddOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Crear Nuevo Usuario
        </Title>
        <p>Registra un nuevo usuario en la plataforma</p>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Información del Usuario">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateUser}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Nombre Completo"
                    name="name"
                    rules={[
                      { required: true, message: 'Por favor ingresa el nombre' },
                      { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                      { max: 100, message: 'El nombre no puede exceder 100 caracteres' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Nombre y apellido"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Por favor ingresa el email' },
                      { type: 'email', message: 'Ingresa un email válido' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="usuario@email.com"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[
                      { required: true, message: 'Por favor ingresa la contraseña' },
                      { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                      { 
                        pattern: /^(?=.*\d).+$/, 
                        message: 'La contraseña debe contener al menos un número' 
                      }
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Mínimo 6 caracteres con un número"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Por favor confirma la contraseña' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Las contraseñas no coinciden'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="Repite la contraseña"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Información Adicional (Opcional)</Divider>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Fecha de Nacimiento"
                    name="birthDate"
                  >
                    <DatePicker 
                      placeholder="Selecciona la fecha"
                      style={{ width: '100%' }}
                      size="large"
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Localidad"
                    name="locality"
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="Ciudad"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Provincia"
                    name="province"
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="Provincia/Estado"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Rol del Usuario"
                name="role"
                initialValue="USER"
                rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
              >
                <Select size="large" placeholder="Selecciona el rol">
                  <Option value="USER">
                    <UserOutlined /> Usuario Regular
                  </Option>
                  <Option value="EDITOR">
                    <EditOutlined /> Editor
                  </Option>
                  <Option value="ADMIN">
                    <CrownOutlined /> Administrador
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Button 
                      type="default" 
                      size="large" 
                      onClick={() => navigate('/admin/users')}
                      style={{ width: '100%' }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      size="large"
                      style={{ width: '100%' }}
                    >
                      Crear Usuario
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Información sobre Roles">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {getRoleIcon('USER')}
                <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Usuario Regular</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Puede ver contenido, crear entradas diarias y participar en eventos.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {getRoleIcon('EDITOR')}
                <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Editor</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Puede crear y editar posts y eventos. Acceso a funciones de moderación.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {getRoleIcon('ADMIN')}
                <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Administrador</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Acceso completo al sistema. Puede gestionar usuarios, contenido y configuraciones.
              </p>
            </div>
          </Card>

          <Card title="Recomendaciones de Seguridad" style={{ marginTop: 16 }}>
            <ul style={{ paddingLeft: 16, color: '#666' }}>
              <li>Usa contraseñas seguras con al menos 6 caracteres</li>
              <li>Incluye números en la contraseña</li>
              <li>Asigna el rol mínimo necesario</li>
              <li>Verifica que el email sea correcto</li>
              <li>Los usuarios recibirán notificación por email</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateUser; 