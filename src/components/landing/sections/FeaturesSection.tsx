import { HeartIcon, CommunityIcon, ToolsIcon } from '../icons';

interface FeaturesSectionProps {
  theme: 'light' | 'dark';
}

export const FeaturesSection = ({ theme }: FeaturesSectionProps) => {
  return (
    <section className={`landing-features-section ${theme}`} id="funcionalidades">
      <div className="landing-features-content">
        <h2 className={`landing-features-title ${theme}`}>
          ¿Qué te ofrece Mente Sana?
        </h2>
        
        <div className="landing-features-grid">
          <div className={`landing-feature-card ${theme}`}>
            <div className="landing-feature-icon">
              <HeartIcon className="w-16 h-16" />
            </div>
            <h3 className={`landing-feature-title ${theme}`}>
              Seguimiento Emocional con IA
            </h3>
            <p className={`landing-feature-description ${theme}`}>
              Registra tu estado de ánimo diario y recibe respuestas personalizadas 
              generadas por inteligencia artificial que te ayudarán a entender tus emociones.
            </p>
          </div>
          
          <div className={`landing-feature-card ${theme}`}>
            <div className="landing-feature-icon">
              <CommunityIcon className="w-16 h-16" />
            </div>
            <h3 className={`landing-feature-title ${theme}`}>
              Contenido para Adolescentes
            </h3>
            <p className={`landing-feature-description ${theme}`}>
              Accede a blogs especializados en salud mental escritos específicamente 
              para adolescentes, con temas relevantes para tu etapa de vida.
            </p>
          </div>
          
          <div className={`landing-feature-card ${theme}`}>
            <div className="landing-feature-icon">
              <ToolsIcon className="w-16 h-16" />
            </div>
            <h3 className={`landing-feature-title ${theme}`}>
              Eventos de Bienestar
            </h3>
            <p className={`landing-feature-description ${theme}`}>
              Mantente informado sobre eventos, talleres y actividades relacionadas 
              con salud mental en tu comunidad y participa en iniciativas de bienestar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 