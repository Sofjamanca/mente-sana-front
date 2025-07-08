import { SparkleIcon, HeartIcon, MindIcon } from '../icons';

interface HowItWorksSectionProps {
  theme: 'light' | 'dark';
}

export const HowItWorksSection = ({ theme }: HowItWorksSectionProps) => {
  return (
    <section className={`landing-how-it-works-section ${theme}`} id="como-funciona">
      <div className="landing-how-it-works-content">
        <h2 className={`landing-how-it-works-title ${theme}`}>
          Así funciona Mente Sana
        </h2>
        
        <div className="landing-steps-grid">
          <div className={`landing-step-card ${theme}`}>
            <div className="step-number">1</div>
            <div className="step-icon">
              <SparkleIcon className="w-12 h-12" />
            </div>
            <h3 className={`step-title ${theme}`}>Regístrate</h3>
            <p className={`step-description ${theme}`}>
              Crea tu cuenta personal en minutos y accede a tu panel 
              privado donde podrás gestionar tu bienestar emocional.
            </p>
          </div>
          
          <div className={`landing-step-card ${theme}`}>
            <div className="step-number">2</div>
            <div className="step-icon">
              <HeartIcon className="w-12 h-12" />
            </div>
            <h3 className={`step-title ${theme}`}>Comparte tu Estado</h3>
            <p className={`step-description ${theme}`}>
              Registra diariamente cómo te sientes y describe qué emociones 
              experimentaste durante el día en tu espacio personal.
            </p>
          </div>
          
          <div className={`landing-step-card ${theme}`}>
            <div className="step-number">3</div>
            <div className="step-icon">
              <MindIcon className="w-12 h-12" />
            </div>
            <h3 className={`step-title ${theme}`}>Recibe Apoyo IA</h3>
            <p className={`step-description ${theme}`}>
              Obtén respuestas personalizadas generadas por IA que te ayudarán 
              a comprender y manejar mejor tus emociones cada día.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 