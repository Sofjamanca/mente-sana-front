import React, { useState } from 'react';
import { Modal, Button, Progress, Typography, Space, Card, Radio, Row, Col, Rate, Tag } from 'antd';
import { 
  HeartOutlined, 
  CloseOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  BulbOutlined
} from '@ant-design/icons';
import '../styles/AnxietyPatterns.css';

const { Title, Text, Paragraph } = Typography;

interface AnxietyPatternsProps {
  visible: boolean;
  onClose: () => void;
}

type Step = 'feeling' | 'situation' | 'timing' | 'tips';

interface AnxietyData {
  intensity: number;
  situation: string[];
  timeOfDay: string;
  place: string;
  thoughts: string;
}

const AnxietyPatterns: React.FC<AnxietyPatternsProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('feeling');
  const [anxietyData, setAnxietyData] = useState<AnxietyData>({
    intensity: 5,
    situation: [],
    timeOfDay: '',
    place: '',
    thoughts: ''
  });

  const situations = [
    { key: 'school', label: 'Escuela', emoji: '🏫' },
    { key: 'friends', label: 'Amigos', emoji: '👥' },
    { key: 'family', label: 'Familia', emoji: '👨‍👩‍👧‍👦' },
    { key: 'exams', label: 'Exámenes', emoji: '📚' },
    { key: 'social', label: 'Redes Sociales', emoji: '📱' },
    { key: 'future', label: 'Futuro', emoji: '🔮' },
    { key: 'body', label: 'Imagen Corporal', emoji: '🪞' },
    { key: 'performance', label: 'Rendimiento', emoji: '🎯' }
  ];

  const timesOfDay = [
    { key: 'morning', label: 'Mañana', emoji: '🌅' },
    { key: 'afternoon', label: 'Tarde', emoji: '☀️' },
    { key: 'evening', label: 'Noche', emoji: '🌙' },
    { key: 'anytime', label: 'Cualquier hora', emoji: '🕐' }
  ];

  const places = [
    { key: 'home', label: 'Casa', emoji: '🏠' },
    { key: 'school', label: 'Escuela', emoji: '🏫' },
    { key: 'public', label: 'Lugares públicos', emoji: '🏢' },
    { key: 'online', label: 'En línea', emoji: '💻' }
  ];

  const commonThoughts = [
    { key: 'failure', label: 'No soy lo suficientemente bueno', emoji: '😔' },
    { key: 'judgment', label: 'Todos me están juzgando', emoji: '👀' },
    { key: 'catastrophe', label: 'Algo malo va a pasar', emoji: '😰' },
    { key: 'control', label: 'No puedo controlar esto', emoji: '🌪️' },
    { key: 'perfect', label: 'Tengo que ser perfecto', emoji: '⭐' },
    { key: 'rejection', label: 'Van a rechazarme', emoji: '💔' }
  ];

  const steps = {
    feeling: { title: '¿Cómo te sientes?', progress: 25 },
    situation: { title: '¿Qué está pasando?', progress: 50 },
    timing: { title: '¿Cuándo y dónde?', progress: 75 },
    tips: { title: 'Estrategias para ti', progress: 100 }
  };

  const handleNext = () => {
    const stepOrder: Step[] = ['feeling', 'situation', 'timing', 'tips'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: Step[] = ['feeling', 'situation', 'timing', 'tips'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleClose = () => {
    setCurrentStep('feeling');
    setAnxietyData({
      intensity: 5,
      situation: [],
      timeOfDay: '',
      place: '',
      thoughts: ''
    });
    onClose();
  };

  const handleSituationToggle = (key: string) => {
    setAnxietyData(prev => ({
      ...prev,
      situation: prev.situation.includes(key)
        ? prev.situation.filter(s => s !== key)
        : [...prev.situation, key]
    }));
  };

  const getPersonalizedTips = () => {
    const tips = [];
    
    // Tips basados en intensidad
    if (anxietyData.intensity >= 8) {
      tips.push({
        title: 'Respiración de emergencia',
        description: 'Inhala 4 segundos, aguanta 4, exhala 6. Repite hasta sentirte mejor.',
        emoji: '🫁',
        color: '#ef4444'
      });
    }
    
    // Tips basados en situación
    if (anxietyData.situation.includes('school') || anxietyData.situation.includes('exams')) {
      tips.push({
        title: 'Técnica de estudio tranquila',
        description: 'Divide las tareas en partes pequeñas. Celebra cada logro.',
        emoji: '📚',
        color: '#3b82f6'
      });
    }
    
    if (anxietyData.situation.includes('social')) {
      tips.push({
        title: 'Límites digitales',
        description: 'Pon el teléfono en modo avión por 30 minutos y haz algo que disfrutes.',
        emoji: '📱',
        color: '#8b5cf6'
      });
    }
    
    // Tips basados en momento del día
    if (anxietyData.timeOfDay === 'morning') {
      tips.push({
        title: 'Rutina matutina calmante',
        description: 'Levántate 10 minutos antes y dedica tiempo a ti mismo.',
        emoji: '🌅',
        color: '#f59e0b'
      });
    }
    
    // Tips generales siempre útiles
    tips.push(
      {
        title: 'Técnica 5-4-3-2-1',
        description: 'Nombra 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas.',
        emoji: '👀',
        color: '#10b981'
      },
      {
        title: 'Mensaje a ti mismo',
        description: 'Háblate como le hablarías a tu mejor amigo. Con cariño y comprensión.',
        emoji: '💝',
        color: '#f97316'
      }
    );
    
    return tips.slice(0, 4); // Máximo 4 tips
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'feeling':
        return (
          <div className="step-content">
            <div className="feeling-meter">
              <Title level={4}>¿Qué tan ansioso/a te sientes ahora?</Title>
              <div className="intensity-scale">
                <Rate 
                  count={10} 
                  value={anxietyData.intensity} 
                  onChange={(value) => setAnxietyData(prev => ({ ...prev, intensity: value || 5 }))}
                  character="💚"
                  style={{ fontSize: '32px' }}
                />
                <div className="intensity-labels">
                  <Text>1 - Muy tranquilo</Text>
                  <Text>10 - Muy ansioso</Text>
                </div>
              </div>
              
              <div className="intensity-description">
                <Text style={{ fontSize: '18px', color: '#6b7280' }}>
                  {anxietyData.intensity <= 3 && "Te sientes bastante tranquilo 😌"}
                  {anxietyData.intensity > 3 && anxietyData.intensity <= 6 && "Sientes algo de nervios 😐"}
                  {anxietyData.intensity > 6 && anxietyData.intensity <= 8 && "Te sientes bastante ansioso 😰"}
                  {anxietyData.intensity > 8 && "Te sientes muy ansioso 😫"}
                </Text>
              </div>
            </div>
          </div>
        );

      case 'situation':
        return (
          <div className="step-content">
            <Title level={4}>¿Qué situaciones te generan ansiedad?</Title>
            <Text style={{ color: '#6b7280', marginBottom: '24px', display: 'block' }}>
              Puedes seleccionar varias opciones
            </Text>
            
            <Row gutter={[12, 12]}>
              {situations.map((situation) => (
                <Col xs={12} sm={8} md={6} key={situation.key}>
                  <Card
                    hoverable
                    className={`situation-card ${anxietyData.situation.includes(situation.key) ? 'selected' : ''}`}
                    onClick={() => handleSituationToggle(situation.key)}
                  >
                    <div className="situation-content">
                      <div className="situation-emoji">{situation.emoji}</div>
                      <Text className="situation-label">{situation.label}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="thoughts-section">
              <Title level={5}>¿Qué pensamientos tienes?</Title>
              <Row gutter={[8, 8]}>
                {commonThoughts.map((thought) => (
                  <Col key={thought.key}>
                    <Tag
                      className={`thought-tag ${anxietyData.thoughts === thought.key ? 'selected' : ''}`}
                      onClick={() => setAnxietyData(prev => ({ 
                        ...prev, 
                        thoughts: prev.thoughts === thought.key ? '' : thought.key 
                      }))}
                    >
                      {thought.emoji} {thought.label}
                    </Tag>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        );

      case 'timing':
        return (
          <div className="step-content">
            <div className="timing-section">
              <Title level={4}>¿Cuándo sueles sentirte más ansioso?</Title>
              <Row gutter={[12, 12]} style={{ marginBottom: '32px' }}>
                {timesOfDay.map((time) => (
                  <Col xs={12} sm={6} key={time.key}>
                    <Card
                      hoverable
                      className={`timing-card ${anxietyData.timeOfDay === time.key ? 'selected' : ''}`}
                      onClick={() => setAnxietyData(prev => ({ ...prev, timeOfDay: time.key }))}
                    >
                      <div className="timing-content">
                        <div className="timing-emoji">{time.emoji}</div>
                        <Text>{time.label}</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Title level={4}>¿En qué lugares?</Title>
              <Row gutter={[12, 12]}>
                {places.map((place) => (
                  <Col xs={12} sm={6} key={place.key}>
                    <Card
                      hoverable
                      className={`timing-card ${anxietyData.place === place.key ? 'selected' : ''}`}
                      onClick={() => setAnxietyData(prev => ({ ...prev, place: place.key }))}
                    >
                      <div className="timing-content">
                        <div className="timing-emoji">{place.emoji}</div>
                        <Text>{place.label}</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="step-content">
            <div className="tips-header">
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }} />
              <Title level={3}>Estrategias personalizadas para ti</Title>
              <Text style={{ color: '#6b7280', fontSize: '16px' }}>
                Basadas en tus respuestas, aquí tienes algunas técnicas que pueden ayudarte
              </Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: '32px' }}>
              {getPersonalizedTips().map((tip, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card className="tip-card" style={{ borderLeft: `4px solid ${tip.color}` }}>
                    <div className="tip-content">
                      <div className="tip-header">
                        <span className="tip-emoji">{tip.emoji}</span>
                        <Title level={5} style={{ margin: 0, color: tip.color }}>
                          {tip.title}
                        </Title>
                      </div>
                      <Paragraph style={{ margin: '12px 0 0 0', fontSize: '14px', lineHeight: '1.5' }}>
                        {tip.description}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="reminder-card">
              <Card style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', marginTop: '24px' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <BulbOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
                  <Title level={4} style={{ color: 'white', margin: '0 0 8px 0' }}>
                    Recuerda
                  </Title>
                  <Text style={{ color: 'white', fontSize: '16px' }}>
                    La ansiedad es normal y temporal. Estas técnicas mejoran con la práctica. 
                    Sé paciente contigo mismo/a. 💚
                  </Text>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <Space>
          <HeartOutlined style={{ color: '#722ed1' }} />
          <span>Patrones de Ansiedad</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
      className="anxiety-patterns-modal"
      closeIcon={<CloseOutlined />}
    >
      <div className="anxiety-patterns-container">
        {/* Progress Bar */}
        <div className="progress-section">
          <Progress 
            percent={steps[currentStep].progress} 
            strokeColor="#722ed1"
            showInfo={false}
            className="main-progress"
          />
          <Title level={3} style={{ textAlign: 'center', margin: '16px 0', color: '#722ed1' }}>
            {steps[currentStep].title}
          </Title>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="navigation-buttons">
          <Space size="large">
            {currentStep !== 'feeling' && (
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={handlePrevious}
                className="nav-button"
              >
                Anterior
              </Button>
            )}
            
            {currentStep !== 'tips' ? (
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={handleNext}
                className="nav-button primary"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleClose}
                className="nav-button primary"
              >
                Completar
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default AnxietyPatterns;





