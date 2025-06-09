import { useState } from 'react';
import '../styles/DailySummary.css';

const DailySummary = () => {
  const [moodValue, setMoodValue] = useState(4);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/daily-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: moodValue,
          notes: message,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const entry = await response.json();
        setSuccess(true);
        setAiMessage(entry.aiMessage || '');
        setMessage('');
        // No ocultar automáticamente para que el usuario pueda leer el mensaje de AI
        // setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al guardar el registro');
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

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="daily-summary">
              <div 
          className="daily-container"
          style={{
            boxShadow: `0 10px 30px rgba(0, 0, 0, 0.1), 0 0 40px ${currentMood.color}60, 0 0 80px ${currentMood.color}30`
          }}
        >
        <header className="daily-header">
          <h1>¿Cómo te sentiste hoy?</h1>
          <p className="date-text">{currentDate}</p>
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
              Cuéntanos más sobre tu día (opcional)
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
            {loading ? 'Guardando...' : 'Guardar mi estado de ánimo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailySummary;
  