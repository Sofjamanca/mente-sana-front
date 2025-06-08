import "../styles/Home.css";
import BannerImage from "../assets/banner.png";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  theme: "dark" | "light";
}

const Home = ({ theme }: HomeProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/daily-summary");
  };

  return (
    <div className={`home ${theme}`}>
      <section className="hero">
        <div className="hero-content">
          <h1>Tu bienestar mental, nuestra prioridad</h1>
          <p>El éxito no es un destino, es un viaje, ¡disfrútalo!</p>
          <button className="cta-button" onClick={handleClick}>
            Explorar Resúmenes
          </button>
        </div>
        <img src={BannerImage} alt="Bienestar" className="hero-image" />
      </section>

      <section className="benefits">
        <h2>
          ¿Por qué usar <span className="brand">Mente Sana</span>?
        </h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <img src="src/assets/Facil.png" alt="Fácil de usar" />
            <h3>Fácil de usar</h3>
            <p>Lleva el control de tus emociones de manera intuitiva.</p>
          </div>
          <div className="benefit-item">
            <img src="src/assets/Eventos.jpg" alt="Eventos únicos" />
            <h3>Eventos únicos</h3>
            <p>Participa en actividades que mejoran tu bienestar.</p>
          </div>
          <div className="benefit-item">
            <img src="src/assets/Resumen.png" alt="Resumen diario" />
            <h3>Resumen diario</h3>
            <p>Realiza un seguimiento constante de tu progreso.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
