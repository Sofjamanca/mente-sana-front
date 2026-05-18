import { BookOpen, ChevronRight, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PublicBlogNavbar from "../components/PublicBlogNavbar";
import { PARENT_TIPS } from "../data/parentTips";
import "../styles/Blogs.css";

const ParentGuides = () => {
  return (
    <div className="blogs-page">
      <PublicBlogNavbar />

      <section className="parents-guides">
        <header className="parents-guides__header">
          <span className="parents-guides__kicker">
            <ShieldCheck size={14} /> Para padres y tutores
          </span>
          <h1>Consejos para acompañar adolescentes con más claridad</h1>
          <p>
            Recursos prácticos para conversar mejor, detectar señales de alerta y saber cuándo pedir ayuda.
          </p>
          <Link className="parents-guides__cta" to="/blogs">
            Ver recursos para adolescentes <ChevronRight size={16} />
          </Link>
        </header>

        <div className="parents-guides__grid">
          {PARENT_TIPS.map((tip) => (
            <article key={tip.id} className="parents-tip-card">
              <span className="parents-tip-card__tag">
                <BookOpen size={12} /> {tip.category}
              </span>
              <h2>{tip.title}</h2>
              <p>{tip.summary}</p>
              <small>
                <Clock3 size={12} /> {tip.readTime}
              </small>
              <ul>
                {tip.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ParentGuides;
