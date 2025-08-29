import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Typography, Space, Tag } from 'antd';
import { 
  SoundOutlined, 
  HeartOutlined, 
  ClockCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import GuidedMeditation from './GuidedMeditation';
import AnxietyPatterns from './AnxietyPatterns';
import MemoryGameModal from './MemoryGameModal';
import '../styles/AnxietyReliefActivities.css';

const { Title, Text, Paragraph } = Typography;

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const activities: Activity[] = [
  {
    id: 'patterns',
    title: 'Patrones de Ansiedad',
    description: 'Identifica y analiza tus patrones de ansiedad para mejor comprensión y manejo emocional.',
    duration: 15,
    icon: <HeartOutlined />,
    category: 'Análisis',
    color: '#722ed1'
  },
  {
    id: 'meditation',
    title: 'Meditaciones Guiadas',
    description: 'Sesiones de meditación guiada diseñadas específicamente para reducir la ansiedad y el estrés.',
    duration: 20,
    icon: <HeartOutlined />,
    category: 'Relajación',
    color: '#52c41a'
  },
  {
    id: 'waves',
    title: 'Sonidos de Olas',
    description: 'Sumérgete en el sonido relajante de las olas del mar para calmar tu mente y reducir la tensión.',
    duration: 10,
    icon: <SoundOutlined />,
    category: 'Sonido',
    color: '#1890ff'
  },
  {
    id: 'memory',
    title: 'Actividad de Memoria',
    description: 'Ejercicios mentales para mejorar la concentración y distraer la mente de pensamientos ansiosos.',
    duration: 12,
    icon: <HeartOutlined />,
    category: 'Cognitivo',
    color: '#fa8c16'
  }
];

interface AnxietyReliefActivitiesProps {
  theme: "dark" | "light";
}

const AnxietyReliefActivities: React.FC<AnxietyReliefActivitiesProps> = ({ theme: _ }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [meditationVisible, setMeditationVisible] = useState(false);
  const [patternsVisible, setPatternsVisible] = useState(false);
  const [memoryGameVisible, setMemoryGameVisible] = useState(false);

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedActivity(null);
  };

  const handleStartActivity = () => {
    if (selectedActivity?.id === 'meditation') {
      // Abrir la meditación guiada
      setModalVisible(false);
      setMeditationVisible(true);
    } else if (selectedActivity?.id === 'patterns') {
      // Abrir patrones de ansiedad
      setModalVisible(false);
      setPatternsVisible(true);
    } else if (selectedActivity?.id === 'memory') {
      // Abrir juego de memoria
      setModalVisible(false);
      setMemoryGameVisible(true);
    } else {
      // Para otras actividades, por ahora solo mostrar mensaje
      console.log('Iniciando actividad:', selectedActivity?.title);
      handleModalClose();
    }
  };

  const handleMeditationClose = () => {
    setMeditationVisible(false);
    setSelectedActivity(null);
  };

  const handlePatternsClose = () => {
    setPatternsVisible(false);
    setSelectedActivity(null);
  };

  const handleMemoryGameClose = () => {
    setMemoryGameVisible(false);
    setSelectedActivity(null);
  };

  // Debug: monitorear cambios en el estado
  useEffect(() => {
    console.log('Estado actual:', {
      meditationVisible,
      patternsVisible,
      memoryGameVisible,
      selectedActivity: selectedActivity?.id
    });
  }, [meditationVisible, patternsVisible, memoryGameVisible, selectedActivity]);

  return (
    <div className="anxiety-relief-activities">
      <Card 
        title={
          <Space>
            <HeartOutlined style={{ color: '#ff4d4f' }} />
            <span>Actividades para Calmar la Ansiedad</span>
          </Space>
        }
        className="activities-card"
      >
        <Row gutter={[16, 16]}>
          {activities.map((activity) => (
            <Col xs={24} sm={12} md={6} key={activity.id}>
              <Card
                hoverable
                className="activity-card"
                onClick={() => handleActivityClick(activity)}
                style={{
                  border: `2px solid ${activity.color}`,
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="activity-content">
                  <div 
                    className="activity-icon"
                    style={{ color: activity.color }}
                  >
                    {activity.icon}
                  </div>
                  
                  <Title level={5} className="activity-title">
                    {activity.title}
                  </Title>
                  
                  <Text className="activity-description">
                    {activity.description}
                  </Text>
                  
                  <div className="activity-meta">
                    <Tag 
                      color={activity.color} 
                      className="activity-category"
                    >
                      {activity.category}
                    </Tag>
                    
                    <div className="activity-duration">
                      <ClockCircleOutlined />
                      <span>{activity.duration} min</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    className="start-activity-btn"
                    style={{ backgroundColor: activity.color, borderColor: activity.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Si es una actividad implementada, ejecutarla directamente
                      if (activity.id === 'meditation' || activity.id === 'patterns' || activity.id === 'memory') {
                        console.log('Ejecutando actividad:', activity.id);
                        setSelectedActivity(activity);
                        if (activity.id === 'meditation') {
                          setMeditationVisible(true);
                        } else if (activity.id === 'patterns') {
                          setPatternsVisible(true);
                        } else if (activity.id === 'memory') {
                          console.log('Abriendo juego de memoria...');
                          setMemoryGameVisible(true);
                        }
                      } else {
                        // Para actividades no implementadas, mostrar modal de detalles
                        handleActivityClick(activity);
                      }
                    }}
                  >
                    Comenzar
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Modal para mostrar detalles de la actividad */}
      <Modal
        title={
          <Space>
            {selectedActivity?.icon}
            <span>{selectedActivity?.title}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Cancelar
          </Button>,
          <Button 
            key="start" 
            type="primary" 
            icon={<PlayCircleOutlined />}
            onClick={handleStartActivity}
            style={{ 
              backgroundColor: selectedActivity?.color, 
              borderColor: selectedActivity?.color 
            }}
          >
            Iniciar Actividad
          </Button>
        ]}
        width={600}
        className="activity-modal"
      >
        {selectedActivity && (
          <div className="activity-details">
            <div className="activity-header">
              <div 
                className="activity-icon-large"
                style={{ color: selectedActivity.color }}
              >
                {selectedActivity.icon}
              </div>
              
              <div className="activity-info">
                <Title level={3}>{selectedActivity.title}</Title>
                <Tag color={selectedActivity.color} className="activity-category-tag">
                  {selectedActivity.category}
                </Tag>
                <div className="activity-duration-large">
                  <ClockCircleOutlined />
                  <span>{selectedActivity.duration} minutos</span>
                </div>
              </div>
            </div>
            
            <Paragraph className="activity-description-full">
              {selectedActivity.description}
            </Paragraph>
            
            <div className="activity-benefits">
              <Title level={5}>Beneficios de esta actividad:</Title>
              <ul>
                <li>Reduce los niveles de ansiedad</li>
                <li>Mejora la concentración</li>
                <li>Promueve la relajación</li>
                <li>Ayuda a manejar el estrés</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Componente de Meditación Guiada */}
      <GuidedMeditation 
        visible={meditationVisible}
        onClose={handleMeditationClose}
      />

      {/* Componente de Patrones de Ansiedad */}
      <AnxietyPatterns 
        visible={patternsVisible}
        onClose={handlePatternsClose}
      />

      {/* Componente de Juego de Memoria */}
      <MemoryGameModal 
        visible={memoryGameVisible}
        onClose={handleMemoryGameClose}
      />
      
      
    </div>
  );
};

export default AnxietyReliefActivities;
