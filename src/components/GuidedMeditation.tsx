import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Progress, Typography, Space, Card } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  ReloadOutlined,
  HeartOutlined,
  CloseOutlined
} from '@ant-design/icons';
import '../styles/GuidedMeditation.css';

const { Title, Text } = Typography;

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface GuidedMeditationProps {
  visible: boolean;
  onClose: () => void;
}

const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ visible, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('rest');
  const [phaseTime, setPhaseTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const totalRounds = 3;
  const phaseDurations = {
    inhale: 5, // 6 segundos inhalar
    hold: 5,   // 6 segundos aguantar
    exhale: 6, // 8 segundos exhalar
    rest: 3    // 3 segundos de descanso
  };

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseMessages = {
    inhale: 'Inhala profundamente...',
    hold: 'Aguanta la respiración...',
    exhale: 'Exhala lentamente...',
    rest: 'Descansa...'
  };

  const phaseColors = {
    inhale: '#10b981', // Verde suave consistente con Home
    hold: '#f59e0b',   // Amarillo dorado
    exhale: '#3b82f6', // Azul suave
    rest: '#9ca3af'    // Gris suave
  };

  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setPhaseTime(prev => {
          const nextTime = prev + 0.1;
          const currentDuration = phaseDurations[currentPhase];
          
          if (nextTime >= currentDuration) {
            // Cambiar a la siguiente fase
            if (currentPhase === 'rest') {
              // Completar ronda actual
              if (currentRound >= totalRounds) {
                setIsCompleted(true);
                setIsActive(false);
                return 0;
              } else {
                setCurrentRound(prev => prev + 1);
                setCurrentPhase('inhale');
              }
            } else if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
            } else if (currentPhase === 'exhale') {
              setCurrentPhase('rest');
            }
            return 0;
          }
          
          return nextTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, currentRound, isCompleted]);

  const handleStart = () => {
    setIsActive(true);
    if (isCompleted) {
      // Reiniciar si ya había terminado
      resetMeditation();
    }
    if (currentPhase === 'rest' && currentRound === 1 && phaseTime === 0) {
      setCurrentPhase('inhale');
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setCurrentRound(1);
    setCurrentPhase('rest');
    setPhaseTime(0);
    setIsCompleted(false);
  };

  const handleClose = () => {
    resetMeditation();
    onClose();
  };

  const getPhaseProgress = () => {
    const duration = phaseDurations[currentPhase];
    return (phaseTime / duration) * 100;
  };

  const getTotalProgress = () => {
    const phasesPerRound = 4; // inhale, hold, exhale, rest
    const totalPhases = totalRounds * phasesPerRound;
    
    let completedPhases = (currentRound - 1) * phasesPerRound;
    
    // Agregar fases completadas en la ronda actual
    if (currentPhase === 'hold' || currentPhase === 'exhale' || currentPhase === 'rest') {
      completedPhases += 1; // inhale completado
    }
    if (currentPhase === 'exhale' || currentPhase === 'rest') {
      completedPhases += 1; // hold completado
    }
    if (currentPhase === 'rest') {
      completedPhases += 1; // exhale completado
    }
    
    // Agregar progreso de la fase actual
    const currentPhaseProgress = getPhaseProgress() / 100;
    
    return ((completedPhases + currentPhaseProgress) / totalPhases) * 100;
  };

  const getBreathingCircleScale = () => {
    const progress = getPhaseProgress() / 100;
    
    if (currentPhase === 'inhale') {
      return 1 + (progress * 0.5); // Crece de 1 a 1.5
    } else if (currentPhase === 'hold') {
      return 1.5; // Se mantiene grande
    } else if (currentPhase === 'exhale') {
      return 1.5 - (progress * 0.5); // Decrece de 1.5 a 1
    } else {
      return 1; // Tamaño normal durante el descanso
    }
  };

  return (
    <Modal
      title={
        <Space>
          <HeartOutlined style={{ color: '#52c41a' }} />
          <span>Meditación Guiada - Respiración Profunda</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      className="guided-meditation-modal"
      closeIcon={<CloseOutlined />}
    >
      <div className="meditation-container">
        {!isCompleted ? (
          <>
            {/* Progreso Total */}
            <Card className="progress-card">
              <div className="progress-header">
                <Title level={4}>
                  Ronda {currentRound} de {totalRounds}
                </Title>
                <Progress 
                  percent={Math.round(getTotalProgress())} 
                  strokeColor="#52c41a"
                  className="total-progress"
                />
              </div>
            </Card>

            {/* Círculo de Respiración */}
            <div className="breathing-circle-container">
              <div 
                className="breathing-circle"
                style={{
                  transform: `scale(${getBreathingCircleScale()})`,
                  backgroundColor: phaseColors[currentPhase],
                  transition: currentPhase === 'hold' ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                <div className="breathing-circle-inner">
                  <div className="phase-counter">
                    {Math.ceil(phaseDurations[currentPhase] - phaseTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de Fase */}
            <div className="phase-message">
              <Title level={2} style={{ color: phaseColors[currentPhase], margin: 0 }}>
                {phaseMessages[currentPhase]}
              </Title>
              <Text style={{ fontSize: '16px', color: '#666' }}>
                {currentPhase !== 'rest' && (
                  `${Math.ceil(phaseDurations[currentPhase] - phaseTime)} segundos`
                )}
              </Text>
            </div>

          
            {/* Controles */}
            <div className="meditation-controls">
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={isActive ? handlePause : handleStart}
                  className="control-button"
                >
                  {isActive ? 'Pausar' : 'Iniciar'}
                </Button>
                
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={resetMeditation}
                  className="control-button"
                >
                  Reiniciar
                </Button>
              </Space>
            </div>
          </>
        ) : (
          /* Pantalla de Completado */
          <div className="completion-screen">
            <div className="completion-icon">
              <HeartOutlined style={{ fontSize: '72px', color: '#52c41a' }} />
            </div>
            
            <Title level={2} style={{ color: '#52c41a', textAlign: 'center' }}>
              ¡Meditación Completada!
            </Title>
            
            <Text style={{ fontSize: '16px', textAlign: 'center', display: 'block', marginBottom: '24px' }}>
              Has completado 5 rondas de respiración profunda. Tu mente y cuerpo están más relajados.
            </Text>

            <div className="completion-stats">
              <Card>
                <div className="stat-item">
                  <Text strong>Tiempo total:</Text>
                  <Text> ~6 minutos</Text>
                </div>
                <div className="stat-item">
                  <Text strong>Respiraciones:</Text>
                  <Text> 5 ciclos completos</Text>
                </div>
                <div className="stat-item">
                  <Text strong>Estado:</Text>
                  <Text style={{ color: '#52c41a' }}> Relajado</Text>
                </div>
              </Card>
            </div>

            <div className="completion-controls">
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    resetMeditation();
                    handleStart();
                  }}
                  className="control-button"
                >
                  Meditar de Nuevo
                </Button>
                
                <Button
                  size="large"
                  onClick={handleClose}
                  className="control-button"
                >
                  Finalizar
                </Button>
              </Space>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GuidedMeditation;
