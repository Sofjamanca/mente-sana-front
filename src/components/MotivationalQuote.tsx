import { useMemo } from "react";

const MOTIVATIONAL_QUOTES: { text: string; author: string }[] = [
  {
    text: "Cada día es una nueva oportunidad para cuidar tu mente. Pequeños pasos llevan a grandes cambios.",
    author: "MenteSana",
  },
  {
    text: "Tu racha de días registrados es un testimonio de tu compromiso contigo mismo. ¡Seguí así!",
    author: "MenteSana",
  },
  {
    text: "La salud mental se construye día a día. Cada registro es un paso hacia tu bienestar.",
    author: "MenteSana",
  },
  {
    text: "No hay prisa en el camino del autocuidado. Lo importante es que sigas caminando.",
    author: "MenteSana",
  },
  {
    text: "Tu mente es como un jardín: necesita atención diaria para florecer. ¡Cuidá tu bienestar cada día!",
    author: "MenteSana",
  },
  {
    text: "Cada emoción que registrás es válida. No hay sentimientos correctos o incorrectos.",
    author: "MenteSana",
  },
  {
    text: "La consistencia es más poderosa que la perfección. Un día a la vez construye una vida saludable.",
    author: "MenteSana",
  },
  {
    text: "Tu bienestar mental es una inversión, no un gasto. Cada día que te registrás es una inversión en vos.",
    author: "MenteSana",
  },
  {
    text: "Recordá: sos más fuerte de lo que creés. Cada día que continuás es una prueba de tu fortaleza.",
    author: "MenteSana",
  },
  {
    text: "La salud mental es un viaje, no un destino. Disfrutá el proceso de conocerte cada día.",
    author: "MenteSana",
  },
];

const MotivationalQuote = () => {
  const quote = useMemo(() => {
    const i = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[i];
  }, []);

  return (
    <div className="home-quote-panel" role="figure" aria-label="Frase motivacional">
      <blockquote className="home-quote-panel__text">&ldquo;{quote.text}&rdquo;</blockquote>
      <cite className="home-quote-panel__cite">— {quote.author}</cite>
    </div>
  );
};

export default MotivationalQuote;
