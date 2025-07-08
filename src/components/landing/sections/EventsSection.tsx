import { featuredEvents } from '../data';
import { EventCard } from './EventCard';

interface EventsSectionProps {
  theme: 'light' | 'dark';
}

export const EventsSection = ({ theme }: EventsSectionProps) => {
  return (
    <section className={`landing-events-section ${theme}`} id="eventos">
      <div className="landing-events-content">
        <h2 className={`landing-events-title ${theme}`}>
          Próximos Eventos de Bienestar
        </h2>
        <p className={`landing-events-subtitle ${theme}`}>
          Únete a nuestros talleres y actividades diseñadas especialmente para adolescentes
        </p>
        
        <div className="landing-events-grid">
          {featuredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              theme={theme}
              animationDelay={index}
            />
          ))}
        </div>
        
        <div className="events-cta">
          <a href="/events" className="events-view-all-btn">
            Ver todos los eventos
          </a>
        </div>
      </div>
    </section>
  );
}; 