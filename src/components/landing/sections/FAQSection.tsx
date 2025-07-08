import { useState } from 'react';
import { faqData } from '../data';

interface FAQSectionProps {
  theme: 'light' | 'dark';
}

export const FAQSection = ({ theme }: FAQSectionProps) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className={`landing-faq-section ${theme}`} id="preguntas">
      <div className="landing-faq-content">
        <div className="faq-header">
          <div className="faq-text-content">
            <h2 className={`landing-faq-title ${theme}`}>
              Preguntas Frecuentes
            </h2>
            <p className={`landing-faq-subtitle ${theme}`}>
              Resolvemos las dudas más comunes sobre Mente Sana. Haz clic en cualquier pregunta para ver la respuesta.
            </p>
          </div>
        </div>
        
        <div className="faq-list">
          {faqData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={`faq-item ${theme} ${openFAQ === index ? 'open' : ''}`} 
                onClick={() => toggleFAQ(index)}
              >
                <div className={`faq-question ${theme}`}>
                  <IconComponent className="faq-icon" size={20} />
                  <span className="faq-question-text">{item.question}</span>
                  <span className={`faq-arrow ${openFAQ === index ? 'open' : ''}`}>▼</span>
                </div>
                <div className={`faq-answer ${theme} ${openFAQ === index ? 'open' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 