import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Registrer.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registrando:", name, email, password);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>¡Regístrate!</h2>
        <p className="subtitle">Crea una cuenta para continuar</p>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-btn">Registrarse</button>
        </form>
        <p className="login-text">
          ¿Ya tienes una cuenta?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
