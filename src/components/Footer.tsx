import { Layout } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

interface FooterProps {
  theme: "dark" | "light";
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <AntFooter className={`footer ${theme}`}>
      <div>
        <p>&copy; 2025 Mente Sana. Todos los derechos reservados.</p>
        <p>Mejorando tu bienestar mental, un paso a la vez.</p>
      </div>
      <div className="social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FacebookOutlined />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <TwitterOutlined />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <InstagramOutlined />
        </a>
      </div>
    </AntFooter>
  );
};

export default Footer;
