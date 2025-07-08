export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  isLiked: boolean;
  likes: number;
}

// Datos de eventos destacados para la landing
export const featuredEvents: Event[] = [
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