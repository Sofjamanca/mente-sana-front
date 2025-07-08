import { Layout } from "antd";
import { HeartIcon } from "lucide-react";

const { Footer: AntFooter } = Layout;

interface FooterProps {
  theme: "dark" | "light";
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <AntFooter className={`footer ${theme}`}>
     <footer className={`landing-footer ${theme}`}>
        <div className="landing-footer-content">
          <div className="landing-footer-logo">
            <HeartIcon className="footer-logo-icon" />
            <span className="footer-logo-text">Mente Sana</span>
          </div>
          
          <p className="landing-footer-text">
            Diseñada especialmente para adolescentes que buscan entender y cuidar 
            su salud mental con el apoyo de tecnología inteligente y contenido especializado.
          </p>
          
          <div className="footer-copyright">
            <p>© 2024 Mente Sana. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </AntFooter>
  );
};

export default Footer;
