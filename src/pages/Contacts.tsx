import { useState, useEffect } from 'react';
import '../styles/Contact.css';

const Contacts = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

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

  const emergencyContacts = [
    {
      id: 1,
      name: "Línea de Prevención del Suicidio",
      phone: "135",
      description: "Línea gratuita nacional, 24hs",
      type: "emergency",
      icon: "🆘"
    },
    {
      id: 2,
      name: "Centro de Asistencia al Suicida",
      phone: "011 5275-1135",
      description: "Buenos Aires, atención telefónica",
      type: "emergency",
      icon: "📞"
    },
    {
      id: 3,
      name: "Teléfono de la Esperanza",
      phone: "011 4785-0028",
      description: "Contención emocional, 24hs",
      type: "emergency",
      icon: "💛"
    }
  ];

  const professionalServices = [
    {
      id: 4,
      name: "Hospital de Emergencias Psiquiátricas",
      phone: "011 4305-0851",
      address: "Av. Warnes 2630, CABA",
      description: "Atención de urgencias psiquiátricas",
      type: "professional",
      icon: "🏥"
    },
    {
      id: 5,
      name: "Centro de Salud Mental Nº1",
      phone: "011 4863-8888",
      address: "Córdoba 3120, CABA",
      description: "Atención ambulatoria gratuita",
      type: "professional",
      icon: "🩺"
    },
    {
      id: 6,
      name: "Fundación FOBIA",
      phone: "011 4785-7200",
      description: "Especialistas en trastornos de ansiedad",
      type: "professional",
      icon: "🧠"
    }
  ];

const onlineResources = [
  {
    id: 7,
    name: "Proyecto Suma",
    website: "https://proyectosuma.org.ar/",
    description: "Plataforma de bienestar mental juvenil",
    type: "online",
    icon: "💻"
  },
  {
    id: 8,
    name: "Red SANAR",
    website: "https://ilomas.org.ar/web/servicios/apostolados/red-sanar.html",
    description: "Recursos y herramientas de autoayuda",
    type: "online",
    icon: "🌐"
  },
  {
    id: 9,
    name: "Hablemos de Todo",
    website: "https://hablemosdetodo.injuv.gob.cl/",
    description: "Información sobre salud mental",
    type: "online",
    icon: "📱"
  }
];


  const handleCardClick = (contactId: number) => {
    setActiveCard(activeCard === contactId ? null : contactId);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

 const handleWebsite = (website: string) => {
  window.open(website, '_blank');
};


  return (
    <div className="contacts-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <section className={`contacts-header ${isVisible.header ? 'animate-in' : ''}`} id="header" data-animate>
        <h1>Recursos de Ayuda</h1>
        <p>Siempre hay alguien dispuesto a escucharte. No estás solo/a.</p>
        <div className="header-alert">
          <span className="alert-icon">⚠️</span>
          <strong>Si estás en crisis, llama al 135 inmediatamente</strong>
        </div>
      </section>

      <section className="contacts-section emergency-section" id="emergency" data-animate>
        <h2>
          <span className="section-icon">🚨</span>
          Líneas de Emergencia
        </h2>
        <div className="contacts-grid">
          {emergencyContacts.map((contact) => (
            <div 
              key={contact.id}
              className={`contact-card emergency-card ${activeCard === contact.id ? 'active' : ''}`}
              onClick={() => handleCardClick(contact.id)}
            >
              <div className="card-header">
                <span className="contact-icon">{contact.icon}</span>
                <h3>{contact.name}</h3>
              </div>
              <div className="card-content">
                <div className="phone-number">{contact.phone}</div>
                <p className="contact-description">{contact.description}</p>
                <button 
                  className="call-button emergency-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(contact.phone);
                  }}
                >
                  📞 Llamar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contacts-section professional-section" id="professional" data-animate>
        <h2>
          <span className="section-icon">👩‍⚕️</span>
          Servicios Profesionales
        </h2>
        <div className="contacts-grid">
          {professionalServices.map((contact) => (
            <div 
              key={contact.id}
              className={`contact-card professional-card ${activeCard === contact.id ? 'active' : ''}`}
              onClick={() => handleCardClick(contact.id)}
            >
              <div className="card-header">
                <span className="contact-icon">{contact.icon}</span>
                <h3>{contact.name}</h3>
              </div>
              <div className="card-content">
                <div className="phone-number">{contact.phone}</div>
                {contact.address && (
                  <div className="contact-address">📍 {contact.address}</div>
                )}
                <p className="contact-description">{contact.description}</p>
                <button 
                  className="call-button professional-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(contact.phone);
                  }}
                >
                  📞 Contactar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contacts-section online-section" id="online" data-animate>
        <h2>
          <span className="section-icon">🌐</span>
          Recursos Online
        </h2>
        <div className="contacts-grid">
          {onlineResources.map((contact) => (
            <div 
              key={contact.id}
              className={`contact-card online-card ${activeCard === contact.id ? 'active' : ''}`}
              onClick={() => handleCardClick(contact.id)}
            >
              <div className="card-header">
                <span className="contact-icon">{contact.icon}</span>
                <h3>{contact.name}</h3>
              </div>
              <div className="card-content">
                <div className="website-url">{contact.website}</div>
                <p className="contact-description">{contact.description}</p>
                <button 
                  className="call-button online-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWebsite(contact.website); 
                  }}
                >
                  🌐 Visitar Sitio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contacts-info" id="info" data-animate>
        <div className="info-content">
          <h2>Información Importante</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🕐 ¿Cuándo buscar ayuda?</h3>
              <ul>
                <li>Pensamientos recurrentes de autolesión</li>
                <li>Sentimientos de desesperanza persistentes</li>
                <li>Cambios drásticos en el comportamiento</li>
                <li>Aislamiento social extremo</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>💝 Cómo ayudar a alguien</h3>
              <ul>
                <li>Escucha sin juzgar</li>
                <li>Ofrece tu apoyo constante</li>
                <li>Sugiere buscar ayuda profesional</li>
                <li>Mantente en contacto regular</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>🌟 Recursos gratuitos</h3>
              <ul>
                <li>Hospitales públicos con guardia psiquiátrica</li>
                <li>Centros de salud mental barriales</li>
                <li>Líneas telefónicas de contención</li>
                <li>Grupos de apoyo comunitarios</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="emergency-footer">
        <div className="emergency-reminder">
          <h3>🆘 Recordatorio importante</h3>
          <p>Si tú o alguien que conoces está en peligro inmediato, no dudes en llamar al <strong>911</strong> o dirigirte al hospital más cercano.</p>
        </div>
      </div>
    </div>
  );
};

export default Contacts;