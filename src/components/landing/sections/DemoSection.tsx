import { useState } from 'react';
import { MoodChart } from '../../MoodChart';
import { moodMap, getDemoAIMessage } from '../data';

interface DemoSectionProps {
  theme: 'light' | 'dark';
}

export const DemoSection = ({ theme }: DemoSectionProps) => {
  const [demoMoodValue, setDemoMoodValue] = useState(4);
  const [demoMessage, setDemoMessage] = useState('');
  const [demoView, setDemoView] = useState<'form' | 'ai-response' | 'chart'>('form');

  const currentDemoMood = moodMap[demoMoodValue as keyof typeof moodMap];

  const handleDemoSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setDemoMoodValue(newValue);
    
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <section className={`landing-demo-section ${theme}`} id="demo">
      <div className="landing-demo-content">
        <div className="demo-text-content">
          <h2 className={`landing-demo-title ${theme}`}>
            Prueba cómo funciona
          </h2>
          <p className={`landing-demo-subtitle ${theme}`}>
            Experimenta el registro de emociones que usarás cada día. Desliza el control para seleccionar tu estado de ánimo y recibe una respuesta personalizada de nuestra IA.
          </p>
          <div className="demo-features-list">
            <div 
              className={`demo-feature-item ${demoView === 'form' ? 'active' : ''}`}
              onClick={() => setDemoView('form')}
            >
              <span className="demo-feature-icon">😊</span>
              <span className="demo-feature-text">Registro de emociones</span>
            </div>
            <div 
              className={`demo-feature-item ${demoView === 'ai-response' ? 'active' : ''}`}
              onClick={() => setDemoView('ai-response')}
            >
              <span className="demo-feature-icon">🤖</span>
              <span className="demo-feature-text">Respuesta de IA</span>
            </div>
            <div 
              className={`demo-feature-item ${demoView === 'chart' ? 'active' : ''}`}
              onClick={() => setDemoView('chart')}
            >
              <span className="demo-feature-icon">📊</span>
              <span className="demo-feature-text">Resumen semanal</span>
            </div>
          </div>
        </div>
        
        <div className="demo-interactive-content">
          <div 
            className="demo-mood-form"
            style={{
              boxShadow: demoView === 'form' ? `0 10px 30px rgba(0, 0, 0, 0.1), 0 0 40px ${currentDemoMood.color}60` : '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            {demoView === 'form' && (
              <>
                {/* Demo Emoji Display */}
                <div className="demo-mood-display">
                  <div 
                    className="demo-emoji-container"
                    style={{ backgroundColor: currentDemoMood.color }}
                  >
                    <span className="demo-mood-emoji">{currentDemoMood.emoji}</span>
                  </div>
                  <h3 className="demo-mood-description">{currentDemoMood.description}</h3>
                </div>

                {/* Demo Slider */}
                <div className="demo-slider-container">
                  <label className="demo-slider-label">
                    ¿Cómo te sientes hoy?
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={demoMoodValue}
                    onChange={handleDemoSliderChange}
                    className="demo-mood-slider"
                    style={{
                      background: `linear-gradient(to right, #ff4757 0%, ${currentDemoMood.color} ${(demoMoodValue - 1) * 16.67}%, #ddd ${(demoMoodValue - 1) * 16.67}%, #ddd 100%)`
                    }}
                  />
                  <div className="demo-slider-labels">
                    <span>😢</span>
                    <span>🙂</span>
                    <span>🥳</span>
                  </div>
                </div>

                {/* Demo Message Input */}
                <div className="demo-message-container">
                  <label className="demo-message-label">
                    Cuéntanos sobre tu día (opcional)
                  </label>
                  <textarea
                    value={demoMessage}
                    onChange={(e) => setDemoMessage(e.target.value)}
                    placeholder="¿Qué ha hecho que te sientas así?"
                    className="demo-mood-textarea"
                    rows={3}
                  />
                </div>

                {/* Demo Submit Button */}
                <button 
                  onClick={() => setDemoView('ai-response')}
                  className="demo-submit-btn"
                >
                  Guardar estado de ánimo
                </button>
              </>
            )}

            {demoView === 'ai-response' && (
              <div className="demo-result">
                <div className="demo-success-message">
                  ¡Así se ve tu registro guardado! 🎉
                </div>
                <div className="demo-ai-response">
                  <div className="demo-ai-header">💭 Respuesta personalizada de IA:</div>
                  <div className="demo-ai-content">{getDemoAIMessage(demoMoodValue)}</div>
                </div>
                <button 
                  onClick={() => setDemoView('form')}
                  className="demo-try-again-btn"
                >
                  ← Volver al registro
                </button>
                <a href="/register" className="demo-register-btn">
                  Registrarse para usar la app completa
                </a>
              </div>
            )}

            {demoView === 'chart' && (
              <div className="demo-chart-container">
                <h3 style={{ 
                  textAlign: 'center', 
                  marginBottom: '1.5rem', 
                  color: '#be185d',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  Tu progreso semanal
                </h3>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <MoodChart />
                </div>
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '1.5rem',
                  flexShrink: 0
                }}>
                  <button 
                    onClick={() => setDemoView('form')}
                    className="demo-try-again-btn"
                  >
                    ← Volver al registro
                  </button>
                  <a href="/register" className="demo-register-btn">
                    Registrarse para ver tu progreso real
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}; 