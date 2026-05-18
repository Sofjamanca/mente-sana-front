import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Lock,
  Pencil,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  MoodFace,
  moodScale,
  getMoodByValue,
  useAnimatedValue,
} from "../components/MoodFace";
import { CheckinWeekToggle } from "../components/CheckinWeekToggle";
import AiMessageContent from "../components/AiMessageContent";
import {
  buildWeekDaysForAnchor,
  formatLocalDate,
  getMondayBasedDayIndex,
  parseLocalDate,
} from "../utils/checkinWeek";
import "../styles/DailySummary.css";

interface ExistingEntry {
  id: string;
  mood: number;
  notes: string | null;
  aiMessage: string | null;
  aiMessageData?: {
    title?: string;
    summary?: string;
    steps?: string[];
    closing?: string;
  } | null;
  date: string;
}

interface DailySummaryProps {
  isDialog?: boolean;
  visible?: boolean;
  onClose?: () => void;
  targetDate?: string;
  existingEntry?: ExistingEntry | null;
}

const moodSuggestionTopics: Record<number, string[]> = {
  1: ["Ansiedad", "Soledad", "Cansancio", "Preocupaciones", "Desahogo"],
  2: ["Frustracion", "Limites", "Conflictos", "Estres", "Impaciencia"],
  3: ["Rutina", "Dudas", "Energia", "Trabajo", "Descanso"],
  4: ["Gratitud", "Logros", "Calma", "Motivacion", "Vinculos"],
  5: ["Alegria", "Celebracion", "Progreso", "Conexion", "Bienestar"],
};

const DailySummary = ({
  isDialog = false,
  visible = true,
  onClose,
  targetDate: propTargetDate,
  existingEntry: propExistingEntry,
}: DailySummaryProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [moodValue, setMoodValue] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessageData, setAiMessageData] = useState<ExistingEntry["aiMessageData"]>(null);
  const [targetDate, setTargetDate] = useState<string>("");
  const [existingEntry, setExistingEntry] = useState<ExistingEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isMoodInteracting, setIsMoodInteracting] = useState(false);
  const [moodInteractionKey, setMoodInteractionKey] = useState(0);
  const moodInteractionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setSuccess(false);
    setError("");

    if (isDialog) {
      if (propTargetDate) {
        setTargetDate(propTargetDate);
      }

      if (propExistingEntry) {
        setExistingEntry(propExistingEntry);
        setIsViewing(true);
        setIsEditing(false);
        setMoodValue(propExistingEntry.mood);
        setMessage(propExistingEntry.notes || "");
        setAiMessage(propExistingEntry.aiMessage || "");
        setAiMessageData(propExistingEntry.aiMessageData || null);
      } else {
        setExistingEntry(null);
        setIsViewing(false);
        setIsEditing(false);
        setMoodValue(null);
        setMessage("");
        setAiMessage("");
        setAiMessageData(null);
      }
    } else {
      const dateParam = searchParams.get("date");
      const today = formatLocalDate(new Date());
      if (dateParam) {
        const effective = dateParam > today ? today : dateParam;
        setTargetDate(effective);
        if (dateParam > today) {
          setSearchParams({ date: effective }, { replace: true });
        }
        checkExistingEntry(effective);
      } else {
        setTargetDate(today);
        checkExistingEntry(today);
      }
    }
  }, [isDialog, propTargetDate, propExistingEntry, searchParams, visible]);

  useEffect(() => {
    if (isDialog && visible) {
      setSuccess(false);
      setError("");
      setLoading(false);
    }
  }, [isDialog, visible]);

  useEffect(() => {
    return () => {
      if (moodInteractionTimeoutRef.current !== null) {
        window.clearTimeout(moodInteractionTimeoutRef.current);
      }
    };
  }, []);

  const triggerMoodInteraction = () => {
    setIsMoodInteracting(true);
    setMoodInteractionKey((key) => key + 1);
    if (moodInteractionTimeoutRef.current !== null) {
      window.clearTimeout(moodInteractionTimeoutRef.current);
    }
    moodInteractionTimeoutRef.current = window.setTimeout(() => {
      setIsMoodInteracting(false);
      moodInteractionTimeoutRef.current = null;
    }, 950);
  };

  const checkExistingEntry = async (date: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/daily-entries/date/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasEntry && data.existingEntry) {
          setExistingEntry(data.existingEntry);
          setIsViewing(true);
          setIsEditing(false);
          setMoodValue(data.existingEntry.mood);
          setMessage(data.existingEntry.notes || "");
          setAiMessage(data.existingEntry.aiMessage || "");
          setAiMessageData(data.existingEntry.aiMessageData || null);
        } else {
          setExistingEntry(null);
          setIsViewing(false);
          setIsEditing(false);
          setMoodValue(null);
          setMessage("");
          setAiMessage("");
          setAiMessageData(null);
        }
      }
    } catch (err) {
      console.error("Error verificando entrada existente:", err);
    }
  };

  const anchorDate = useMemo(() => {
    if (targetDate) return parseLocalDate(targetDate);
    return new Date();
  }, [targetDate]);

  const summaryWeekDays = useMemo(
    () => buildWeekDaysForAnchor(anchorDate),
    [anchorDate]
  );

  const selectedWeekDayIndex = useMemo(() => {
    const i = summaryWeekDays.findIndex((d) => d.dateStr === targetDate);
    if (i >= 0) return i;
    return getMondayBasedDayIndex(new Date());
  }, [summaryWeekDays, targetDate]);

  const selectedDayFull =
    summaryWeekDays.find((d) => d.dateStr === targetDate)?.full ?? "";

  const handleSelectSummaryDay = (index: number) => {
    const dateStr = summaryWeekDays[index]?.dateStr;
    const today = formatLocalDate(new Date());
    if (!dateStr || dateStr > today) return;
    setSuccess(false);
    setError("");
    setLoading(false);
    setTargetDate(dateStr);
    if (!isDialog) {
      setSearchParams({ date: dateStr }, { replace: true });
    }
    void checkExistingEntry(dateStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodValue) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const useDate = targetDate || formatLocalDate(new Date());
      const moodToSave = Math.round(moodValue);

      if (isEditing && existingEntry) {
        const response = await fetch(`/api/daily-entries/${existingEntry.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mood: moodToSave, notes: message }),
        });

        if (response.ok) {
          const entry = await response.json();
          setSuccess(true);
          setAiMessage(entry.aiMessage || "");
          setAiMessageData(entry.aiMessageData || null);
        } else {
          const data = await response.json();
          setError(data.message || "Error al actualizar el registro");
        }
      } else {
        const response = await fetch("/api/daily-entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mood: moodToSave, notes: message, date: useDate }),
        });

        if (response.ok) {
          const entry = await response.json();
          setSuccess(true);
          setAiMessage(entry.aiMessage || "");
          setAiMessageData(entry.aiMessageData || null);
          setIsEditing(false);
        } else {
          const data = await response.json();
          setError(data.message || "Error al guardar el registro");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayDate = () => {
    if (targetDate) {
      const [year, month, day] = targetDate.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentDate = getDisplayDate();
  const isToday = () => {
    if (!targetDate) return true;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return targetDate === todayStr;
  };



  const handleEditMode = () => {
    setIsViewing(false);
    setIsEditing(true);
    setSuccess(false);
    setError("");
  };

  const animatedMood = useAnimatedValue(moodValue ?? 4, 480);

  if (isDialog && !visible) return null;

  const headerEyebrow = isViewing
    ? "Tu registro"
    : isEditing
      ? "Editando"
      : isToday()
        ? "Check-in de hoy"
        : "Registro retroactivo";

  const selectedMoodData = moodValue ? getMoodByValue(moodValue) : null;
  const previewMood = getMoodByValue(moodValue ?? 4);
  const sliderPercent = (((moodValue ?? 4) - 1) / 4) * 100;
  const suggestionTopics = moodSuggestionTopics[Math.round(moodValue ?? 3)] ?? moodSuggestionTopics[3];

  const handleSuggestionClick = (topic: string) => {
    setMessage((current) => {
      if (current.toLowerCase().includes(topic.toLowerCase())) return current;
      if (!current.trim()) return `${topic}: `;
      return `${current.trimEnd()}\n\n${topic}: `;
    });
  };

  const displayAiMessage = aiMessage;

  // —— Vista de solo lectura ——
  const viewContent = (
    <article className="ds-card">
      <header className="ds-card__head">
        <div className="ds-card__head-top">
          <span className="ds-eyebrow">
            <Sparkles size={12} strokeWidth={2.4} aria-hidden /> {headerEyebrow}
          </span>
          {!isDialog && (
            <CheckinWeekToggle
              days={summaryWeekDays}
              selectedIndex={selectedWeekDayIndex}
              onSelect={handleSelectSummaryDay}
              variant="summary"
            />
          )}
        </div>
        <h1 className="ds-title">
          Así te <em>sentiste</em>
        </h1>
        <p className="ds-subtitle">{currentDate}</p>
      </header>

      {selectedMoodData && moodValue && (
        <div className="ds-mood-display">
          <div className={`ds-mood-display__face tone-${selectedMoodData.tone}`}>
            <MoodFace value={moodValue} tone={selectedMoodData.tone} idle />
          </div>
          <div>
            <strong className="ds-mood-display__label">{selectedMoodData.label}</strong>
          </div>
        </div>
      )}

      {message && (
        <section className="ds-notes-block">
          <span className="ds-step-label"><i>·</i> Lo que escribiste</span>
          <p>{message}</p>
        </section>
      )}

      {displayAiMessage && (
        <section className="ds-ai-block">
          <div className="ds-bubble">
            <AiMessageContent plainMessage={displayAiMessage} uiMessage={aiMessageData || null} />
          </div>
        </section>
      )}

      <footer className="ds-card__footer ds-card__footer--end">
        <button type="button" className="ds-btn-ghost" onClick={handleEditMode}>
          <Pencil size={14} strokeWidth={2.2} aria-hidden /> Editar registro
        </button>
        {isDialog ? (
          <button type="button" className="ds-btn-primary" onClick={onClose}>
            Cerrar
          </button>
        ) : (
          <button type="button" className="ds-btn-primary" onClick={() => navigate("/home")}>
            Volver al inicio <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </button>
        )}
      </footer>
    </article>
  );

  // —— Estado de éxito (después de guardar) ——
  const successContent = (
    <article className="ds-card ds-card--response">
      <header className="ds-card__head">
        <div className="ds-card__head-top">
          
          {!isDialog && (
            <CheckinWeekToggle
              days={summaryWeekDays}
              selectedIndex={selectedWeekDayIndex}
              onSelect={handleSelectSummaryDay}
              variant="summary"
            />
          )}
        </div>
        <h1 className="ds-title">
          Gracias por <em>compartir</em>.
        </h1>
        <p className="ds-subtitle">Tu registro quedó guardado para {currentDate.toLowerCase()}.</p>
      </header>

      {selectedMoodData && moodValue && (
        <div className="ds-mood-display ds-mood-display--small">
          <div className={`ds-mood-display__face tone-${selectedMoodData.tone}`}>
            <MoodFace value={moodValue} tone={selectedMoodData.tone} idle />
          </div>
          <div>
            <span className="ds-mood-display__scale">Te sentiste</span>
            <strong className="ds-mood-display__label">{selectedMoodData.label.toLowerCase()}</strong>
          </div>
        </div>
      )}

      {displayAiMessage && (
        <div className="ds-bubble">
          <AiMessageContent plainMessage={displayAiMessage} uiMessage={aiMessageData || null} />
        </div>
      )}

      <footer className="ds-card__footer">
        
        {isDialog ? (
          <button type="button" className="ds-btn-primary" onClick={onClose}>
            Cerrar
          </button>
        ) : (
          <button type="button" className="ds-btn-primary" onClick={() => navigate("/home")}>
            Volver al inicio <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </button>
        )}
      </footer>
    </article>
  );

  // —— Formulario (crear o editar) ——
  const formContent = (
    <article className="ds-card">
      <header className="ds-card__head">
        <div className="ds-card__head-top">
          <span className="ds-eyebrow">
            <Sparkles size={12} strokeWidth={2.4} aria-hidden /> {headerEyebrow}
          </span>
          {!isDialog && (
            <CheckinWeekToggle
              days={summaryWeekDays}
              selectedIndex={selectedWeekDayIndex}
              onSelect={handleSelectSummaryDay}
              variant="summary"
            />
          )}
        </div>
        <h1 className="ds-title">
          {isEditing ? (
            <>
              Editar <em>tu día</em>.
            </>
          ) : isToday() ? (
            <>
              ¿Cómo te <em>sentís</em> hoy?
            </>
          ) : (
            <>
              ¿Cómo te <em>sentiste</em> el {selectedDayFull.toLowerCase()}?
            </>
          )}
        </h1>
        <p className="ds-subtitle">
          <CalendarDays size={14} strokeWidth={2.2} aria-hidden /> {currentDate}
        </p>
        {targetDate && !isEditing && !isToday() && (
          <span className="ds-callout">Registrando una fecha anterior.</span>
        )}
      </header>

      <form className="ds-form" onSubmit={handleSubmit}>
        <section className="ds-step">
          <span className="ds-step-label">
            <i>1</i>{" "}
            {isToday()
              ? "Deslizá para elegir cómo te sentís"
              : "Deslizá para elegir cómo te sentiste"}
          </span>

          <div className={`ds-mood-hero tone-${previewMood.tone} ${moodValue ? "is-selected" : "is-empty"}`}>
            <div className="ds-mood-hero__face">
              <MoodFace
                key={`hero-face-${moodInteractionKey}`}
                value={animatedMood}
                tone={previewMood.tone}
                idle={Boolean(moodValue)}
                interactive={isMoodInteracting}
              />
            </div>
            <strong
              className="ds-mood-hero__label"
              key={moodValue ? previewMood.label : "empty"}
            >
              {moodValue ? previewMood.label : "Desplaza la barra"}
            </strong>
          </div>

          <div
            className={`ds-slider-wrap tone-${previewMood.tone}`}
            style={{ ["--slider-fill" as string]: `${sliderPercent}%` }}
          >
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={moodValue ?? 4}
              onChange={(e) => {
                setMoodValue(Number(e.target.value));
                triggerMoodInteraction();
              }}
              className="ds-slider"
              disabled={loading}
              aria-label="Estado de ánimo"
            />
            <div className="ds-slider-ticks" aria-hidden="true">
              {moodScale.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`ds-slider-tick tone-${m.tone} ${moodValue === m.value ? "is-active" : ""}`}
                  onClick={() => {
                    setMoodValue(m.value);
                    triggerMoodInteraction();
                  }}
                  disabled={loading}
                  title={m.label}
                  aria-label={m.label}
                >
                  <MoodFace value={m.value} tone={m.tone} />
                </button>
              ))}
            </div>
            <div className="ds-slider-labels" aria-hidden="true">
              <span>Triste</span>
              <span>Neutral</span>
              <span>Feliz</span>
            </div>
          </div>
        </section>

        <section className="ds-step">
          <span className="ds-step-label">
            <i>2</i> Contame qué pasa <small>(opcional)</small>
          </span>
          <textarea
            className="ds-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsTextareaFocused(true)}
            onClick={() => setIsTextareaFocused(true)}
            onBlur={() => window.setTimeout(() => setIsTextareaFocused(false), 120)}
            placeholder="Hoy me siento... porque..."
            rows={5}
            disabled={loading}
          />
          {isTextareaFocused && moodValue && (
            <div className={`ds-topic-pills tone-${previewMood.tone}`} aria-label="Temas sugeridos">
              {suggestionTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="ds-topic-pill"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
          <small className="ds-textarea-hint">
            {message.length > 0
              ? `${message.length} caracteres`
              : "Escribir te ayuda a entender mejor lo que estás sintiendo."}
          </small>
        </section>

        {error && (
          <div className="ds-error" role="alert">
            {error}
          </div>
        )}

        <footer className="ds-card__footer">
          <p className="ds-privacy">
            <Lock size={14} strokeWidth={2.2} aria-hidden /> Tu registro es privado y solo vos podés verlo.
          </p>
          <button
            type="submit"
            className="ds-btn-primary"
            disabled={!moodValue || loading}
          >
            {loading
              ? "Guardando..."
              : isEditing
                ? "Actualizar registro"
                : "Guardar Registro"}
            {!loading && <Send size={16} strokeWidth={2.2} aria-hidden />}
          </button>
        </footer>
      </form>
    </article>
  );

  const mainContent = success
    ? successContent
    : isViewing
      ? viewContent
      : formContent;

  const pageBody = (
    <div className="ds-shell">
      <header className="ds-topbar">
        {isDialog ? (
          <button type="button" className="ds-back" onClick={onClose}>
            <X size={16} strokeWidth={2.2} aria-hidden /> Cerrar
          </button>
        ) : (
          <button type="button" className="ds-back" onClick={() => navigate("/home")}>
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden /> Volver
          </button>
        )}
        <span className="ds-date-pill">
          <CalendarDays size={13} strokeWidth={2.2} aria-hidden />
          {currentDate}
        </span>
      </header>

      <main className="ds-main" key={success ? "success" : isViewing ? "view" : "form"}>
        {mainContent}
      </main>
    </div>
  );

  if (isDialog) {
    return (
      <div className="ds-overlay" role="dialog" aria-modal="true">
        {pageBody}
      </div>
    );
  }

  return <div className="ds-page">{pageBody}</div>;
};

export default DailySummary;
