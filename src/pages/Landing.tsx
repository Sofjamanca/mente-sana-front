import React, { useEffect, useState } from 'react';
import '../styles/Landing.css';

interface SvgIconProps {
  className?: string; 
}

const Landing = ({ theme = 'light' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    setIsVisible(true);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [theme]);

  const FloatingHeart = ({ delay = 0, size = '💖' }) => (
    <div 
      className="heart" 
      style={{ 
        animationDelay: `${delay}s`, 
        fontSize: Math.random() > 0.5 ? '1.5rem' : '1rem' 
      }}
    >
      {size}
    </div>
  );

  const HeartIcon = ({ className }: SvgIconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );

  const MindIcon = ({ className }: SvgIconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );

  const CommunityIcon = ({ className }: SvgIconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.001 2.001 0 0 0 18 7c-.8 0-1.54.37-2 1l-3 4v6h2v7h3v-7zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10.5s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2.5 16v-7H6V9.5C6 8.12 7.12 7 8.5 7S11 8.12 11 9.5V15H9v7H8z"/>
    </svg>
  );

  const ToolsIcon = ({ className }: SvgIconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
    </svg>
  );

  const SparkleIcon = ({ className }: SvgIconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0l3.09 6.26L22 9.27l-6.91 3.01L12 24l-3.09-6.26L2 14.73l6.91-3.01L12 0z"/>
    </svg>
  );

  return (
    <div className={`landing-container ${theme}`}>
      <nav className={`landing-navbar ${theme}`}>
        <div className="landing-navbar-logo">
          <HeartIcon className="landing-navbar-logo-icon" />
          <span className="landing-navbar-logo-text">Mente Sana</span>
        </div>
        <a href="/login" className="landing-login-button">
          Iniciar Sesión
        </a>
      </nav>

      <section className="landing-hero-section">
        <div className="floating-hearts">
          <FloatingHeart delay={0} size="💖" />
          <FloatingHeart delay={1} size="🌸" />
          <FloatingHeart delay={2} size="💝" />
          <FloatingHeart delay={3} size="🦋" />
          <FloatingHeart delay={4} size="✨" />
        </div>
        
        <div className="landing-hero-content">
          <h1 className={`landing-hero-title ${theme}`}>
            Tu bienestar mental es{' '}
            <span className="landing-hero-title-highlight">nuestra prioridad</span>
          </h1>
          
          <p className={`landing-hero-subtitle ${theme}`}>
            Descubre un espacio seguro donde puedes conectar con profesionales de la salud mental, 
            acceder a herramientas de autocuidado y encontrar la comunidad de apoyo que necesitas 
            para florecer emocionalmente.
          </p>
          
          <div className="landing-cta-buttons">
            <a href="/register" className="cta-button primary-cta">
              <SparkleIcon className="w-5 h-5" />
              Comenzar Ahora
            </a>
            <a href="/about-us-guest" className={`cta-button secondary-cta ${theme}`}>
              <MindIcon className="w-5 h-5" />
              Conocer Más
            </a>
          </div>
        </div>
      </section>

      <section className={`landing-features-section ${theme}`}>
        <div className="landing-features-content">
          <h2 className={`landing-features-title ${theme}`}>
            ¿Por qué elegir Mente Sana?
          </h2>
          
          <div className="landing-features-grid">
            <div className={`landing-feature-card ${theme}`}>
              <div className="landing-feature-icon">
                <HeartIcon className="w-16 h-16" />
              </div>
              <h3 className={`landing-feature-title ${theme}`}>
                Cuidado Personalizado
              </h3>
              <p className={`landing-feature-description ${theme}`}>
                Aprende a como conectar con cosas que te ayudan a mantenerte sano
              </p>
            </div>
            
            <div className={`landing-feature-card ${theme}`}>
              <div className="landing-feature-icon">
                <CommunityIcon className="w-16 h-16" />
              </div>
              <h3 className={`landing-feature-title ${theme}`}>
                Comunidad de Apoyo
              </h3>
              <p className={`landing-feature-description ${theme}`}>
                Únete a grupos de apoyo donde puedes compartir experiencias y encontrar 
                comprensión en un ambiente seguro y libre de juicios.
              </p>
            </div>
            
            <div className={`landing-feature-card ${theme}`}>
              <div className="landing-feature-icon">
                <ToolsIcon className="w-16 h-16" />
              </div>
              <h3 className={`landing-feature-title ${theme}`}>
                Herramientas de Bienestar
              </h3>
              <p className={`landing-feature-description ${theme}`}>
                Accede a meditaciones guiadas, ejercicios de mindfulness y recursos 
                de autocuidado diseñados para fortalecer tu salud mental diariamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`landing-how-it-works-section ${theme}`}>
        <div className="landing-how-it-works-content">
          <h2 className={`landing-how-it-works-title ${theme}`}>
            Comienza tu Viaje en 3 Pasos
          </h2>
          
          <div className="landing-steps-grid">
            <div className={`landing-step-card ${theme}`}>
              <div className="step-number">1</div>
              <div className="step-icon">
                <SparkleIcon className="w-12 h-12" />
              </div>
              <h3 className={`step-title ${theme}`}>Regístrate</h3>
              <p className={`step-description ${theme}`}>
                Crea tu perfil en minutos y cuéntanos sobre tus necesidades 
                y objetivos de bienestar mental.
              </p>
            </div>
            
            <div className={`landing-step-card ${theme}`}>
              <div className="step-number">2</div>
              <div className="step-icon">
                <HeartIcon className="w-12 h-12" />
              </div>
              <h3 className={`step-title ${theme}`}>Conecta</h3>
              <p className={`step-description ${theme}`}>
                Te invitamos a unirte a nuestra comunidad de apoyo.
              </p>
            </div>
            
            <div className={`landing-step-card ${theme}`}>
              <div className="step-number">3</div>
              <div className="step-icon">
                <MindIcon className="w-12 h-12" />
              </div>
              <h3 className={`step-title ${theme}`}>Florece</h3>
              <p className={`step-description ${theme}`}>
                Comienza tu camino hacia el bienestar con información 
                y herramientas de autocuidado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className={`landing-footer ${theme}`}>
        <div className="landing-footer-content">
          <div className="landing-footer-logo">
            <HeartIcon className="footer-logo-icon" />
            <span className="footer-logo-text">Mente Sana</span>
          </div>
          
          <p className="landing-footer-text">
            Tu bienestar mental es nuestro compromiso. Construyendo un mundo 
            donde todos puedan acceder a apoyo emocional de calidad.
          </p>
          
          <div className="footer-copyright">
            <p>© 2024 Mente Sana. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Landing;