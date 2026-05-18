import React, { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { Heart, Pause, Play, RotateCcw, Wind } from "lucide-react";
import "../styles/ms-activities.css";
import "../styles/activity-modals.css";

type BreathingPhase = "inhale" | "hold" | "exhale" | "rest";

interface GuidedMeditationProps {
  visible: boolean;
  onClose: () => void;
}

const PHASE_COLOR: Record<BreathingPhase, string> = {
  inhale: "var(--color-mint)",
  hold: "#ffc85c",
  exhale: "var(--color-sky)",
  rest: "color-mix(in srgb, var(--color-muted) 55%, var(--color-line))",
};

const PHASE_GRADIENT: Record<
  BreathingPhase,
  { hueA: number; hueB: number; opacity: number }
> = {
  inhale: { hueA: 162, hueB: 224, opacity: 0.95 },
  hold: { hueA: 42, hueB: 24, opacity: 0.9 },
  exhale: { hueA: 204, hueB: 268, opacity: 0.82 },
  rest: { hueA: 34, hueB: 210, opacity: 0.34 },
};

const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ visible, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("rest");
  const [phaseTime, setPhaseTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalRounds = 3;
  const phaseDurations = {
    inhale: 5,
    hold: 5,
    exhale: 6,
    rest: 3,
  };

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseMessages: Record<BreathingPhase, string> = {
    inhale: "Inhala profundamente…",
    hold: "Aguantá la respiración…",
    exhale: "Exhalá lento…",
    rest: "Descansá…",
  };

  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setPhaseTime((prev) => {
          const nextTime = prev + 0.1;
          const currentDuration = phaseDurations[currentPhase];

          if (nextTime >= currentDuration) {
            if (currentPhase === "rest") {
              if (currentRound >= totalRounds) {
                setIsCompleted(true);
                setIsActive(false);
                return 0;
              }
              setCurrentRound((r) => r + 1);
              setCurrentPhase("inhale");
            } else if (currentPhase === "inhale") {
              setCurrentPhase("hold");
            } else if (currentPhase === "hold") {
              setCurrentPhase("exhale");
            } else if (currentPhase === "exhale") {
              setCurrentPhase("rest");
            }
            return 0;
          }

          return nextTime;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, currentPhase, currentRound, isCompleted]);

  const handleStart = () => {
    setIsActive(true);
    if (isCompleted) {
      resetMeditation();
    }
    if (currentPhase === "rest" && currentRound === 1 && phaseTime === 0) {
      setCurrentPhase("inhale");
    }
  };

  const handlePause = () => setIsActive(false);

  const resetMeditation = () => {
    setIsActive(false);
    setCurrentRound(1);
    setCurrentPhase("rest");
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
    const phasesPerRound = 4;
    const totalPhases = totalRounds * phasesPerRound;
    let completedPhases = (currentRound - 1) * phasesPerRound;

    if (currentPhase === "hold" || currentPhase === "exhale" || currentPhase === "rest") {
      completedPhases += 1;
    }
    if (currentPhase === "exhale" || currentPhase === "rest") {
      completedPhases += 1;
    }
    if (currentPhase === "rest") {
      completedPhases += 1;
    }

    const currentPhaseProgress = getPhaseProgress() / 100;
    return ((completedPhases + currentPhaseProgress) / totalPhases) * 100;
  };

  const getBreathingPulse = () => {
    const progress = getPhaseProgress() / 100;
    const theme = PHASE_GRADIENT[currentPhase];
    const intensity =
      currentPhase === "inhale"
        ? 0.18 + progress * 0.82
        : currentPhase === "hold"
          ? 1
          : currentPhase === "exhale"
            ? 1 - progress * 0.78
            : 0.16;

    return {
      intensity,
      scale: 1,
      center: 30 + intensity * 30,
      width: 32 + intensity * 138,
      height: 34 + intensity * 142,
      rotate: -96 + progress * 150,
      opacity: theme.opacity,
      hueA: theme.hueA,
      hueB: theme.hueB,
    };
  };

  const totalPct = Math.round(getTotalProgress());
  const breathPulse = getBreathingPulse();
  const secsLeft = Math.ceil(phaseDurations[currentPhase] - phaseTime);

  return (
    <Modal
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Wind size={22} strokeWidth={2.2} aria-hidden />
          <span>Respiración guiada</span>
        </span>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      wrapClassName="ms-modal-activity ms-modal-activity--breath"
      className="guided-meditation-modal"
      destroyOnClose
    >
      <div className="ms-breath-root">
        {!isCompleted ? (
          <>
            <div className="ms-panel">
              <div className="ms-breath-round">
                <span>
                  Ronda {currentRound} / {totalRounds}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted)" }}>
                  {totalPct}%
                </span>
              </div>
              <div className="ms-progress-bar" aria-hidden>
                <div className="ms-progress-bar__fill" style={{ width: `${totalPct}%` }} />
              </div>
            </div>

            <div className="ms-breath-visual-wrap">
              <div
                className={`ms-breath-visual-scale ms-breath-visual-scale--${currentPhase}`}
                style={
                  {
                    "--breath-intensity": breathPulse.intensity,
                    "--breath-center": `${breathPulse.center}%`,
                    "--breath-width": `${breathPulse.width}%`,
                    "--breath-height": `${breathPulse.height}%`,
                    "--breath-rotate": `${breathPulse.rotate}deg`,
                    "--breath-opacity": breathPulse.opacity,
                    "--breath-hue-a": breathPulse.hueA,
                    "--breath-hue-b": breathPulse.hueB,
                    transform: `scale(${breathPulse.scale})`,
                    transition:
                      currentPhase === "hold"
                        ? "none"
                        : "transform 0.22s cubic-bezier(0.33, 1, 0.68, 1)",
                  } as React.CSSProperties
                }
              >
                <div className="ms-breath-visual">
                  <div className="ms-breath-visual__gradient-mask" aria-hidden>
                    <div className={`ms-breath-visual__gradient${isActive ? " is-active" : ""}`} />
                  </div>
                  <div className="ms-breath-visual__core" aria-hidden />
                  <div className="ms-breath-visual__hud">
                    <span className="ms-breath-visual__num">{secsLeft}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ms-breath-stage">
              <p className="ms-breath-stage__msg" style={{ color: PHASE_COLOR[currentPhase] }}>
                {phaseMessages[currentPhase]}
              </p>
              <div className="ms-breath-stage__sub">
                {currentPhase !== "rest" ? `${secsLeft} segundos` : "\u00a0"}
              </div>
            </div>

            <div className="ms-btn-row">
              <button type="button" className="ms-btn ms-btn--primary" onClick={isActive ? handlePause : handleStart}>
                {isActive ? <Pause size={18} strokeWidth={2.2} /> : <Play size={18} strokeWidth={2.2} />}
                {isActive ? "Pausar" : "Iniciar"}
              </button>
              <button type="button" className="ms-btn" onClick={resetMeditation}>
                <RotateCcw size={18} strokeWidth={2.2} />
                Reiniciar
              </button>
            </div>
          </>
        ) : (
          <div className="ms-breath-done">
            <div className="ms-breath-done__icon" aria-hidden>
              <Heart size={56} strokeWidth={1.8} fill="currentColor" />
            </div>
            <h2 className="ms-breath-done__title">Listo. Respiraste con calma.</h2>
            <p className="ms-text" style={{ textAlign: "center", marginBottom: 20 }}>
              Completaste {totalRounds} rondas. Un pequeño paso que ayuda a tu cuerpo a bajar la marcha.
            </p>

            <div className="ms-panel ms-breath-stats">
              <div className="ms-breath-stats__row">
                <strong>Rondas</strong>
                <span>{totalRounds}</span>
              </div>
              <div className="ms-breath-stats__row">
                <strong>Estado</strong>
                <span style={{ color: "var(--color-mint)", fontWeight: 600 }}>Más presente</span>
              </div>
            </div>

            <div className="ms-btn-row" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="ms-btn ms-btn--primary"
                onClick={() => {
                  resetMeditation();
                  setIsActive(true);
                  setCurrentPhase("inhale");
                }}
              >
                <RotateCcw size={18} strokeWidth={2.2} />
                Repetir
              </button>
              <button type="button" className="ms-btn" onClick={handleClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GuidedMeditation;
