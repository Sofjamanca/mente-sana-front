export interface MoodOption {
  emoji: string;
  description: string;
  color: string;
}

export interface MoodMap {
  [key: number]: MoodOption;
}

// Mapeo de valores a emojis y descripciones para el demo
export const moodMap: MoodMap = {
  1: { emoji: '😢', description: 'Muy triste', color: '#ff4757' },
  2: { emoji: '😔', description: 'Triste', color: '#ff6b7a' },
  3: { emoji: '😐', description: 'Regular', color: '#ffa502' },
  4: { emoji: '🙂', description: 'Bien', color: '#ffed4e' },
  5: { emoji: '😊', description: 'Muy bien', color: '#7bed9f' },
  6: { emoji: '😍', description: 'Fantástico', color: '#ff9ff3' },
  7: { emoji: '🥳', description: 'Increíble', color: '#54a0ff' },
};

export interface AIMessages {
  [key: number]: string;
}

// Mensajes de respuesta de IA según el estado de ánimo
export const aiMessages: AIMessages = {
  1: "Entiendo que hoy ha sido un día difícil. Recuerda que está bien sentirse triste a veces, es parte de ser humano. ¿Te gustaría intentar una técnica de respiración profunda?",
  2: "Veo que te sientes un poco desanimado/a. Los días grises también son importantes en nuestro crecimiento. ¿Qué pequeña cosa podrías hacer hoy para cuidarte?",
  3: "Un día regular también cuenta. No todos los días tienen que ser extraordinarios. ¿Hay algo que te gustaría mejorar para mañana?",
  4: "¡Qué bueno que te sientes bien hoy! Es genial reconocer estos momentos positivos. ¿Qué crees que contribuyó a que te sintieras así?",
  5: "¡Excelente! Me alegra saber que tuviste un buen día. Celebrar estos momentos es muy importante para tu bienestar mental.",
  6: "¡Wow! Parece que fue un día fantástico. Es maravilloso cuando nos sentimos así. ¿Qué te gustaría recordar de este día?",
  7: "¡Increíble! Un día así merece ser celebrado. Tu energía positiva es contagiosa. ¡Sigue brillando!"
};

// Función helper para obtener el mensaje de IA
export const getDemoAIMessage = (moodValue: number): string => {
  return aiMessages[moodValue] || aiMessages[4]; // Default a "Bien" si no existe
}; 