import { Lock, Bot, UserCheck, Heart, Calendar, AlertTriangle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface FAQItem {
  icon: LucideIcon;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    icon: Lock,
    question: '¿Mis datos son privados y seguros?',
    answer: 'Absolutamente. Tus registros emocionales son completamente privados y encriptados. Solo tú puedes acceder a ellos. No compartimos tu información con nadie, incluyendo padres o terceros, sin tu consentimiento expreso.'
  },
  {
    icon: Bot,
    question: '¿Cómo funciona la inteligencia artificial?',
    answer: 'Nuestra IA analiza el estado de ánimo que seleccionas y el mensaje que escribes para generar respuestas empáticas y personalizadas. Utiliza algoritmos diseñados específicamente para acompañarte emocionalmente, pero no diagnostica ni prescribe tratamientos.'
  },
  {
    icon: UserCheck,
    question: '¿Reemplaza ir al psicólogo?',
    answer: 'No, somos un complemento, no un reemplazo. Te ayudamos con el autocuidado diario y el seguimiento emocional, pero siempre recomendamos buscar ayuda profesional para temas más serios. Puedes compartir tus registros con tu terapeuta si lo deseas.'
  },
  {
    icon: Heart,
    question: '¿Es completamente gratis?',
    answer: 'Sí, todas las funciones principales son completamente gratuitas: registro emocional, respuestas de IA, acceso a blogs y eventos. Nuestro objetivo es que todos los adolescentes tengan acceso a herramientas de bienestar mental.'
  },
  {
    icon: Calendar,
    question: '¿Desde qué edad puedo usarla?',
    answer: 'La app está diseñada para adolescentes de 13 a 18 años. Si eres menor de 16 años, es recomendable que converses con tus padres sobre tu uso de la app, aunque no es obligatorio.'
  },
  {
    icon: AlertTriangle,
    question: '¿Qué pasa si estoy en crisis?',
    answer: 'Si te encuentras en una crisis emocional grave, busca ayuda inmediata. Te proporcionamos números de emergencia y recursos de crisis. Nuestra app es para apoyo diario, no para situaciones de emergencia.'
  }
]; 