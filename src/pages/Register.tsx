import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import "../styles/Registrer.css";
import Navbar from "../components/Navbar";

// Interfaces para los datos de la API Georef
interface Province {
  id: string;
  nombre: string;
}

interface Locality {
  id: string;
  nombre: string;
}

interface GeografResponse {
  provincias?: Province[];
  localidades?: Locality[];
}

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

 
  // Cargar provincias
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=24");
        if (response.ok) {
          const data: GeografResponse = await response.json();
          if (data.provincias) {
            setProvinces(data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)));
          }
        } else {
          console.error("Error al cargar provincias");
        }
      } catch (error) {
        console.error("Error de conexión al cargar provincias:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);


  // Cargar localidades cuando se selecciona una provincia
  useEffect(() => {
    if (selectedProvince) {
      const fetchLocalities = async () => {
        setLoadingLocalities(true);
        setSelectedLocality(""); // Limpiar localidad seleccionada
        try {
          const response = await fetch(
            `https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvince}&campos=id,nombre&max=500`
          );
          if (response.ok) {
            const data: GeografResponse = await response.json();
            if (data.localidades) {
              setLocalities(data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre)));
            }
          } else {
            console.error("Error al cargar localidades");
            setLocalities([]);
          }
        } catch (error) {
          console.error("Error de conexión al cargar localidades:", error);
          setLocalities([]);
        } finally {
          setLoadingLocalities(false);
        }
      };

      fetchLocalities();
    } else {
      setLocalities([]);
      setSelectedLocality("");
    }
  }, [selectedProvince]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones adicionales
    if (!birthDate) {
      setError("La fecha de nacimiento es obligatoria");
      setLoading(false);
      return;
    }

    if (!selectedProvince) {
      setError("Debes seleccionar una provincia");
      setLoading(false);
      return;
    }

    if (!selectedLocality) {
      setError("Debes seleccionar una localidad");
      setLoading(false);
      return;
    }

    // Validar que la fecha de nacimiento no sea futura
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    if (birthDateObj > today) {
      setError("La fecha de nacimiento no puede ser futura");
      setLoading(false);
      return;
    }

    // Validar edad mínima (13 años)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 13);
    if (birthDateObj > minDate) {
      setError("Debes tener al menos 13 años para registrarte");
      setLoading(false);
      return;
    }

    try {
      // Obtener nombres de provincia y localidad para enviar a la API
      const provinceName = provinces.find(p => p.id === selectedProvince)?.nombre || "";
      const localityName = localities.find(l => l.id === selectedLocality)?.nombre || "";

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          birthDate,
          province: provinceName,
          locality: localityName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);
        
        // Redirigir al dashboard o página principal
        navigate("/home");
      } else {
        // Manejar errores del servidor
        setError(data.message || "Error al registrarse");
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
    <div className="register-container">
      <div className="register-box">
        <h2>¡Regístrate!</h2>
        <p className="subtitle">Crea una cuenta para continuar</p>
        <form onSubmit={handleRegister}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-columns">
            <div className="form-column-left">
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
            
            </div>

            <div className="form-column-right">
              <div className="input-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                  required
                />
              </div>

              <div className="input-group">
                <label>Provincia</label>
                <Select
                  showSearch
                  value={selectedProvince || undefined}
                  onChange={(value) => setSelectedProvince(value || "")}
                  placeholder={loadingProvinces ? "Cargando provincias..." : "Selecciona o busca una provincia"}
                  disabled={loadingProvinces}
                  loading={loadingProvinces}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%', height: '45px' }}
                  size="large"
                  allowClear
                  options={provinces.map((province) => ({
                    value: province.id,
                    label: province.nombre,
                  }))}
                />
              </div>

              <div className="input-group">
                <label>Localidad</label>
                <Select
                  showSearch
                  value={selectedLocality || undefined}
                  onChange={(value) => setSelectedLocality(value || "")}
                  placeholder={
                    loadingLocalities 
                      ? "Cargando localidades..." 
                      : !selectedProvince 
                        ? "Primero selecciona una provincia"
                        : "Selecciona o busca una localidad"
                  }
                  disabled={loadingLocalities || !selectedProvince}
                  loading={loadingLocalities}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%', height: '45px' }}
                  size="large"
                  allowClear
                  options={localities.map((locality) => ({
                    value: locality.id,
                    label: locality.nombre,
                  }))}
                />
              </div>

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </button>
            </div>
          </div>
        </form>
        <p className="login-text">
          ¿Ya tienes una cuenta?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;