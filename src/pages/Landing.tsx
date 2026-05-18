import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  Users,
  Heart,
  BookOpen,
} from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import "../styles/Landing.css";

const asset = (name: string) => `/landing/${name}`;
const elemento = (name: string) => `/elementos/${name}`;

const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "recursos", label: "Recursos" },
  { id: "para-padres", label: "Para padres" },
  { id: "nosotros", label: "Sobre nosotros" },
];

const pillars = [
  {
    img: "heart.png",
    label: "Registro emocional",
    copy: "Entendé lo que sentís y hacé seguimiento.",
    tone: "pink",
  },
  {
    img: "badge.png",
    label: "IA que acompaña",
    copy: "Mensajes personalizados que te entienden.",
    tone: "purple",
  },
  {
    img: "learn.png",
    label: "Guías prácticas",
    copy: "Herramientas para tu día a día.",
    tone: "coral",
  },
  {
    img: "calendar.png",
    label: "Resumen semanal",
    copy: "Tu progreso, claro y útil cada semana.",
    tone: "mint",
  },
];

const steps = [
  {
    num: "01",
    icon: Heart,
    title: "Registrá lo que sentís",
    copy: "Un check-in breve con tus emociones del día. Sin presión, sin obligación.",
    tone: "pink",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Recibí una respuesta empática",
    copy: "Mentesana lee lo que escribís y te responde con calma, sin juicios.",
    tone: "purple",
  },
  {
    num: "03",
    icon: BookOpen,
    title: "Mirá tu progreso con claridad",
    copy: "Cada semana te mostramos cómo viniste sintiéndote, sin tecnicismos.",
    tone: "coral",
  },
];

const resources = [
  {
    title: "Ansiedad",
    copy: "Estrategias para calmar tu mente y bajar la preocupación.",
    image: "mascota2.png",
    tone: "purple",
  },
  {
    title: "Estado de ánimo",
    copy: "Entendé tus altibajos y mejorá el día a día.",
    image: "mascota_coral.png",
    tone: "coral",
  },
  {
    title: "Rutinas sanas",
    copy: "Pequeños hábitos que hacen una gran diferencia.",
    image: "mascota_explorar.png",
    tone: "mint",
  },
];

const reasons = [
  {
    sticker: "secure.png",
    title: "Privacidad ante todo",
    copy: "Tu información está protegida. Vos decidís qué compartir y con quién.",
    tone: "purple",
  },
  {
    sticker: "badge.png",
    title: "IA que acompaña",
    copy: "Te escucha y responde con empatía, cuando la necesitás.",
    tone: "pink",
  },
  {
    sticker: "discover.png",
    title: "Basado en evidencia",
    copy: "Técnicas alineadas con buenas prácticas en salud mental.",
    tone: "mint",
  },
  {
    sticker: "badge_smile.png",
    title: "Lenguaje cercano",
    copy: "Claro, respetuoso, sin juicios. Pensado para adolescentes.",
    tone: "coral",
  },
];

const parentCards = [
  {
    icon: MessageCircle,
    title: "Consejos para conversar",
    copy: "Ideas para abrir charlas y fortalecer el vínculo.",
    bullets: ["Cómo iniciar sin presionar", "Escucha activa y validación", "Qué decir y qué evitar"],
    image: "mascotas_grupo.png",
  },
  {
    icon: Target,
    title: "Señales a observar",
    copy: "Cambios importantes y cuándo conviene pedir ayuda profesional.",
    bullets: ["Cambios de ánimo", "Aislamiento o irritabilidad", "Sueño, apetito y energía"],
    image: "mascota_explorar.png",
  },
];

const testimonials = [
  {
    quote:
      "Por fin tengo un lugar donde me escuchan sin juzgar. Me ayuda a entender lo que siento y a estar mejor.",
    name: "Lucas, 16",
    role: "Estudiante",
    image: "mascota2.png",
  },
  {
    quote: "Los ejercicios son simples y útiles. Siento que me dejan algo concreto para el día.",
    name: "Valentina, 15",
    role: "Estudiante",
    image: "mascota_coral.png",
  },
  {
    quote: "Me acompaña cuando lo necesito. Ya no me siento tan sola.",
    name: "Mateo, 17",
    role: "Estudiante",
    image: "mascota_explorar.png",
  },
];

const faqs = [
  {
    icon: LockKeyhole,
    question: "¿Mis datos están seguros?",
    answer: "Sí. Usamos encriptación y buenas prácticas de seguridad. No vendemos tus datos.",
  },
  {
    icon: Heart,
    question: "¿Mentesana reemplaza la terapia?",
    answer: "No. Es un apoyo al día a día; no sustituye el trabajo con un profesional de salud mental.",
  },
  {
    icon: Users,
    question: "¿Desde qué edad?",
    answer: "Pensada a partir de los 13 años, con contenido acorde a la edad.",
  },
  {
    icon: Sparkles,
    question: "¿Qué incluye el resumen semanal?",
    answer: "Un resumen breve de tu ánimo, patrones y sugerencias para la semana.",
  },
];

const scrollToSection = (sectionId: string) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Landing = () => {
  return (
    <main className="lp">
      <div className="lp-frame">
      <header className="lp-header">
        <div className="lp-header__inner">
          <BrandLogo />
          <nav className="lp-nav" aria-label="Secciones">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === 0 ? "lp-nav__link lp-nav__link--active" : "lp-nav__link"}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <a className="lp-btn lp-btn--primary lp-btn--compact" href="/register">
            Empieza gratis
          </a>
        </div>
      </header>

      <section className="lp-hero" id="inicio">
        <div className="lp-hero__bg" aria-hidden="true">
          <span className="lp-hero__blob lp-hero__blob--pink" />
          <span className="lp-hero__blob lp-hero__blob--purple" />
        </div>

        <div className="lp-hero__inner">
        <div className="lp-hero__text">
          <span className="lp-hero__eyebrow">
            <Sparkles size={14} strokeWidth={2.2} aria-hidden />
            Bienestar emocional para adolescentes
          </span>
          <h1 className="lp-hero__title">
            Tu espacio para sentir, entender y <em>crecer</em>
          </h1>
          <p className="lp-lead">
            Registrá tus emociones, recibí mensajes personalizados con IA y accedé a herramientas para tu bienestar diario.
          </p>
          <div className="lp-hero__actions">
            <a className="lp-btn lp-btn--primary" href="/register">
              Empieza gratis
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </a>
            <button type="button" className="lp-btn lp-btn--secondary" onClick={() => scrollToSection("como-funciona")}>
              <Play size={16} strokeWidth={2} fill="currentColor" aria-hidden />
              Ver cómo funciona
            </button>
          </div>
          <div className="lp-hero__trust">
            <div className="lp-hero__avatars" aria-hidden="true">
              <img src={asset("mascota2.png")} alt="" />
              <img src={asset("mascota_coral.png")} alt="" />
              <img src={asset("mascota_explorar.png")} alt="" />
            </div>
            <div className="lp-hero__trust-text">
              <strong>Sin juicios, sin presión.</strong>
              <span>Una pausa cuando la necesites.</span>
            </div>
          </div>
        </div>

        <div className="lp-hero__visual" aria-hidden="true">
          <img className="lp-hero__visual-main" src={asset("landing_component4.png")} alt="" />
        </div>
        </div>
      </section>

      <section className="lp-strip" aria-label="Beneficios principales">
        <div className="lp-strip__bar">
          {pillars.map((pillar) => (
            <article key={pillar.label} className={`lp-strip__item lp-strip__item--${pillar.tone}`}>
              <img className="lp-strip__icon" src={elemento(pillar.img)} alt="" aria-hidden />
              <h2 className="lp-strip__title">{pillar.label}</h2>
              <p className="lp-strip__copy">{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section" id="como-funciona">
        <div className="lp-how">
          <aside className="lp-how__side">
           
            <h2 className="lp-h2 lp-h2--section">
              Cómo <em>funciona.</em>
            </h2>
            <p className="lp-body">
              Fácil y breve. En unos simples pasos registrás tus emociones.
            </p>
          </aside>

          <div className="lp-how__cards">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.num} className={`lp-how-card lp-how-card--${step.tone}`}>
                  <span className="lp-how-card__num" aria-hidden="true">{step.num}</span>
                  <span className="lp-how-card__icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <h3 className="lp-how-card__title">{step.title}</h3>
                  <p>{step.copy}</p>
                  <a className="lp-more" href="#producto">
                    Ver más <ChevronRight size={16} strokeWidth={2} aria-hidden />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--muted lp-section--producto" id="producto">
        <div className="lp-showcase">
          <div className="lp-showcase__copy">
            <span className="lp-eyebrow">
              <Sparkles size={14} strokeWidth={2.2} aria-hidden />
              Diseñado para vos
            </span>
            <h2 className="lp-h2 lp-h2--section">
              Hecho para <em>adolescentes,</em> pensado para acompañarte de verdad.
            </h2>
            <ul className="lp-checklist">
              <li>Privado y seguro: tus datos son tuyos.</li>
              <li>IA que te entiende sin juzgar.</li>
              <li>Herramientas basadas en evidencia.</li>
              <li>Diseño intuitivo, cuando lo necesitás.</li>
              <li>Diseñado junto a psicólogos y adolescentes.</li>
            </ul>
            <a className="lp-btn lp-btn--secondary lp-btn--compact lp-showcase__cta" href="/register">
              Probalo ahora <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
            </a>
          </div>

          <div className="lp-poster" aria-hidden="true">
            <img className="lp-poster__main" src={asset("landing_component5.png")} alt="" />
          </div>
        </div>
      </section>

      <section className="lp-section" id="recursos">
        <div className="lp-res-grid">
          <div className="lp-res-header">
           
            <h2 className="lp-h2 lp-h2--section">
              Recursos para <em>tu bienestar.</em>
            </h2>
            <p className="lp-body">
              Contenido breve, claro y útil, pensado para acompañarte en lo que estás viviendo.
            </p>
            <button
              type="button"
              className="lp-btn lp-btn--outline lp-btn--compact"
              onClick={() => scrollToSection("producto")}
            >
              Explorar todos <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </button>
          </div>
          {resources.map((resource) => (
            <article key={resource.title} className={`lp-res lp-res--${resource.tone}`}>
              <div className="lp-res__inner">
                <h3 className="lp-res__title">{resource.title}</h3>
                <p>{resource.copy}</p>
                <button type="button" className="lp-btn lp-btn--on-dark lp-btn--compact">
                  Ver recursos <ChevronRight size={14} strokeWidth={2.4} aria-hidden />
                </button>
              </div>
              <img src={asset(resource.image)} alt="" className="lp-res__img" />
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section lp-section--muted" id="nosotros">
        <div className="lp-testi-head lp-why-head">
          <div>
            <span className="lp-eyebrow">
              <Heart size={14} strokeWidth={2.2} aria-hidden />
              ¿Por qué Mentesana?
            </span>
            <h2 className="lp-h2 lp-h2--section">
              Un espacio <em>seguro</em>
              <br />e inteligente.
            </h2>
          </div>
        </div>
        <div className="lp-why-grid">
          {reasons.map((reason, idx) => (
            <article key={reason.title} className={`lp-why lp-why--${reason.tone}`}>
              <span className="lp-why__index" aria-hidden="true">
                0{idx + 1}
              </span>
              <img className="lp-why__sticker" src={elemento(reason.sticker)} alt="" aria-hidden="true" />
              <h3 className="lp-why__title">{reason.title}</h3>
              <p>{reason.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section" id="para-padres">
        <div className="lp-section__head lp-section__head--center">
          <span className="lp-eyebrow lp-eyebrow--coral" style={{ marginInline: "auto", display: "inline-flex" }}>
            <Users size={14} strokeWidth={2.2} aria-hidden />
            Para familias
          </span>
          <h2 className="lp-h2 lp-h2--section">
            Recursos para <em>padres y tutores.</em>
          </h2>
          <p className="lp-body lp-body--center">
            Acompañar también es aprender a escuchar. Herramientas para estar ahí sin invadir.
          </p>
        </div>
        <div className="lp-parent-grid">
          {parentCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="lp-parent-card">
                <div className="lp-parent-card__text">
                  <span className="lp-card__icon" aria-hidden="true">
                    <Icon size={24} strokeWidth={2} />
                  </span>
                  <h3 className="lp-h3">{card.title}</h3>
                  <p className="lp-body">{card.copy}</p>
                  <ul className="lp-bullets">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>
                        <CheckCircle2 size={18} strokeWidth={2} aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <a className="lp-btn lp-btn--secondary lp-btn--compact" href="/para-padres">
                    Ver consejos
                  </a>
                </div>
                <img src={asset(card.image)} alt="" className="lp-parent-card__img" />
              </article>
            );
          })}
        </div>
      </section>

      <section className="lp-section lp-section--muted">
        <div className="lp-testi-head">
          <div>
            
            <h2 className="lp-h2 lp-h2--section">
              Historias <em>reales.</em>
            </h2>
            <p className="lp-body">Palabras de quienes ya usan Mentesana cada día.</p>
          </div>
          
        </div>
        <div className="lp-quote-grid">
          {testimonials.map((t) => (
            <figure key={t.name} className="lp-quote-card">
              <span className="lp-quote-card__mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <img src={asset(t.image)} alt="" width={48} height={48} />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="lp-section lp-section--faq">
        <div className="lp-faq-grid">
          <aside className="lp-faq-side">
           
            <h2 className="lp-h2 lp-h2--section">
              Preguntas <em>frecuentes.</em>
            </h2>
            <p className="lp-body">
              Lo que más nos consultan sobre Mentesana, privacidad y cómo funciona el acompañamiento.
            </p>
            
          </aside>
          <div className="lp-faq">
            {faqs.map((faq) => {
              const Icon = faq.icon;
              return (
                <details key={faq.question} className="lp-faq__item">
                  <summary>
                    <span className="lp-faq__icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <span className="lp-faq__q">{faq.question}</span>
                  </summary>
                  <p className="lp-body">{faq.answer}</p>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-cta__inner">
          <img className="lp-cta__mascot" src={asset("mascota_cta.png")} alt="" />
          <div className="lp-cta__content">
            <h2 className="lp-h2 lp-h2--on-dark">
              No tenés que pasar por todo <em>solo/a.</em>
            </h2>
            <p className="lp-lead lp-lead--on-dark">
              Estamos para escucharte y acompañarte. El primer paso puede ser hoy.
            </p>
            <div className="lp-hero__actions">
              <a className="lp-btn lp-btn--primary" href="/register">
                Empieza gratis
              </a>
              <button type="button" className="lp-btn lp-btn--ghost-dark" onClick={() => scrollToSection("recursos")}>
                Conocer recursos
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer__grid">
          <div className="lp-footer__brand">
            <BrandLogo />
            <p>Tu espacio para sentir, entender y crecer.</p>
            
            <p className="lp-footer__copyright">© 2026 Mentesana · Hecho en Ceres, Santa Fe</p>
          </div>
          <div className="lp-footer__links">
            <div>
              <h3>Producto</h3>
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#recursos">Recursos</a>
              
            </div>
            <div>
              <h3>Comunidad</h3>
              <a href="/para-padres">Para padres</a>
              <a href="#recursos">Blog</a>
            </div>
            <div>
              <h3>Acerca de</h3>
              <a href="#nosotros">Nosotros</a>
            </div>
          </div>
         
        </div>
        <nav className="lp-footer__legal-row" aria-label="Legal">
          <a href="#">Privacidad</a>
          <span className="lp-footer__sep">·</span>
          <a href="#">Términos</a>
          <span className="lp-footer__sep">·</span>
          <a href="#">Seguridad</a>
          <span className="lp-footer__sep">·</span>
          <a href="#">Contacto</a>
          <span className="lp-footer__sep">·</span>
          <a href="#">Ayuda</a>
        </nav>
      </footer>
      </div>
    </main>
  );
};

export default Landing;

