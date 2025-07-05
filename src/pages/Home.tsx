import "../styles/Home.css";
import BannerImage1 from "../assets/banner1.png";
import { useNavigate } from "react-router-dom";
import { MoodChart } from "../components/MoodChart";
import { useUser } from "../contexts/UserContext";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import PuzzleDinamico from "../components/PuzzleDinamico";

interface HomeProps {
  theme: "dark" | "light";
}

const Home = ({ theme }: HomeProps) => {
  const navigate = useNavigate();
  const { isAdmin, userProfile } = useUser();

  const handleClick = () => {
    navigate("/daily-summary");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <div className={`home ${theme}`}>
      {/* Banner principal con imagen */}
      <div className="main-banner">
        <img src={BannerImage1} alt="Bienestar" className="banner-image" />
      </div>

      {/* Sección especial para admin */}
      {isAdmin && (
        <section className="admin-access">
          <div className="admin-content">
            <h3>¡Hola {userProfile?.name}! 👋</h3>
            <p>Tienes acceso al panel de administración</p>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={handleAdminClick}
              size="large"
              className="admin-button"
            >
              Ir al Panel de Administración
            </Button>
          </div>
        </section>
      )}

      {/* Sección hero mejorada */}
      <section className="hero">
        <div className="hero-content">
          <h1>Tu bienestar mental, nuestra prioridad</h1>
          <p>El éxito no es un destino, es un viaje, ¡disfrútalo!</p>
          <button className="cta-button" onClick={handleClick}>
            Explorar mi estado diario
          </button>
        </div>
      </section>

      {/* Sección de beneficios con MoodChart integrado */}
      <section className="benefits">
        <h2>
          ¿Por qué usar <span className="brand">Mente Sana</span>?
        </h2>
        
        <div className="benefits-container">
          <PuzzleDinamico/>
          <div className="mood-chart-container">
            <h3 className="chart-title">
              Tu progreso emocional
            </h3>
            <div className="chart-wrapper">
              <MoodChart />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;