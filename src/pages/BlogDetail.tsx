import { ArrowLeft, BookOpen, Clock3 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TEEN_RESOURCES } from "../data/teenResources";
import PublicBlogNavbar from "../components/PublicBlogNavbar";
import "../styles/Blogs.css";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const contentContainer = document.querySelector(".layout-container .main-content");
    if (contentContainer instanceof HTMLElement) {
      contentContainer.scrollTop = 0;
    }

    const pageContainer = document.querySelector(".layout-container .page-content");
    if (pageContainer instanceof HTMLElement) {
      pageContainer.scrollTop = 0;
    }
  }, [id]);

  const article = useMemo(() => {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return undefined;
    }
    return TEEN_RESOURCES.find((item) => item.id === numericId);
  }, [id]);

  if (!article) {
    return (
      <div className="blogs-page">
        <PublicBlogNavbar />
        <div className="blog-detail">
          <button type="button" className="blog-detail__back" onClick={() => navigate("/blogs")}>
            <ArrowLeft size={16} /> Volver a recursos
          </button>
          <article className="blog-detail__article">
            <h1>Articulo no encontrado</h1>
            <p>Este recurso no existe o fue removido.</p>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <PublicBlogNavbar />
      <div className="blog-detail">
        <button type="button" className="blog-detail__back" onClick={() => navigate("/blogs")}>
          <ArrowLeft size={16} /> Volver a recursos
        </button>

        <article className="blog-detail__article">
          <header className="blog-detail__header">
            <span className="blog-detail__category">
              <BookOpen size={12} /> {article.category}
            </span>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <div className="blog-detail__meta">
              <span>{article.author}</span>
              <span>
                <Clock3 size={12} /> {article.readTime}
              </span>
            </div>
          </header>

          <img
            className="blog-detail__cover"
            src={`https://picsum.photos/seed/mente-cover-${article.id}/1400/560`}
            alt={article.title}
          />

          <section className="blog-detail__body">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
