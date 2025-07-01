import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Clock, User, Tag, Calendar } from 'lucide-react';
import '../styles/BlogPost.css';

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  category?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string; 
  };
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (!res.ok) {
          throw new Error('Post no encontrado');
        }
        const data: Post = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Error al cargar el post:', error);
        setError('No se pudo cargar el artículo');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
  };

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-container">
        <div className="error-message">
          <h2>¡Oops! Algo salió mal</h2>
          <p>{error || 'No se pudo encontrar el artículo'}</p>
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={20} />
            Volver al blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      {/* Header con botón de regreso */}
      <header className="blog-post-header">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={20} />
          Volver al blog
        </button>
      </header>

      {/* Imagen principal */}
      <div className="blog-post-image-container">
        <img 
          src={post.image || "https://via.placeholder.com/1200x600/f8d7da/721c24?text=Imagen+no+disponible"} 
          alt={post.title}
          className="blog-post-image"
        />
        <div className="image-overlay"></div>
      </div>

      {/* Contenido principal */}
      <main className="blog-post-content">
        {/* Metadatos */}
        <div className="blog-post-meta">
          <div className="meta-item">
            <Tag size={16} />
            <span>{post.category || 'General'}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{getReadingTime(post.content)} min de lectura</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="blog-post-title">{post.title}</h1>

        {/* Información del autor */}
        <div className="author-info">
          <div className="author-avatar">
            <User size={24} />
          </div>
          <div className="author-details">
            <span className="author-name">{post.author.name}</span>
            <span className="author-role">Especialista en Salud Mental</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="post-actions">
          <button 
            onClick={handleLike} 
            className={`action-button like-button ${isLiked ? 'liked' : ''}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{isLiked ? 'Te gusta' : 'Me gusta'}</span>
          </button>
          <button onClick={handleShare} className="action-button share-button">
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
        </div>

        {/* Contenido del artículo */}
        <article className="blog-post-body">
          <div className="content-wrapper">
            {post.content.split('\n\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => {
              // Si el párrafo contiene asteriscos, es un título o encabezado
              if (paragraph.includes('**') && paragraph.includes('**')) {
                const cleanTitle = paragraph.replace(/\*\*/g, '');
                return (
                  <h3 key={index} className="content-subtitle">
                    {cleanTitle}
                  </h3>
                );
              }
              
              // Si el párrafo empieza con "-", es una lista
              if (paragraph.trim().startsWith('-')) {
                const listItems = paragraph.split('\n').filter(item => item.trim().startsWith('-'));
                return (
                  <ul key={index} className="content-list">
                    {listItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="content-list-item">
                        {item.replace(/^-\s*/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              
              // Párrafo normal
              return (
                <p key={index} className="content-paragraph">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        {/* Pie del artículo */}
        <footer className="blog-post-footer">
          <div className="footer-divider"></div>
          <p className="footer-text">
            ¿Te gustó este artículo? Compártelo con alguien que pueda beneficiarse de esta información.
          </p>
          <div className="footer-actions">
            <button onClick={handleShare} className="footer-share-button">
              Compartir artículo
            </button>
            <button onClick={handleBack} className="footer-back-button">
              Ver más artículos
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default BlogPost;