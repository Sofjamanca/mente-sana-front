import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/DailySummary.css';

interface DailySummaryProps {
  // Props para modo diálogo
  isDialog?: boolean;
  visible?: boolean;
  onClose?: () => void;
  targetDate?: string;
  existingEntry?: {
    id: string;
    mood: number;
    notes: string | null;
    aiMessage: string | null;
    date: string;
  } | null;
}

const DailySummary = ({ 
  isDialog = false, 
  visible = true, 
  onClose, 
  targetDate: propTargetDate, 
  existingEntry: propExistingEntry 
}: DailySummaryProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [moodValue, setMoodValue] = useState(4);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [existingEntry, setExistingEntry] = useState<{
    id: string;
    mood: number;
    notes: string | null;
    aiMessage: string | null;
    date: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false); // Nuevo estado para modo visualización

  // Mapeo de valores a emojis y descripciones
  const moodMap = {
    1: { emoji: '😢', description: 'Muy triste', color: '#ff4757' },
    2: { emoji: '😔', description: 'Triste', color: '#ff6b7a' },
    3: { emoji: '😐', description: 'Regular', color: '#ffa502' },
    4: { emoji: '🙂', description: 'Bien', color: '#ffed4e' },
    5: { emoji: '😊', description: 'Muy bien', color: '#7bed9f' },
    6: { emoji: '😍', description: 'Fantástico', color: '#ff9ff3' },
    7: { emoji: '🥳', description: 'Increíble', color: '#54a0ff' },
  };

  const currentMood = moodMap[moodValue as keyof typeof moodMap];

  // Obtener fecha de la URL o props y verificar entrada existente
  useEffect(() => {
    console.log('🔍 DEBUG: useEffect ejecutado con:', {
      isDialog,
      propTargetDate,
      propExistingEntry,
      visible
    });

    // Resetear solo los estados de UI, no los de datos
    setSuccess(false);
    setError('');

    if (isDialog) {
      // Modo diálogo: usar props
      if (propTargetDate) {
        setTargetDate(propTargetDate);
      }
      
      if (propExistingEntry) {
        // Hay entrada existente - modo visualización
        console.log('🔍 DEBUG: Entrada existente recibida:', propExistingEntry);
        setExistingEntry(propExistingEntry);
        setIsViewing(true);
        setIsEditing(false);
        setMoodValue(propExistingEntry.mood);
        setMessage(propExistingEntry.notes || '');
        setAiMessage(propExistingEntry.aiMessage || '');
        console.log('🔍 DEBUG: Modo visualización activado, isViewing=true');
      } else {
        // No hay entrada existente - modo creación
        console.log('🔍 DEBUG: No hay entrada existente, modo creación');
        setExistingEntry(null);
        setIsViewing(false);
        setIsEditing(false);
        setMoodValue(4);
        setMessage('');
        setAiMessage('');
        console.log('🔍 DEBUG: Modo creación activado, isViewing=false, isEditing=false');
      }
    } else {
      // Modo página: usar URL
      const dateParam = searchParams.get('date');
      if (dateParam) {
        setTargetDate(dateParam);
        checkExistingEntry(dateParam);
      }
    }
  }, [isDialog, propTargetDate, propExistingEntry, searchParams, visible]);

  // Resetear estados adicionales cuando el diálogo se hace visible
  useEffect(() => {
    if (isDialog && visible) {
      setSuccess(false);
      setError('');
      setLoading(false);
    }
  }, [isDialog, visible]);

  const checkExistingEntry = async (date: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/daily-entries/date/${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasEntry && data.existingEntry) {
          setExistingEntry(data.existingEntry);
          setIsEditing(true);
          setMoodValue(data.existingEntry.mood);
          setMessage(data.existingEntry.notes || '');
          setAiMessage(data.existingEntry.aiMessage || '');
        }
      }
    } catch (error) {
      console.error('Error verificando entrada existente:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const useDate = targetDate || new Date().toISOString().split('T')[0];
      
      if (isEditing && existingEntry) {
        // Actualizar entrada existente
        const response = await fetch(`/api/daily-entries/${existingEntry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mood: moodValue,
            notes: message
          })
        });

        if (response.ok) {
          const entry = await response.json();
          setSuccess(true);
          setAiMessage(entry.aiMessage || '');
          setIsEditing(true);
        } else {
          const data = await response.json();
          setError(data.message || 'Error al actualizar el registro');
        }
      } else {
        // Crear nueva entrada
        const response = await fetch('/api/daily-entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mood: moodValue,
            notes: message,
            date: useDate
          })
        });

        if (response.ok) {
          const entry = await response.json();
          setSuccess(true);
          setAiMessage(entry.aiMessage || '');
          setMessage('');
          setIsEditing(false);
        } else {
          const data = await response.json();
          setError(data.message || 'Error al guardar el registro');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setMoodValue(newValue);
    
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const getDisplayDate = () => {
    if (targetDate) {
      // Crear fecha local para evitar problemas de zona horaria
      const [year, month, day] = targetDate.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const currentDate = getDisplayDate();

  // Función para verificar si es el día actual
  const isToday = () => {
    if (!targetDate) return true; // Si no hay targetDate, asumimos que es hoy
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return targetDate === todayStr;
  };

  // Si es diálogo y no está visible, no renderizar
  if (isDialog && !visible) return null;

  // Si es diálogo, renderizar como overlay
  if (isDialog) {
    return (
      <div className="daily-summary-dialog-overlay">
        <div className="daily-summary-dialog">
          <div 
            className="daily-container"
            style={{
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.1), 0 0 40px ${currentMood.color}60, 0 0 80px ${currentMood.color}30`
            }}
          >
            <header className="daily-header">
              <div className="header-top">
                <button 
                  onClick={onClose} 
                  className="back-btn"
                  type="button"
                >
                  ✕ Cerrar
                </button>
              </div>
              <h1>
                {isViewing 
                  ? `Tu registro del día`
                  : isEditing 
                    ? `Editar registro del día ` 
                    : (isToday() ? '¿Cómo te sentís hoy?' : '¿Cómo te sentiste este día? ')
                }
              </h1>
              <p className="date-text">{currentDate}</p>
              {targetDate && !isEditing && !isToday() && (
                <p className="date-note">Registrando entrada para una fecha anterior</p>
              )}
            </header>

            {isViewing ? (
              /* Modo Visualización - Solo lectura */
              <div className="mood-view">
                {/* Emoji Display */}
                <div className="mood-display">
                  <div 
                    className="emoji-container"
                    style={{ backgroundColor: currentMood.color }}
                  >
                    <span className="mood-emoji">{currentMood.emoji}</span>
                  </div>
                  <h2 className="mood-description">{currentMood.description}</h2>
                </div>

                {/* Información de la entrada */}
                <div className="entry-info">
                  <div className="info-item">
                    <label className="info-label">Estado de ánimo:</label>
                    <div className="info-value">{moodValue}/7 - {currentMood.description}</div>
                  </div>
                  
                  {message && (
                    <div className="info-item">
                      <label className="info-label">Notas del día:</label>
                      <div className="info-value notes-content">{message}</div>
                    </div>
                  )}
                  
                  {aiMessage && (
                    <div className="ai-message">
                      <div className="ai-message-header">💭 Reflexión del día:</div>
                      <div className="ai-message-content">{aiMessage}</div>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="view-actions">
                  <button 
                    type="button"
                    className="close-btn"
                    onClick={onClose}
                    style={{ width: '100%' }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo Creación/Edición - Formulario */
              <form onSubmit={handleSubmit} className="mood-form">
                {/* Emoji Display */}
                <div className="mood-display">
                  <div 
                    className="emoji-container"
                    style={{ backgroundColor: currentMood.color }}
                  >
                    <span className="mood-emoji">{currentMood.emoji}</span>
                  </div>
                  <h2 className="mood-description">{currentMood.description}</h2>
                </div>

                {/* Slider */}
                <div className="slider-container">
                  <label htmlFor="mood-slider" className="slider-label">
                    Desliza para seleccionar tu estado de ánimo
                  </label>
                  <input
                    id="mood-slider"
                    type="range"
                    min="1"
                    max="7"
                    value={moodValue}
                    onChange={handleSliderChange}
                    className="mood-slider"
                    style={{
                      background: `linear-gradient(to right, #ff4757 0%, ${currentMood.color} ${(moodValue - 1) * 16.67}%, #ddd ${(moodValue - 1) * 16.67}%, #ddd 100%)`
                    }}
                    disabled={loading}
                  />
                  <div className="slider-labels">
                    <span>😢</span>
                    <span>🙂</span>
                    <span>🥳</span>
                  </div>
                </div>

                {/* Message Input */}
                <div className="message-container">
                  <label htmlFor="mood-message" className="message-label">
                    Contanos más sobre tu día (opcional)
                  </label>
                  <textarea
                    id="mood-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="¿Qué ha hecho que te sientas así? Comparte tus pensamientos..."
                    className="mood-textarea"
                    rows={4}
                    disabled={loading}
                  />
                </div>

                {/* Error/Success Messages */}
                {error && <div className="error-message">{error}</div>}
                {success && (
                  <div className="success-container">
                    <div className="success-message">¡Registro guardado exitosamente! 🎉</div>
                    {aiMessage && (
                      <div className="ai-message">
                        <div className="ai-message-header">💭 Reflexión del día:</div>
                        <div className="ai-message-content">{aiMessage}</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button 
                        onClick={() => {
                          setSuccess(false);
                          setAiMessage('');
                          setError('');
                        }}
                        className="new-entry-btn"
                        style={{ flex: 1 }}
                      >
                        Registrar nueva entrada
                      </button>
                      {isDialog && onClose && (
                        <button 
                          onClick={onClose}
                          className="close-btn"
                          style={{ flex: 1 }}
                        >
                          Cerrar
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : isEditing ? 'Actualizar registro' : 'Guardar mi estado de ánimo'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Modo página completa (comportamiento original)
  return (
    <div className="daily-summary">
      <div 
        className="daily-container"
        style={{
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.1), 0 0 40px ${currentMood.color}60, 0 0 80px ${currentMood.color}30`
        }}
      >
        <header className="daily-header">
          <div className="header-top">
            <button 
              onClick={() => navigate('/')} 
              className="back-btn"
              type="button"
            >
              ← Volver
            </button>
          </div>
          <h1>{isEditing ? 'Editar registro del día' : (isToday() ? '¿Cómo te sentís hoy?' : '¿Cómo te sentiste este día?')}</h1>
          <p className="date-text">{currentDate}</p>
          {targetDate && !isEditing && !isToday() && (
            <p className="date-note">Registrando entrada para una fecha anterior</p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="mood-form">
          {/* Emoji Display */}
          <div className="mood-display">
            <div 
              className="emoji-container"
              style={{ backgroundColor: currentMood.color }}
            >
              <span className="mood-emoji">{currentMood.emoji}</span>
            </div>
            <h2 className="mood-description">{currentMood.description}</h2>
          </div>

          {/* Slider */}
          <div className="slider-container">
            <label htmlFor="mood-slider" className="slider-label">
              Desliza para seleccionar tu estado de ánimo
            </label>
            <input
              id="mood-slider"
              type="range"
              min="1"
              max="7"
              value={moodValue}
              onChange={handleSliderChange}
              className="mood-slider"
              style={{
                background: `linear-gradient(to right, #ff4757 0%, ${currentMood.color} ${(moodValue - 1) * 16.67}%, #ddd ${(moodValue - 1) * 16.67}%, #ddd 100%)`
              }}
              disabled={loading}
            />
            <div className="slider-labels">
              <span>😢</span>
              <span>🙂</span>
              <span>🥳</span>
            </div>
          </div>

          {/* Message Input */}
          <div className="message-container">
            <label htmlFor="mood-message" className="message-label">
              Contanos más sobre tu día (opcional)
            </label>
            <textarea
              id="mood-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="¿Qué ha hecho que te sientas así? Comparte tus pensamientos..."
              className="mood-textarea"
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Error/Success Messages */}
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-container">
              <div className="success-message">¡Registro guardado exitosamente! 🎉</div>
              {aiMessage && (
                <div className="ai-message">
                  <div className="ai-message-header">💭 Reflexión del día:</div>
                  <div className="ai-message-content">{aiMessage}</div>
                </div>
              )}
              <button 
                onClick={() => {
                  setSuccess(false);
                  setAiMessage('');
                  setError('');
                }}
                className="new-entry-btn"
              >
                Registrar nueva entrada
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar registro' : 'Guardar mi estado de ánimo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailySummary;  