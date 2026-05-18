export type ParentTip = {
  id: number;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  bullets: string[];
};

export const PARENT_TIPS: ParentTip[] = [
  {
    id: 1,
    title: "Cómo abrir conversaciones sin que se cierre",
    summary: "Frases y estrategias para hablar con adolescentes sin invadir ni juzgar.",
    category: "Comunicación",
    readTime: "6 min",
    bullets: [
      "Empiece por observaciones concretas, no por etiquetas: 'te noto más callado esta semana' funciona mejor que 'estás raro'.",
      "Haga una pregunta abierta y corta: '¿querés hablar ahora o más tarde?'.",
      "Valide antes de aconsejar: 'entiendo que te esté pesando'.",
      "Evite el interrogatorio largo; priorice una charla breve y frecuente.",
      "Cierre con disponibilidad: 'estoy para ayudarte cuando quieras'.",
    ],
  },
  {
    id: 2,
    title: "Señales de alerta: qué mirar sin entrar en pánico",
    summary: "Cambios que conviene observar y cómo actuar con criterio.",
    category: "Prevención",
    readTime: "7 min",
    bullets: [
      "Observe cambios mantenidos en sueño, apetito, energía o aislamiento social.",
      "Diferencie un mal día de un patrón de varias semanas.",
      "Si hay irritabilidad intensa o tristeza frecuente, abra conversación sin culpar.",
      "Ante señales de riesgo, pida evaluación profesional temprana.",
      "No minimice frases de desesperanza o daño; tome acción y acompañamiento adulto.",
    ],
  },
  {
    id: 3,
    title: "Ansiedad adolescente: primeros auxilios en casa",
    summary: "Qué hacer durante un pico de ansiedad y qué evitar.",
    category: "Ansiedad",
    readTime: "6 min",
    bullets: [
      "Mantenga tono calmo y frases cortas: 'estoy acá con vos'.",
      "Guíe respiración lenta y exhalación larga, sin exigir 'calmate'.",
      "Ayude a anclar en el presente: nombrar objetos, sonidos y contacto corporal.",
      "Evite discutir lógica en el pico; primero regule, después converse.",
      "Si las crisis se repiten, coordine seguimiento profesional.",
    ],
  },
  {
    id: 4,
    title: "Límites sanos: firmeza sin ruptura del vínculo",
    summary: "Cómo sostener normas claras manteniendo respeto mutuo.",
    category: "Crianza",
    readTime: "5 min",
    bullets: [
      "Defina pocas reglas importantes y explique el porqué.",
      "Negocie lo negociable y sostenga lo no negociable con consistencia.",
      "Evite castigos humillantes; use consecuencias proporcionadas y claras.",
      "Diferencie conducta de identidad: corrija acciones, no etiquete a la persona.",
      "Reconozca avances pequeños para reforzar cooperación.",
    ],
  },
  {
    id: 5,
    title: "Pantallas y salud mental: acuerdos que sí funcionan",
    summary: "Reglas realistas para redes, sueño y convivencia digital.",
    category: "Hábitos digitales",
    readTime: "6 min",
    bullets: [
      "Construya acuerdos en familia, no solo prohibiciones unilaterales.",
      "Proteja horario de sueño sin pantallas al menos 45 minutos antes de dormir.",
      "Converse sobre comparación social y presión en redes.",
      "Promueva pausas y actividades fuera de pantalla durante la semana.",
      "Revise periódicamente los acuerdos y ajuste según edad y madurez.",
    ],
  },
  {
    id: 6,
    title: "Cuándo y cómo pedir ayuda profesional",
    summary: "Criterios prácticos para decidir consulta y acompañar el proceso.",
    category: "Apoyo profesional",
    readTime: "7 min",
    bullets: [
      "Consulte si el malestar afecta estudio, vínculos o rutinas durante semanas.",
      "Explique que pedir ayuda no es castigo, es cuidado.",
      "Involucre al adolescente en la elección del profesional cuando sea posible.",
      "Mantenga expectativas realistas: el cambio suele ser gradual.",
      "Sostenga coordinación entre familia, escuela y equipo tratante si aplica.",
    ],
  },
];
