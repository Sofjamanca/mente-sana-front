import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { AuthPublicShell } from "../components/AuthPublicShell";
import "../styles/Login.css";

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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("userName", data.user.name || "Usuario");
        localStorage.setItem("userRole", data.user.role || "user");
      }

      const userRole = data.user?.role || data.role;
      if (String(userRole).toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Error de conexion:", err);
      setError("Error de conexion con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPublicShell headerCta={{ href: "/register", label: "Crear cuenta" }} layout="login">
      <section className="auth-panel auth-panel--login">
        <span className="lp-hero__eyebrow">
          <Sparkles size={14} strokeWidth={2.2} aria-hidden />
          Bienvenida de nuevo
        </span>
        <h1>
          Volvé a tu <em>espacio</em>
        </h1>
        <p className="auth-subtitle">Iniciá sesión para seguir con tu registro emocional y tus herramientas.</p>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="lp-btn lp-btn--primary" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿No tenés cuenta?{" "}
          <button type="button" className="auth-link-btn" onClick={() => navigate("/register")}>
            Registrate
          </button>
        </p>
      </section>
    </AuthPublicShell>
  );
};

export default Login;
