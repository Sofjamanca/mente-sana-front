export type TeenResource = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  readTime: string;
  content: string[];
};

export const TEEN_RESOURCES: TeenResource[] = [
  {
    id: 1,
    title: "Estado de ánimo en la adolescencia: entender tus cambios sin culparte",
    description:
      "Una guía clara para entender por qué tu ánimo cambia, cómo leer esas variaciones y qué hacer cuando te sientes en bajada.",
    category: "Estado de ánimo",
    author: "Equipo MenteSana",
    readTime: "10 min",
    content: [
      "Si sientes que un día te levantas con energía y al siguiente estás agotado o sensible, no estás roto. En la adolescencia el estado de ánimo cambia bastante porque hay muchos ajustes al mismo tiempo: cuerpo, identidad, amistades, estudios, expectativas y decisiones.",
      "El estado de ánimo no es una prueba de tu valor personal. Sentirte mal un día no significa que seas débil, inmaduro o dramático. Significa que eres humano y que tu sistema emocional está reaccionando a lo que vives.",
      "Conviene separar dos preguntas: qué siento ahora y qué me viene pasando esta semana. La primera te ayuda a regular el momento. La segunda te ayuda a detectar patrones reales.",
      "Un patrón común es notar que cuando duermes poco te irritas más, te cuesta concentrarte y todo se siente más difícil. Otro patrón frecuente es que después de una pelea o de compararte mucho en redes, baja tu energía y sube la inseguridad.",
      "Registrar tu ánimo durante 7 a 14 días puede ayudarte mucho. Puedes anotar del 1 al 10 cómo te sentiste, cuánto dormiste, si comiste bien, si hubo conflictos y qué hiciste para cuidarte. No hace falta escribir una novela: tres líneas por día alcanzan.",
      "Cuando llega un bajón, no esperes motivación perfecta para actuar. Haz una acción corta y concreta: tomar agua, ducharte, salir 10 minutos al sol, ordenar un espacio pequeño o mandar un mensaje a alguien de confianza.",
      "Un error común es interpretar todo en modo extremo: 'si hoy me siento mal, entonces todo está mal'. Intenta frases más precisas: 'hoy estoy saturado, necesito bajar revoluciones y volver a lo básico'. Ese lenguaje reduce el dramatismo y mejora tus decisiones.",
      "También ayuda cuidar lo que consumes. Si pasas horas viendo contenido que te compara, te asusta o te deja peor, es lógico que tu ánimo se resienta. Filtrar contenido no es evitar la realidad, es proteger tu cabeza.",
      "Si notas tristeza intensa, irritabilidad muy alta o vacío casi todos los días durante semanas, y eso afecta estudio, sueño o relaciones, no lo minimices. Pedir ayuda profesional no significa que exageras; significa que te estás tomando en serio.",
      "Tu ánimo no tiene que ser perfecto para que puedas avanzar. La meta realista es aprender a entenderte mejor, cuidarte antes del colapso y construir una base estable que te sostenga incluso en días complicados.",
    ],
  },
  {
    id: 2,
    title: "Cuidado de la salud mental: hábitos realistas para semanas exigentes",
    description:
      "Cómo cuidarte de forma práctica cuando tienes clases, tareas, presión social y poco tiempo.",
    category: "Cuidado mental",
    author: "Equipo MenteSana",
    readTime: "11 min",
    content: [
      "Cuidar tu salud mental no es hacer todo perfecto. Es sostener hábitos pequeños que te ayudan a no llegar al límite. En semanas exigentes, lo útil no es un plan ideal, sino un plan posible.",
      "Empieza por una base de cuatro pilares: sueño, comida, movimiento y descanso mental. No son consejos vacíos. Si alguno falla por muchos días, el ánimo y la ansiedad suelen empeorar.",
      "Sueño: intenta una hora de dormir más o menos estable. No siempre podrás, pero cuanto más constante seas, mejor regula tu cerebro emociones, memoria y foco.",
      "Comida: saltarte comidas o vivir a café y ultraprocesados puede aumentar irritabilidad y cansancio. Busca regularidad, agua y algo nutritivo al menos en dos momentos del día.",
      "Movimiento: no necesitas gimnasio diario. Caminar, bailar, estirar o subir escaleras 15 a 25 minutos ya ayuda a descargar tensión y mejorar claridad mental.",
      "Descanso mental: si pasas del estudio directo al celular por horas, tu cabeza no descansa de verdad. Introduce pausas sin pantalla, aunque sean cortas.",
      "Poner límites también es autocuidado. Decir 'hoy no puedo' a veces evita que termines saturado y luego desaparezcas de todo. Límite sano no es egoísmo; es responsabilidad emocional.",
      "Háblate como le hablas a un amigo. Cuando fallas en algo, cambia 'soy un desastre' por 'hoy me salió mal, pero puedo corregirlo'. El diálogo interno agresivo desgasta más de lo que ayuda.",
      "Ten un kit de emergencia para días malos: playlist que te calme, una lista de 3 personas a quienes escribir, una actividad corta que te centre y una frase ancla. Prepararlo antes te ahorra energía cuando estás saturado.",
      "Si una semana está muy pesada, reduce metas. Mejor cumplir dos hábitos mínimos durante siete días que intentar diez cambios en 48 horas y abandonar todo.",
      "Cuidarte no te quita problemas, pero mejora tu capacidad para enfrentarlos. Esa diferencia es enorme: cuando estás regulado, decides mejor, pides ayuda antes y te recuperas más rápido.",
    ],
  },
  {
    id: 3,
    title: "Aprendizaje sobre salud mental: lo básico que todos deberíamos saber",
    description:
      "Conceptos clave para distinguir mitos de hechos y tomar decisiones con más criterio.",
    category: "Aprendizaje",
    author: "Equipo MenteSana",
    readTime: "10 min",
    content: [
      "Aprender sobre salud mental no es solo para psicólogos. Es una herramienta para la vida diaria. Cuando entiendes qué te pasa, dejas de pelearte contigo y empiezas a actuar con más estrategia.",
      "Primer punto clave: sentir emociones intensas no significa automáticamente tener un trastorno. Una reacción fuerte puede ser normal según lo que estás viviendo. Lo importante es mirar duración, intensidad y cuánto interfiere en tu rutina.",
      "Segundo punto: no todo consejo viral sirve. En redes hay contenido útil, pero también hay simplificaciones y etiquetas sin contexto. Si un video te diagnostica en 30 segundos, desconfía.",
      "Tercer punto: la salud mental existe en un continuo. No es 'estar bien' o 'estar mal' solamente. Puedes funcionar en algunas áreas y estar muy cargado en otras.",
      "Cuarto punto: pedir ayuda temprano suele funcionar mejor que esperar a tocar fondo. Muchas personas creen que deben aguantar hasta no poder más, y eso retrasa mejoras que podrían empezar antes.",
      "Quinto punto: cuerpo y mente no van separados. Dolor de cabeza, cansancio extremo, taquicardia o problemas de sueño pueden estar conectados con estrés sostenido. Mirar la foto completa ayuda más que culparte.",
      "Para aprender bien, busca fuentes confiables: universidades, hospitales, organizaciones de salud y profesionales con formación clara. Valora contenidos que expliquen límites y no prometan curas mágicas.",
      "También aprende lenguaje práctico: diferencia entre emoción, ánimo, estrés, ansiedad y burnout. Cuanto más preciso eres para nombrar lo que te pasa, más fácil es pedir la ayuda correcta.",
      "Hablar de salud mental no te hace frágil. Te hace más capaz de identificar riesgos, regularte y acompañar mejor a otros.",
      "Objetivo final: no convertirte en experto teórico, sino tener criterios útiles para cuidarte, detectar señales de alerta y tomar decisiones más inteligentes cuando la cabeza se complica.",
    ],
  },
  {
    id: 4,
    title: "Diferencia entre emoción y ánimo: una clave para entenderte mejor",
    description:
      "Aprende a distinguir lo que sientes en el momento de lo que te acompaña durante días.",
    category: "Educación emocional",
    author: "Equipo MenteSana",
    readTime: "9 min",
    content: [
      "Muchas veces decimos 'estoy mal' y no sabemos si hablamos de una emoción puntual o de un ánimo sostenido. Distinguir eso cambia completamente la forma de cuidarte.",
      "La emoción suele ser breve y responde a un disparador concreto: alegría por un logro, enojo por una injusticia, miedo antes de exponerte, tristeza por una decepción.",
      "El ánimo, en cambio, es más estable y dura más tiempo. Es como el clima de fondo de tus días: puedes sentirte apagado, esperanzado, irritado o tranquilo durante horas o semanas.",
      "Ejemplo simple: te peleas con alguien y aparece enojo intenso. Eso es emoción. Si después pasas varios días sensible, sin ganas y con pensamientos negativos, eso ya habla de ánimo.",
      "Por qué importa esta diferencia: porque cada una pide estrategias distintas. Para emociones intensas sirve regular el momento: respirar, pausar, moverte, no responder impulsivamente.",
      "Para ánimo sostenido hace falta mirar hábitos y contexto: sueño, rutina, presión académica, conflictos pendientes, aislamiento, uso de pantallas y apoyo social.",
      "Otro error común es invalidar emociones: 'no debería sentir esto'. Las emociones no se eliminan por orden. Se reconocen, se nombran y se encauzan.",
      "Una técnica práctica es preguntar: qué pasó justo antes y desde cuándo me siento así. Si encuentras un evento puntual, probablemente sea emoción. Si no hay un disparador claro y llevas días igual, revisa ánimo y factores de fondo.",
      "También puedes usar escala doble: emoción actual del 1 al 10 y ánimo de la semana del 1 al 10. Esa comparación te da más información que un único número suelto.",
      "Entender emoción y ánimo no es teoría abstracta. Es una herramienta para no reaccionar en automático, cuidar mejor tu energía y pedir ayuda con más claridad.",
    ],
  },
  {
    id: 5,
    title: "Dudas comunes sobre salud mental en adolescentes: respuestas directas",
    description:
      "Respuestas claras a preguntas frecuentes sobre pedir ayuda, terapia, medicación y cómo hablar con adultos.",
    category: "Preguntas frecuentes",
    author: "Equipo MenteSana",
    readTime: "12 min",
    content: [
      "Pregunta 1: si pido ayuda, ¿significa que soy débil? Respuesta: no. Pedir ayuda es una habilidad de autocuidado. Aguantar en silencio hasta explotar no es fortaleza, es desgaste.",
      "Pregunta 2: la terapia es solo para casos graves. Respuesta: falso. Muchas personas van para entenderse mejor, ordenar pensamientos, mejorar relaciones o aprender herramientas antes de que el malestar crezca.",
      "Pregunta 3: ¿y si no sé explicar lo que me pasa? Respuesta: no necesitas tener todo claro para empezar. Puedes decir 'me siento sobrepasado hace semanas y no sé cómo manejarlo'. Con eso alcanza para abrir la conversación.",
      "Pregunta 4: me van a juzgar en terapia. Respuesta: un espacio terapéutico serio trabaja sin juicio. Si no te sientes cómodo con un profesional, puedes cambiar. Encontrar buen encaje también es parte del proceso.",
      "Pregunta 5: la medicación cambia quién soy. Respuesta: en algunos casos puede ayudar a estabilizar síntomas, siempre bajo evaluación profesional. No es para todos ni reemplaza hábitos, pero tampoco es un fracaso personal.",
      "Pregunta 6: no quiero preocupar a mi familia. Respuesta: ocultarlo suele aumentar el problema. Puedes hablar con frases simples y concretas: qué te pasa, desde cuándo y qué apoyo necesitas.",
      "Pregunta 7: ¿y si en mi casa no me toman en serio? Respuesta: busca otro adulto de confianza: docente, tutor, referente deportivo, familiar cercano o equipo de orientación. No te quedes sin red por una sola respuesta negativa.",
      "Pregunta 8: ¿cómo ayudo a un amigo que la pasa mal? Respuesta: escucha sin minimizar, evita frases como 'no es para tanto', invita a pedir ayuda y, si hay riesgo, avisa a un adulto responsable.",
      "Pregunta 9: ¿cuándo es urgente pedir ayuda? Respuesta: cuando hay ideas de hacerte daño, desesperación extrema, consumo riesgoso, ataques de pánico repetidos o incapacidad para sostener rutinas básicas.",
      "Pregunta 10: ¿puedo mejorar de verdad? Respuesta: sí. Mejorar no siempre es lineal, pero con apoyo, herramientas y constancia la mayoría de personas logra más estabilidad y bienestar real.",
      "Quédate con esto: tu malestar importa incluso si otros lo minimizan. Tienes derecho a pedir ayuda, a ser escuchado y a construir una forma de vivir que no sea sobrevivir todo el tiempo.",
    ],
  },
  {
    id: 6,
    title: "Ansiedad en adolescentes: guía completa para momentos de crisis",
    description:
      "Qué es la ansiedad, cómo se siente en el cuerpo y la mente, y qué pasos concretos seguir cuando sube fuerte.",
    category: "Ansiedad",
    author: "Equipo MenteSana",
    readTime: "12 min",
    content: [
      "La ansiedad es una respuesta de alarma del cuerpo. El problema aparece cuando esa alarma se activa demasiado seguido o demasiado fuerte en situaciones que no son un peligro real inmediato.",
      "Puede sentirse como palpitaciones, respiración corta, opresión en el pecho, nudo en el estómago, mareo, sudor, tensión muscular o pensamientos catastróficos.",
      "Cuando aparece, muchas personas creen que se van a descontrolar o que algo terrible va a pasar ya. Esa interpretación aumenta el miedo y retroalimenta el ciclo ansioso.",
      "Primer paso: nombra lo que pasa. Decir 'esto es ansiedad' le baja poder a la confusión. No elimina la sensación al instante, pero te devuelve una cuota de control.",
      "Segundo paso: regula respiración sin forzar. Inhala lento por nariz, exhala más largo por boca. Repite varios ciclos. La exhalación prolongada ayuda a bajar activación fisiológica.",
      "Tercer paso: vuelve al presente con anclajes sensoriales. Nombra cosas que ves, tocas y escuchas. Tu objetivo no es sentirte perfecto, sino salir del modo amenaza total.",
      "Cuarto paso: suelta tensión corporal. Afloja mandíbula, baja hombros, abre manos, estira cuello. El cuerpo envía información al cerebro; si aflojas postura, disminuye la señal de peligro.",
      "Quinto paso: usa una frase corta y realista, por ejemplo: 'esto es intenso pero temporal', 'ya pasé por esto antes', 'puedo atravesarlo paso a paso'.",
      "Fuera de la crisis, trabaja prevención: sueño más estable, menos cafeína, menos sobrecarga de pantallas, pausas de estudio, movimiento físico y conversaciones de apoyo.",
      "Evitar todo lo que da ansiedad puede aliviar al principio, pero a largo plazo la ansiedad crece. Lo sano suele ser exposición gradual y acompañada, no evitación total.",
      "Busca ayuda profesional si hay crisis frecuentes, si dejas actividades importantes por miedo, si tu sueño se altera mucho o si la ansiedad te hace sentir sin salida.",
      "No tienes que ganarle a la ansiedad por fuerza bruta. Puedes aprender a entenderla, regularla y vivir con más libertad. Ese proceso lleva práctica, pero funciona.",
    ],
  },
];
