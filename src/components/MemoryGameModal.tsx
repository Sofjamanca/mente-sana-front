import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MemoryGame from './PuzzleDinamico';
import '../styles/MemoryGameModal.css';

interface MemoryGameModalProps {
  visible: boolean;
  onClose: () => void;
}

const MemoryGameModal: React.FC<MemoryGameModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>Actividad de Memoria</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="memory-game-modal"
      closeIcon={<CloseOutlined />}
      destroyOnClose
    >
      <div className="memory-game-container">
        <div className="game-intro">
          <h3>🧠 Ejercita tu memoria y distrae tu mente</h3>
          <p>
            Este juego de memoria te ayudará a concentrarte en algo divertido, 
            distrayendo tu mente de pensamientos ansiosos. ¡Encuentra todos los pares!
          </p>
        </div>
        
        <MemoryGame />
        
        <div className="game-benefits">
          <h4>💡 Beneficios de esta actividad:</h4>
          <ul>
            <li>Mejora la concentración y atención</li>
            <li>Distrae la mente de pensamientos negativos</li>
            <li>Ejercita la memoria a corto plazo</li>
            <li>Reduce los niveles de estrés</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default MemoryGameModal;
