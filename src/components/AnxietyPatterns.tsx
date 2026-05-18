import React, { useState, CSSProperties } from "react";
import { Modal, Rate } from "antd";
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Lightbulb } from "lucide-react";
import "../styles/ms-activities.css";
import "../styles/activity-modals.css";

interface AnxietyPatternsProps {
  visible: boolean;
  onClose: () => void;
}

type Step = "feeling" | "situation" | "timing" | "tips";

interface AnxietyData {
  intensity: number;
  situation: string[];
  timeOfDay: string;
  place: string;
  thoughts: string;
}

const AnxietyPatterns: React.FC<AnxietyPatternsProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>("feeling");
  const [anxietyData, setAnxietyData] = useState<AnxietyData>({
    intensity: 5,
    situation: [],
    timeOfDay: "",
    place: "",
    thoughts: "",
  });

  const situations = [
    { key: "school", label: "Escuela", emoji: "🏫" },
    { key: "friends", label: "Amigos", emoji: "👥" },
    { key: "family", label: "Familia", emoji: "👨‍👩‍👧‍👦" },
    { key: "exams", label: "Exámenes", emoji: "📚" },
    { key: "social", label: "Redes sociales", emoji: "📱" },
    { key: "future", label: "Futuro", emoji: "🔮" },
    { key: "body", label: "Imagen corporal", emoji: "🪞" },
    { key: "performance", label: "Rendimiento", emoji: "🎯" },
  ];

  const timesOfDay = [
    { key: "morning", label: "Mañana", emoji: "🌅" },
    { key: "afternoon", label: "Tarde", emoji: "☀️" },
    { key: "evening", label: "Noche", emoji: "🌙" },
    { key: "anytime", label: "Cualquier hora", emoji: "🕐" },
  ];

  const places = [
    { key: "home", label: "Casa", emoji: "🏠" },
    { key: "school", label: "Escuela", emoji: "🏫" },
    { key: "public", label: "Lugares públicos", emoji: "🏢" },
    { key: "online", label: "En línea", emoji: "💻" },
  ];

  const commonThoughts = [
    { key: "failure", label: "No soy lo suficientemente bueno/a", emoji: "😔" },
    { key: "judgment", label: "Todos me están juzgando", emoji: "👀" },
    { key: "catastrophe", label: "Algo malo va a pasar", emoji: "😰" },
    { key: "control", label: "No puedo controlar esto", emoji: "🌪️" },
    { key: "perfect", label: "Tengo que ser perfecto/a", emoji: "⭐" },
    { key: "rejection", label: "Van a rechazarme", emoji: "💔" },
  ];

  const steps: Record<Step, { title: string; progress: number }> = {
    feeling: { title: "¿Cómo te sentís?", progress: 25 },
    situation: { title: "¿Qué está pasando?", progress: 50 },
    timing: { title: "¿Cuándo y dónde?", progress: 75 },
    tips: { title: "Estrategias para vos", progress: 100 },
  };

  const handleNext = () => {
    const stepOrder: Step[] = ["feeling", "situation", "timing", "tips"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: Step[] = ["feeling", "situation", "timing", "tips"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleClose = () => {
    setCurrentStep("feeling");
    setAnxietyData({
      intensity: 5,
      situation: [],
      timeOfDay: "",
      place: "",
      thoughts: "",
    });
    onClose();
  };

  const handleSituationToggle = (key: string) => {
    setAnxietyData((prev) => ({
      ...prev,
      situation: prev.situation.includes(key)
        ? prev.situation.filter((s) => s !== key)
        : [...prev.situation, key],
    }));
  };

  const getPersonalizedTips = () => {
    const tips: { title: string; description: string; emoji: string; color: string }[] = [];

    if (anxietyData.intensity >= 8) {
      tips.push({
        title: "Respiración de apoyo",
        description: "Inspirá 4, aguantá 4, expirá 6. Repetí hasta sentir un poco más de calma.",
        emoji: "🫁",
        color: "var(--color-coral)",
      });
    }

    if (anxietyData.situation.includes("school") || anxietyData.situation.includes("exams")) {
      tips.push({
        title: "Pasos chicos",
        description: "Partí la tarea en partes. Cada mini logro cuenta.",
        emoji: "📚",
        color: "var(--color-sky)",
      });
    }

    if (anxietyData.situation.includes("social")) {
      tips.push({
        title: "Pausa digital",
        description: "Proba 20 minutos sin redes y dedicá ese tiempo a algo que te guste.",
        emoji: "📱",
        color: "var(--color-purple)",
      });
    }

    if (anxietyData.timeOfDay === "morning") {
      tips.push({
        title: "Mañana suave",
        description: "¿Podés levantarte 5 minutos antes para estirar o tomar agua sin apuro?",
        emoji: "🌅",
        color: "#ffc85c",
      });
    }

    tips.push(
      {
        title: "5-4-3-2-1",
        description: "5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que saboreás.",
        emoji: "👀",
        color: "var(--color-mint)",
      },
      {
        title: "Hablarte mejor",
        description: "Escribí una frase que le dirías a un amigo en tu lugar.",
        emoji: "💝",
        color: "var(--color-primary)",
      }
    );

    return tips.slice(0, 4);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "feeling":
        return (
          <div className="ms-pat-step">
            <h4 className="ms-pat-heading">¿Qué tan ansioso/a te sentís ahora?</h4>
            <div className="intensity-scale">
              <Rate
                count={10}
                value={anxietyData.intensity}
                onChange={(value) => setAnxietyData((prev) => ({ ...prev, intensity: value || 5 }))}
                character="💚"
                style={{ fontSize: 28 }}
              />
              <div className="intensity-labels">
                <span>1 · tranquilo/a</span>
                <span>10 · muy ansioso/a</span>
              </div>
            </div>

            <div className="intensity-description">
              {anxietyData.intensity <= 3 && "Te sentís bastante tranquilo/a."}
              {anxietyData.intensity > 3 && anxietyData.intensity <= 6 && "Hay un poco de nervios, es entendible."}
              {anxietyData.intensity > 6 && anxietyData.intensity <= 8 && "Está fuerte, pero podés acompañarte."}
              {anxietyData.intensity > 8 && "Está muy intenso. Ir despacio también es valiente."}
            </div>
          </div>
        );

      case "situation":
        return (
          <div className="ms-pat-step">
            <h4 className="ms-pat-heading">¿Qué situaciones te disparan?</h4>
            <span className="ms-pat-sub">Podés elegir varias.</span>

            <div className="ms-pat-grid">
              {situations.map((situation) => (
                <button
                  key={situation.key}
                  type="button"
                  className={`ms-select-card ${anxietyData.situation.includes(situation.key) ? "is-selected" : ""}`}
                  aria-pressed={anxietyData.situation.includes(situation.key)}
                  onClick={() => handleSituationToggle(situation.key)}
                >
                  <span className="ms-select-card__emoji">{situation.emoji}</span>
                  <span className="ms-select-card__label">{situation.label}</span>
                </button>
              ))}
            </div>

            <div className="thoughts-section">
              <h4 className="ms-pat-heading">¿Qué pensamiento aparece más?</h4>
              <div className="ms-pat-grid ms-pat-grid--tags">
                {commonThoughts.map((thought) => (
                  <button
                    key={thought.key}
                    type="button"
                    className={`ms-thought-btn ${anxietyData.thoughts === thought.key ? "is-selected" : ""}`}
                    aria-pressed={anxietyData.thoughts === thought.key}
                    onClick={() =>
                      setAnxietyData((prev) => ({
                        ...prev,
                        thoughts: prev.thoughts === thought.key ? "" : thought.key,
                      }))
                    }
                  >
                    {thought.emoji} {thought.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "timing":
        return (
          <div className="ms-pat-step">
            <h4 className="ms-pat-heading">¿Cuándo suele aparecer más?</h4>
            <div className="ms-pat-grid">
              {timesOfDay.map((time) => (
                <button
                  key={time.key}
                  type="button"
                  className={`ms-select-card ${anxietyData.timeOfDay === time.key ? "is-selected" : ""}`}
                  aria-pressed={anxietyData.timeOfDay === time.key}
                  onClick={() => setAnxietyData((prev) => ({ ...prev, timeOfDay: time.key }))}
                >
                  <span className="ms-select-card__emoji">{time.emoji}</span>
                  <span className="ms-select-card__label">{time.label}</span>
                </button>
              ))}
            </div>

            <h4 className="ms-pat-heading" style={{ marginTop: 22 }}>
              ¿En qué lugares?
            </h4>
            <div className="ms-pat-grid">
              {places.map((place) => (
                <button
                  key={place.key}
                  type="button"
                  className={`ms-select-card ${anxietyData.place === place.key ? "is-selected" : ""}`}
                  aria-pressed={anxietyData.place === place.key}
                  onClick={() => setAnxietyData((prev) => ({ ...prev, place: place.key }))}
                >
                  <span className="ms-select-card__emoji">{place.emoji}</span>
                  <span className="ms-select-card__label">{place.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "tips":
        return (
          <div className="ms-pat-step">
            <div className="tips-header">
              <CheckCircle2
                size={44}
                strokeWidth={1.6}
                color="var(--color-mint)"
                style={{ marginBottom: 12 }}
                aria-hidden
              />
              <h3 className="ms-title-lg" style={{ textAlign: "center" }}>
                Ideas para probar
              </h3>
              <p className="ms-text" style={{ textAlign: "center" }}>
                Según lo que marcaste, estas herramientas suelen ayudar.
              </p>
            </div>

            <div className="ms-tip-grid">
              {getPersonalizedTips().map((tip, index) => (
                <article
                  key={`${tip.title}-${index}`}
                  className="ms-tip-card"
                  style={{ "--tip-accent": tip.color } as CSSProperties}
                >
                  <div className="ms-tip-card__top">
                    <span className="ms-tip-card__emoji">{tip.emoji}</span>
                    <h4 className="ms-tip-card__title" style={{ color: "var(--color-ink)" }}>
                      {tip.title}
                    </h4>
                  </div>
                  <p className="ms-tip-card__body">{tip.description}</p>
                </article>
              ))}
            </div>

            <div className="ms-pat-reminder" style={{ marginTop: 18 }}>
              <Lightbulb size={28} strokeWidth={1.8} style={{ marginBottom: 8 }} aria-hidden />
              <h4>Recordá</h4>
              <p>
                La ansiedad es humana y cambia. Lo que probás hoy puede sentirse distinto mañana — la práctica
                cuenta.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const pct = steps[currentStep].progress;

  return (
    <Modal
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Heart size={22} strokeWidth={2.2} aria-hidden />
          <span>Patrones de ansiedad</span>
        </span>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
      wrapClassName="ms-modal-activity ms-modal-activity--patterns"
      className="anxiety-patterns-modal"
      destroyOnClose
    >
      <div className="ms-pat">
        <div className="ms-pat-steps">
          <div className="ms-pat-steps__bar" aria-hidden>
            <div className="ms-pat-steps__fill" style={{ width: `${pct}%` }} />
          </div>
          <h3 className="ms-pat-steps__title">{steps[currentStep].title}</h3>
        </div>

        {renderStepContent()}

        <div className="ms-pat-nav">
          {currentStep !== "feeling" && (
            <button type="button" className="ms-btn" onClick={handlePrevious}>
              <ArrowLeft size={18} strokeWidth={2.2} aria-hidden />
              Anterior
            </button>
          )}
          {currentStep !== "tips" ? (
            <button type="button" className="ms-btn ms-btn--primary" onClick={handleNext}>
              Siguiente
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden />
            </button>
          ) : (
            <button type="button" className="ms-btn ms-btn--primary" onClick={handleClose}>
              <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden />
              Listo
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AnxietyPatterns;
