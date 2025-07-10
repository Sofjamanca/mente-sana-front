import { useState, useEffect } from 'react';
import { SparkleIcon, MindIcon, FloatingHeart } from '../icons';
//import mainIcon from '../../../assets/main-icon.png';
//import { ParticleBackground } from './ParticleBackground';

interface HeroSectionProps {
  theme: 'light' | 'dark';
}

export const HeroSection = ({ theme }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`landing-hero-section ${theme}`} id="inicio">
      <div className="floating-hearts">
        <FloatingHeart delay={0} size="💖" />
        <FloatingHeart delay={1} size="🌸" />
        <FloatingHeart delay={2} size="💝" />
        <FloatingHeart delay={3} size="🦋" />
        <FloatingHeart delay={4} size="✨" />
      </div>
      
      <div className={`landing-hero-content ${isVisible ? 'animate-in' : ''}`}>
        {/* Icono principal
        <div className="hero-icon-container">
          <ParticleBackground 
            particleCount={30}
            animationDuration={3}
            theme={theme}
          />
          <img 
            src={mainIcon} 
            alt="MenteSana Icon" 
            className="hero-main-icon"
          />
        </div>
         */}
        
        <h1 className={`landing-hero-title ${theme}`}>
          Tu compañero digital <span className="landing-hero-title-highlight">para el bienestar emocional</span>
        </h1>
        
        <p className={`landing-hero-subtitle ${theme}`}>
          Una plataforma diseñada especialmente para adolescentes donde puedes registrar 
          diariamente cómo te sientes y recibir respuestas personalizadas con inteligencia artificial. 
          Además, accede a blogs especializados y eventos de salud mental adaptados a tu edad.
        </p>
        
        <div className="landing-cta-buttons">
          <a href="/register" className={`cta-button primary-cta ${theme}`}>
            <SparkleIcon className="w-5 h-5" />
            Registrate Gratis
          </a>
          <a href="/about-us-guest" className={`cta-button secondary-cta ${theme}`}>
            <MindIcon className="w-5 h-5" />
            Conocer Más
          </a>
        </div>
      </div>
    </section>
  );
}; 