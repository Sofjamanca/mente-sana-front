import React from "react";
import { Modal } from "antd";
import { Brain } from "lucide-react";
import MemoryGame from "./PuzzleDinamico";
import "../styles/ms-activities.css";
import "../styles/activity-modals.css";

interface MemoryGameModalProps {
  visible: boolean;
  onClose: () => void;
}

const MemoryGameModal: React.FC<MemoryGameModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Brain size={22} strokeWidth={2.2} aria-hidden />
          <span>Juego de memoria</span>
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      wrapClassName="ms-modal-activity ms-modal-activity--memory"
      className="memory-game-modal"
      destroyOnClose
    >
      <div className="ms-game-wrap">
        <div className="ms-game-intro">
          <h3>Entrená la atención jugando</h3>
          <p>
            Encontrá los pares de íconos. Es una forma amable de distraer la mente de preocupaciones y volver al
            presente.
          </p>
        </div>

        <MemoryGame />

        <div className="ms-game-benefits">
          <h4>Por qué suma</h4>
          <ul>
            <li>Ejercitás memoria y foco en algo concreto.</li>
            <li>En pausa corta, a veces baja la tensión.</li>
            <li>Podés repetir cuando quieras y cambiar dificultad.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default MemoryGameModal;
