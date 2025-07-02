import React, { useState, MouseEvent } from 'react';
import { Heart, Share2, User, Clock, Eye } from 'lucide-react';
import '../styles/ArticleCard.css';

export interface Article {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  readTime?: string;
  views?: number;
  author?: string;
  authorAvatar?: string;
  isLiked?: boolean;
  likes?: number;
}

interface ArticleCardProps {
  article: Article;
  onLike?: (id: string, liked: boolean) => void; // Cambiado de number a string
  onShare?: (article: Article) => void;
  onClick?: (article: Article) => void;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onLike, onShare, onClick, className = "" }) => {
  const [isLiked, setIsLiked] = useState(article.isLiked || false);

  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(article.id, !isLiked); // Ya es string, no necesita conversión
  };

  const handleShare = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onShare?.(article);
  };

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ];

  // Función para convertir string a número para el índice del gradiente
  const getGradientIndex = (str: string): number => {
    return Math.abs(str.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % gradients.length;
  };

  const gradientIndex = article.category
    ? getGradientIndex(article.category)
    : getGradientIndex(article.id);

  return (
    <div
      className={`article-card ${className}`}
      onClick={() => onClick?.(article)}
      style={{ ['--gradient' as keyof React.CSSProperties]: gradients[gradientIndex] }}
    >
      {/* Imagen */}
      <div className="card-image-container">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="card-image"
          />
        ) : (
          <div className="card-image-placeholder">
            <User size={32} />
          </div>
        )}

        {article.category && (
          <div className="card-category">
            {article.category}
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
        <h3 className="card-title">{article.title}</h3>

        {article.description && (
          <p className="card-description">
            {article.description}
          </p>
        )}

        <div className="card-meta">
          {article.readTime && (
            <span className="meta-item">
              <Clock size={12} />
              {article.readTime}
            </span>
          )}
          {article.views && (
            <span className="meta-item">
              <Eye size={12} />
              {article.views}
            </span>
          )}
        </div>

        <div className="card-footer">
          <div className="author-info-card">
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="author-avatar"
              />
            ) : (
              <div className="author-avatar-placeholder">
                <User size={16} />
              </div>
            )}
            <span className="author-name">{article.author || 'Anónimo'}</span>
          </div>

          <div className="like-count">
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{article.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;