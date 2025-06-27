import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EventCard from "../components/EventCard";
import type { Event } from "../components/EventCard";
import "../styles/Events.css";

// Datos de ejemplo (temporales hasta conectar con el backend)
const mockUpcomingEvents: Event[] = [
  {
    id: '1',
    title: "Taller de Mindfulness y Meditación",
    description: "Aprende técnicas de mindfulness para reducir el estrés y mejorar tu bienestar mental. Un espacio seguro para conectar contigo mismo.",
    date: "2024-02-15T18:00:00Z",
    location: "Centro de Bienestar Mente Sana, Salón Principal",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?fit=crop&w=600&h=400",
    author: {
      id: '1',
      name: 'Dra. Laura Pérez',
      email: 'laura.perez@mentesana.com'
    },
    isLiked: false,
    likes: 12
  },
  {
    id: '2',
    title: "Círculo de Apoyo: Ansiedad y Técnicas de Afrontamiento",
    description: "Un encuentro grupal para compartir experiencias y aprender estrategias efectivas para manejar la ansiedad en el día a día.",
    date: "2024-02-20T19:30:00Z",
    location: "Online - Zoom",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?fit=crop&w=600&h=400",
    author: {
      id: '2',
      name: 'Lic. Mateo Gómez',
      email: 'mateo.gomez@mentesana.com'
    },
    isLiked: false,
    likes: 8
  },
  {
    id: '3',
    title: "Charla: Construyendo Autoestima Saludable",
    description: "Descubre herramientas prácticas para fortalecer tu autoestima y desarrollar una relación más positiva contigo mismo.",
    date: "2024-02-25T17:00:00Z",
    location: "Auditorio Universidad del Bienestar",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?fit=crop&w=600&h=400",
    author: {
      id: '3',
      name: 'Psic. Camila Torres',
      email: 'camila.torres@mentesana.com'
    },
    isLiked: true,
    likes: 15
  }
];

const mockPastEvents: Event[] = [
  {
    id: '4',
    title: "Seminario: Gestión del Estrés en el Trabajo",
    description: "Un seminario completo sobre técnicas para manejar el estrés laboral y mantener un equilibrio vida-trabajo saludable.",
    date: "2024-01-10T16:00:00Z",
    location: "Centro Empresarial Plaza Norte",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?fit=crop&w=600&h=400",
    author: {
      id: '4',
      name: 'Dr. Javier Castillo',
      email: 'javier.castillo@mentesana.com'
    },
    isLiked: false,
    likes: 23
  },
  {
    id: '5',
    title: "Workshop: Comunicación Asertiva en Relaciones",
    description: "Aprendé a comunicarte de manera efectiva y saludable en tus relaciones personales y profesionales.",
    date: "2024-01-05T18:30:00Z",
    location: "Centro de Bienestar Mente Sana, Aula 2",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?fit=crop&w=600&h=400",
    author: {
      id: '5',
      name: 'Lic. Valentina Ruiz',
      email: 'valentina.ruiz@mentesana.com'
    },
    isLiked: false,
    likes: 18
  }
];

const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // manejar cambios de ruta
  useEffect(() => {
    const path = location.pathname;
    if (path === '/events/upcoming') {
      setActiveTab('upcoming');
    } else if (path === '/events/past') {
      setActiveTab('past');
    }
  }, [location.pathname]);

  useEffect(() => {
    // Simular carga de datos 
    const loadEvents = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUpcomingEvents(mockUpcomingEvents);
        setPastEvents(mockPastEvents);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleLike = (id: string, liked: boolean) => {
    const updateEvents = (events: Event[]) => 
      events.map(event => 
        event.id === id 
          ? { ...event, isLiked: liked, likes: (event.likes || 0) + (liked ? 1 : -1) }
          : event
      );

    if (activeTab === 'upcoming') {
      setUpcomingEvents(updateEvents);
    } else {
      setPastEvents(updateEvents);
    }
  };

  const handleShare = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleClick = (event: Event) => {
    console.log('Ver detalles del evento:', event);
  };

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="events-title">Eventos de Bienestar Mental</h1>
        <p className="events-subtitle">
          diseñados para fortalecer tu salud mental
        </p>
      </div>

      <div className="events-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('upcoming');
            navigate('/events/upcoming');
          }}
        >
          Próximos Eventos ({upcomingEvents.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('past');
            navigate('/events/past');
          }}
        >
          Eventos Pasados ({pastEvents.length})
        </button>
      </div>

      <div className="events-content">
        {loading ? (
          <div className="events-loading">
            <div className="loading-spinner"></div>
            <p>Cargando eventos...</p>
          </div>
        ) : currentEvents.length > 0 ? (
          <div className="events-grid">
            {currentEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onLike={handleLike}
                onShare={handleShare}
                onClick={handleClick}
                isPastEvent={activeTab === 'past'}
              />
            ))}
          </div>
        ) : (
          <div className="events-empty">
            <p>
              {activeTab === 'upcoming' 
                ? 'No hay eventos próximos programados en este momento.' 
                : 'No hay eventos pasados para mostrar.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
  