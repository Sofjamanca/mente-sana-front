import React, { useState, MouseEvent } from 'react';
import { Heart, Share2, User, Calendar, MapPin } from 'lucide-react';
import '../styles/EventCard.css';

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  authorId?: string;
  isLiked?: boolean;
  likes?: number;
}

interface EventCardProps {
  event: Event;
  onLike?: (id: string, liked: boolean) => void;
  onShare?: (event: Event) => void;
  onClick?: (event: Event) => void;
  className?: string;
  isPastEvent?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onLike, 
  onShare, 
  onClick, 
  className = "", 
  isPastEvent = false 
}) => {
  const [isLiked, setIsLiked] = useState(event.isLiked || false);

  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(event.id, !isLiked);
  };

  const handleShare = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onShare?.(event);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  ];

  const gradientIndex = event.title
    ? Math.abs(event.title.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % gradients.length
    : parseInt(event.id) % gradients.length;

  return (
    <div
      className={`event-card ${className} ${isPastEvent ? 'past-event' : ''}`}
      onClick={() => onClick?.(event)}
      style={{ ['--gradient' as keyof React.CSSProperties]: gradients[gradientIndex] }}
    >
      {/* Imagen */}
      <div className="card-image-container">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="card-image"
          />
        ) : (
          <div className="card-image-placeholder">
            <Calendar size={32} />
          </div>
        )}

        {isPastEvent && (
          <div className="card-status past">
            Evento Pasado
          </div>
        )}

        <div className="card-actions">
          <button
            onClick={handleLike}
            className={`action-btn ${isLiked ? 'liked' : ''}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="action-btn"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="card-content">
        <h3 className="card-title">{event.title}</h3>

        {event.description && (
          <p className="card-description">
            {event.description.length > 80
              ? `${event.description.slice(0, 80)}...`
              : event.description
            }
          </p>
        )}

        <div className="card-meta">
          <span className="meta-item date">
            <Calendar size={14} />
            <div className="date-info">
              <div className="date-main">{formatDate(event.date)}</div>
              <div className="time-main">{formatTime(event.date)}</div>
            </div>
          </span>
          {event.location && (
            <span className="meta-item location">
              <MapPin size={14} />
              <span>{event.location}</span>
            </span>
          )}
        </div>

        <div className="card-footer">
          <div className="author-info">
            <div className="author-avatar-placeholder">
              <User size={16} />
            </div>
            <span className="author-name">
              {event.author?.name || 'Organizador'}
            </span>
          </div>

          <div className="like-count">
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{event.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 