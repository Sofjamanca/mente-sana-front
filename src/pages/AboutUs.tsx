import React, { useEffect, useState } from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <section 
        className="about-header"
        id="header"
        data-animate
      >
        <h1>¿Quiénes somos?</h1>
        <p>Mente Sana: un espacio para hablar, escuchar y cuidarnos.</p>
      </section>

      <section 
        className="about-content"
        id="content" 
        data-animate
      >
        <div className="about-image">
          <div className="image-wrapper">
            <img src="src/assets/SofiGian.jpg" alt="Sofi y Gian" />
            <div className="image-overlay"></div>
          </div>
        </div>
        <div className="about-text">
          <p className="text-paragraph">
            Somos <strong>Sofi y Gian</strong>, dos compañeros de la misma carrera universitaria que decidieron presentar un proyecto y hacer foco en algo tan importante como lo es la <strong>salud mental</strong>.
          </p>
          <p className="text-paragraph">
            Creemos firmemente que cuando uno pone <em>entusiasmo y vocación</em> en casos puntuales e importantes, puede realmente ayudar a otra persona. Y ese fue nuestro motor para crear esta plataforma.
          </p>
        </div>
      </section>

      <section 
        className="about-eureka"
        id="eureka"
        data-animate
      >
        <div className="eureka-image-wrapper">
          <img src="src/assets/eureka.jpeg" alt="Programa Eureka" />
        </div>
        <p>
          El proyecto <strong>Mente Sana</strong> fue financiado por <strong>Eureka</strong>, un programa que promueve la participación activa de jóvenes de entre 15 y 29 años a través de la creación de proyectos territoriales y grupales que generen oportunidades de desarrollo personal y colectivo.
        </p>
      </section>

      <section 
        className="about-mission"
        id="mission"
        data-animate
      >
        <h2>Nuestro compromiso</h2>
        <ul className="mission-list">
          <li className="mission-item">
            <span className="mission-icon">💝</span>
            Crear una comunidad empática y respetuosa
          </li>
          <li className="mission-item">
            <span className="mission-icon">🌸</span>
            Brindar herramientas y recursos confiables sobre salud mental
          </li>
          <li className="mission-item">
            <span className="mission-icon">🌟</span>
            Promover la participación juvenil en temas de bienestar
          </li>
          <li className="mission-item">
            <span className="mission-icon">💫</span>
            Difundir el valor del cuidado emocional como un derecho
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;