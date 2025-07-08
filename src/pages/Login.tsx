import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; 
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);
        
        // Guardar información del usuario incluyendo el rol
        if (data.user) {
          localStorage.setItem("userName", data.user.name || data.name || "Usuario");
          localStorage.setItem("userRole", data.user.role || data.role || "user");
        }
        
        // Redirigir según el rol del usuario
        const userRole = data.user?.role || data.role;
        if (userRole?.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // Manejar errores del servidor
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-box">
        <h2>¡Bienvenido!</h2>
        <p className="subtitle">Inicia sesión para continuar</p>
        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="register-text">
          ¿No tienes una cuenta?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
