import { useMemo, useState } from "react";
import { AlertTriangle, Globe, Phone, Search } from "lucide-react";
import "../styles/Contact.css";

type ContactType = "emergency" | "professional" | "online";

type ContactItem = {
  id: number;
  type: ContactType;
  name: string;
  description: string;
  value: string;
  address?: string;
  url?: string;
};

const ITEMS: ContactItem[] = [
  { id: 1, type: "emergency", name: "Linea de Prevencion del Suicidio", description: "Atencion nacional 24 hs", value: "135" },
  { id: 2, type: "emergency", name: "Centro de Asistencia al Suicida", description: "Contencion telefonica", value: "011 5275-1135" },
  { id: 3, type: "emergency", name: "Telefono de la Esperanza", description: "Acompañamiento emocional", value: "011 4785-0028" },
  { id: 4, type: "professional", name: "Hospital de Emergencias Psiquiatricas", description: "Guardia especializada", value: "011 4305-0851", address: "Av. Warnes 2630, CABA" },
  { id: 5, type: "professional", name: "Centro de Salud Mental N°1", description: "Atencion ambulatoria", value: "011 4863-8888", address: "Cordoba 3120, CABA" },
  { id: 6, type: "professional", name: "Fundacion FOBIA", description: "Trastornos de ansiedad", value: "011 4785-7200" },
  { id: 7, type: "online", name: "Proyecto Suma", description: "Plataforma de bienestar mental juvenil", value: "proyectosuma.org.ar", url: "https://proyectosuma.org.ar/" },
  { id: 8, type: "online", name: "Red SANAR", description: "Recursos y herramientas de autoayuda", value: "ilomas.org.ar/red-sanar", url: "https://ilomas.org.ar/web/servicios/apostolados/red-sanar.html" },
  { id: 9, type: "online", name: "Hablemos de Todo", description: "Informacion sobre salud mental", value: "hablemosdetodo.injuv.gob.cl", url: "https://hablemosdetodo.injuv.gob.cl/" },
];

const call = (phone: string) => window.open(`tel:${phone}`, "_self");
const openWebsite = (url: string) => window.open(url, "_blank");

const Contacts = () => {
  const [filter, setFilter] = useState<"all" | ContactType>("all");
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((item) => {
      const typeOk = filter === "all" || item.type === filter;
      if (!typeOk) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        (item.address ?? "").toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <div className="contacts-v2">
      <header className="contacts-v2__header">
        <div>
          <p className="contacts-v2__kicker">Directorio de ayuda</p>
          <h1>Contactos utiles</h1>
        </div>
        <div className="contacts-v2__alert">
          <AlertTriangle size={16} />
          <span>Si hay riesgo inmediato: 135 o 911</span>
        </div>
      </header>

      <section className="contacts-v2__toolbar">
        <label className="contacts-v2__search">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, telefono, direccion..."
          />
        </label>
        <div className="contacts-v2__tabs">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Todos</button>
          <button className={filter === "emergency" ? "active" : ""} onClick={() => setFilter("emergency")}>Emergencia</button>
          <button className={filter === "professional" ? "active" : ""} onClick={() => setFilter("professional")}>Profesional</button>
          <button className={filter === "online" ? "active" : ""} onClick={() => setFilter("online")}>Online</button>
        </div>
      </section>

      <section className="contacts-v2__list">
        {visibleItems.map((item) => (
          <article key={item.id} className={`contacts-v2__row ${item.type}`}>
            <div className="contacts-v2__main">
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              {item.address && <small>{item.address}</small>}
            </div>
            <div className={`contacts-v2__value ${item.type === "online" ? "link" : ""}`}>{item.value}</div>
            <div className="contacts-v2__actions">
              {item.type === "online" ? (
                <button onClick={() => item.url && openWebsite(item.url)}>
                  <Globe size={14} /> Abrir
                </button>
              ) : (
                <button onClick={() => call(item.value)}>
                  <Phone size={14} /> Llamar
                </button>
              )}
            </div>
          </article>
        ))}
        {visibleItems.length === 0 && (
          <div className="contacts-v2__empty">No hay resultados para ese filtro.</div>
        )}
      </section>
    </div>
  );
};

export default Contacts;

