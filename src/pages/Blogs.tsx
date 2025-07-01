import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleCard from "../components/ArticleCard";
import "../styles/Blogs.css"
import type { Article }  from "../components/ArticleCard";

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

const Page = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) throw new Error("Error al obtener los posts");
        const data: Post[] = await res.json();

        const articlesData: Article[] = data.map((post) => ({
          id: post.id,
          title: post.title,
          description: post.content.slice(0, 100) + "...",
          category: post.category || "General",
          author: post.author.name,
          isLiked: false,
          image: post.image || "https://via.placeholder.com/600x400?text=Sin+imagen"
        }));

        setArticles(articlesData);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchArticles();
  }, []);

  const handleLike = (id: number, liked: boolean) => {
    console.log("Artículo like toggled:", id, liked);
  };

  const handleShare = (article: Article) => {
    console.log("Compartir artículo:", article);
  };

  // Función actualizada para navegar al post individual
  const handleClick = (article: Article) => {
    navigate(`/blogs/${article.id}`);
  };

  if (loading) return <p>Cargando artículos...</p>;

  return (
    <div className="blog-grid">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
          onLike={handleLike}
          onShare={handleShare}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default Page;