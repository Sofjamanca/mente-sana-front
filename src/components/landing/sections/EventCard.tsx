import { MapPin, Clock, User } from 'lucide-react';
import { Event } from '../data';

interface EventCardProps {
  event: Event;
  theme: 'light' | 'dark';
  animationDelay?: number;
}

export const EventCard = ({ event, theme, animationDelay = 0 }: EventCardProps) => {
  return (
    <div 
      className={`landing-event-card ${theme}`} 
      style={{ animationDelay: `${animationDelay * 0.2}s` }}
    >
      <div className="event-image-container">
        <img src={event.image} alt={event.title} className="event-image" />
        <div className="event-date-badge">
          {new Date(event.date).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short' 
          })}
        </div>
      </div>
      
      <div className="event-content">
        <h3 className={`event-title ${theme}`}>{event.title}</h3>
        <p className={`event-description ${theme}`}>
          {event.description.substring(0, 120)}...
        </p>
        
        <div className="event-details">
          <div className="event-location">
            <MapPin className="location-icon" size={16} />
            <span className={`location-text ${theme}`}>{event.location}</span>
          </div>
          <div className="event-time">
            <Clock className="time-icon" size={16} />
            <span className={`time-text ${theme}`}>
              {new Date(event.date).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
        
        <div className="event-author">
          <User className="author-icon" size={16} />
          <span className={`author-name ${theme}`}>{event.author.name}</span>
        </div>
      </div>
    </div>
  );
}; 