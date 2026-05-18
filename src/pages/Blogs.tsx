import { useMemo, useState } from "react";
import { BookOpen, Clock3, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Blogs.css";
import { TEEN_RESOURCES } from "../data/teenResources";
import PublicBlogNavbar from "../components/PublicBlogNavbar";

type BlogItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  readTime: string;
};

const BLOGS: BlogItem[] = TEEN_RESOURCES.map((resource) => ({
  id: resource.id,
  title: resource.title,
  description: resource.description,
  category: resource.category,
  author: resource.author,
  readTime: resource.readTime,
}));

const Blogs = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const base = Array.from(new Set(BLOGS.map((item) => item.category)));
    return ["all", ...base];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOGS.filter((item) => {
      const categoryOk = category === "all" || item.category === category;
      if (!categoryOk) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="blogs-page">
      <PublicBlogNavbar />
      <div className="blogs-v2">
        <header className="blogs-v2__header">
          <div>
            <p className="blogs-v2__kicker">Recursos</p>
            <h1>Biblioteca de bienestar</h1>
          </div>
        </header>

        <section className="blogs-v2__toolbar">
          <label className="blogs-v2__search">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por tema, titulo o autor..."
            />
          </label>
          <div className="blogs-v2__tabs">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item === "all" ? "Todos" : item}
              </button>
            ))}
          </div>
        </section>

        <section className="blogs-v2__grid">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="blogs-v2__card"
              onClick={() => navigate(`/blogs/${item.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/blogs/${item.id}`);
                }
              }}
            >
              <img
                src={`https://picsum.photos/seed/mente-${item.id}/900/500`}
                alt={item.title}
              />
              <div className="blogs-v2__content">
                <span className="blogs-v2__category">
                  <BookOpen size={12} />
                  {item.category}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <footer>
                  <span>{item.author}</span>
                  <span><Clock3 size={12} /> {item.readTime}</span>
                </footer>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="blogs-v2__empty">No hay resultados para esa búsqueda.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blogs;
