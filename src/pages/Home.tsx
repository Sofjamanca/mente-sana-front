import "../styles/Home.css";
import BannerImage from "../assets/banner.png";
import { useNavigate } from "react-router-dom";
import { MoodChart } from "../components/MoodChart";
import { useUser } from "../contexts/UserContext";
import { Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";


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
      {/* Sección especial para admin */}
      {isAdmin && (
        <section className="admin-access" style={{
          backgroundColor: theme === 'dark' ? '#1f1f1f' : '#f0f9ff',
          border: `1px solid ${theme === 'dark' ? '#303030' : '#e0f2fe'}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: theme === 'dark' ? '#1890ff' : '#0066cc',
            marginBottom: '8px'
          }}>
            ¡Hola {userProfile?.name}! 👋
          </h3>
          <p style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '16px'
          }}>
            Tienes acceso al panel de administración
          </p>
          <Button 
            type="primary" 
            icon={<SettingOutlined />}
            onClick={handleAdminClick}
            size="large"
          >
            Ir al Panel de Administración
          </Button>
        </section>
      )}

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
              <MoodChart />
      </section>
    </div>
  );
};

export default Home;
